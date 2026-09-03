import { Point } from '../algorithms/AStar';
import { TargetingMode, TowerStats, TowerType } from '../data/gameTypes';
import { TOWERS_CONFIG } from '../data/towersData';
import { CELL_SIZE, getCellCenter } from '../data/mapData';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';

export class Tower {
  public readonly id: string;
  public readonly type: TowerType;
  public readonly gridX: number;
  public readonly gridY: number;
  public readonly x: number;
  public readonly y: number;

  public level: number = 1;
  public readonly maxLevel: number = 3;
  public damage: number;
  public range: number;
  public fireRate: number; // shots per second
  public splashRadius: number;
  public projectileSpeed: number;
  public color: string;
  public projectileColor: string;
  public bulletType: 'bullet' | 'laser' | 'cannon';

  public targetingMode: TargetingMode = TargetingMode.FIRST;
  public currentTarget: Enemy | null = null;
  public rotationAngle: number = 0; // In radians
  public cooldownTimer: number = 0;
  public totalDamageDealt: number = 0;
  public totalCoinsInvested: number;

  private config: TowerStats;

  constructor(id: string, type: TowerType, gridPos: Point) {
    this.id = id;
    this.type = type;
    this.gridX = gridPos.x;
    this.gridY = gridPos.y;

    const center = getCellCenter(gridPos);
    this.x = center.x;
    this.y = center.y;

    this.config = TOWERS_CONFIG[type];
    this.damage = this.config.damage;
    this.range = this.config.range;
    this.fireRate = this.config.fireRate;
    this.splashRadius = this.config.splashRadius;
    this.projectileSpeed = this.config.projectileSpeed;
    this.color = this.config.color;
    this.projectileColor = this.config.projectileColor;
    this.bulletType = this.config.bulletType;
    this.totalCoinsInvested = this.config.cost;
  }

  /**
   * Calculates cost for next level upgrade (0 if max level)
   */
  public getUpgradeCost(): number {
    if (this.level >= this.maxLevel) return 0;
    return this.config.upgradeCosts[this.level - 1];
  }

  /**
   * Calculates refund value if sold (70% of total invested)
   */
  public getSellValue(): number {
    return Math.floor(this.totalCoinsInvested * 0.7);
  }

  /**
   * Upgrades tower to next level
   */
  public upgrade(): boolean {
    if (this.level >= this.maxLevel) return false;

    const cost = this.getUpgradeCost();
    this.totalCoinsInvested += cost;
    this.level++;

    this.damage = Math.round(this.damage * this.config.damageMultiplierPerLevel);
    this.range = Math.round(this.range * this.config.rangeMultiplierPerLevel);
    this.fireRate = Number((this.fireRate * this.config.fireRateMultiplierPerLevel).toFixed(2));

    return true;
  }

  /**
   * Searches and selects the optimal target based on targeting mode
   */
  public findTarget(enemies: Enemy[]): Enemy | null {
    const enemiesInRange = enemies.filter((e) => {
      if (!e.isAlive) return false;
      const dist = Math.hypot(e.x - this.x, e.y - this.y);
      return dist <= this.range;
    });

    if (enemiesInRange.length === 0) {
      this.currentTarget = null;
      return null;
    }

    let target: Enemy | null = null;

    switch (this.targetingMode) {
      case TargetingMode.FIRST:
        // Enemy that has traveled the furthest along the path
        target = enemiesInRange.reduce((prev, curr) =>
          curr.distanceTraveled > prev.distanceTraveled ? curr : prev
        );
        break;

      case TargetingMode.CLOSEST:
        // Euclidean closest to tower
        target = enemiesInRange.reduce((prev, curr) => {
          const dCurr = Math.hypot(curr.x - this.x, curr.y - this.y);
          const dPrev = Math.hypot(prev.x - this.x, prev.y - this.y);
          return dCurr < dPrev ? curr : prev;
        });
        break;

      case TargetingMode.LOWEST_HP:
        // Lowest remaining absolute health
        target = enemiesInRange.reduce((prev, curr) =>
          curr.health < prev.health ? curr : prev
        );
        break;

      case TargetingMode.STRONGEST:
        // Highest current health
        target = enemiesInRange.reduce((prev, curr) =>
          curr.health > prev.health ? curr : prev
        );
        break;
    }

    this.currentTarget = target;
    if (target) {
      this.rotationAngle = Math.atan2(target.y - this.y, target.x - this.x);
    }
    return target;
  }

  /**
   * Updates tower cooldown and fires a projectile if ready and target in range
   */
  public update(
    dt: number,
    enemies: Enemy[],
    onFire: (projectile: Projectile) => void
  ) {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= dt;
    }

    const target = this.findTarget(enemies);

    if (target && this.cooldownTimer <= 0) {
      // Cooldown in seconds = 1 / fireRate
      this.cooldownTimer = 1 / this.fireRate;

      // Spawn projectile
      const proj = new Projectile(
        this.x,
        this.y,
        target,
        target.x,
        target.y,
        this.projectileSpeed,
        this.damage,
        this.splashRadius,
        this.projectileColor,
        this.bulletType
      );

      onFire(proj);
    }
  }

  /**
   * Draw the 3D isometric modeled tower structure onto the canvas
   */
  public draw(ctx: CanvasRenderingContext2D, isSelected: boolean = false) {
    ctx.save();

    // 1. 3D Isometric Drop Shadow
    ctx.beginPath();
    ctx.ellipse(this.x + 6, this.y + 14, CELL_SIZE * 0.45, CELL_SIZE * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fill();

    // 2. 3D Pedestal Base (Hexagonal / Beveled Platform)
    const baseRadius = CELL_SIZE * 0.38;
    const heightExtrusion = 10; // Vertical 3D depth

    // Base front-face 3D extrusion (giving physical height)
    ctx.beginPath();
    ctx.moveTo(this.x - baseRadius, this.y);
    ctx.lineTo(this.x - baseRadius, this.y + heightExtrusion);
    ctx.lineTo(this.x + baseRadius, this.y + heightExtrusion);
    ctx.lineTo(this.x + baseRadius, this.y);
    ctx.closePath();
    ctx.fillStyle = '#090d16'; // Deep shaded under-wall
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pedestal top rim
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, baseRadius, baseRadius * 0.65, 0, 0, Math.PI * 2);
    const pedGrad = ctx.createLinearGradient(this.x - baseRadius, this.y, this.x + baseRadius, this.y);
    pedGrad.addColorStop(0, '#1e293b');
    pedGrad.addColorStop(0.5, '#334155');
    pedGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = pedGrad;
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. 3D Central Pillar Column
    const pillarHeight = 16 + this.level * 3; // Taller with upgrades!
    const pillarRadius = 14;

    // Pillar side walls
    ctx.beginPath();
    ctx.rect(this.x - pillarRadius, this.y - pillarHeight, pillarRadius * 2, pillarHeight);
    const colGrad = ctx.createLinearGradient(this.x - pillarRadius, this.y - pillarHeight, this.x + pillarRadius, this.y);
    colGrad.addColorStop(0, '#475569');
    colGrad.addColorStop(0.3, '#94a3b8');
    colGrad.addColorStop(0.7, '#334155');
    colGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = colGrad;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tower Level Insignia Rings on pillar
    for (let i = 0; i < this.level; i++) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(this.x - pillarRadius + 2, this.y - 4 - i * 5, pillarRadius * 2 - 4, 2);
    }

    // 4. Elevated 3D Turret Head (Positioned at top of pillar: this.y - pillarHeight)
    const turretY = this.y - pillarHeight;

    ctx.save();
    ctx.translate(this.x, turretY);
    ctx.rotate(this.rotationAngle);

    // Rotating 3D Cannon Barrel(s)
    if (this.type === TowerType.HEAVY) {
      // 3D Twin Plasma Mortar Barrels
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, -7, 24, 6);
      ctx.fillRect(0, 1, 24, 6);

      // Barrel muzzle caps with glowing plasma
      ctx.fillStyle = this.color;
      ctx.fillRect(20, -8, 6, 8);
      ctx.fillRect(20, 0, 6, 8);
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
    } else if (this.type === TowerType.RAPID) {
      // 3D Photon Laser Emitter with angled cooling fins
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(26, -1);
      ctx.lineTo(26, 1);
      ctx.lineTo(0, 6);
      ctx.closePath();
      ctx.fill();

      // Laser lens
      ctx.fillStyle = '#34d399';
      ctx.fillRect(24, -3, 5, 6);
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
    } else {
      // 3D Gatling Sentry with triple kinetic barrel
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, -4.5, 22, 9);
      ctx.fillStyle = this.color;
      ctx.fillRect(18, -5.5, 5, 11);
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
    }

    // 3D Turret Dome / Cockpit
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    const domeGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 12);
    domeGrad.addColorStop(0, '#ffffff');
    domeGrad.addColorStop(0.4, this.color);
    domeGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = domeGrad;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // 5. Target Laser Lock Indicator Line
    if (this.currentTarget && this.currentTarget.isAlive) {
      ctx.beginPath();
      ctx.moveTo(this.x, turretY);
      ctx.lineTo(this.currentTarget.x, this.currentTarget.y);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Selection Highlight Ring
    if (isSelected) {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, baseRadius + 4, (baseRadius + 4) * 0.65, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draw the range circle overlay
   */
  public drawRange(ctx: CanvasRenderingContext2D, isValid: boolean = true) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.fillStyle = isValid ? 'rgba(56, 189, 248, 0.12)' : 'rgba(239, 68, 68, 0.15)';
    ctx.fill();
    ctx.strokeStyle = isValid ? 'rgba(56, 189, 248, 0.6)' : 'rgba(239, 68, 68, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}
