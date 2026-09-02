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
   * Draw the tower onto the canvas
   */
  public draw(ctx: CanvasRenderingContext2D, isSelected: boolean = false) {
    ctx.save();

    // Tower base platform
    ctx.beginPath();
    ctx.arc(this.x, this.y, CELL_SIZE * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b'; // Slate dark platform
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Level indicator dots/bars
    for (let i = 0; i < this.level; i++) {
      ctx.beginPath();
      const dotX = this.x - (this.level - 1) * 5 + i * 10;
      const dotY = this.y + CELL_SIZE * 0.3;
      ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    }

    // Rotating turret turret head
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotationAngle);

    if (this.type === TowerType.HEAVY) {
      // Heavy twin barrel or thick mortar
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, -6, 20, 12);
      ctx.fillStyle = this.color;
      ctx.fillRect(16, -7, 5, 14);
    } else if (this.type === TowerType.RAPID) {
      // Sleek pointed laser barrel
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(22, 0);
      ctx.lineTo(0, 4);
      ctx.closePath();
      ctx.fill();
    } else {
      // Basic Gatling barrel
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, -3.5, 18, 7);
      ctx.fillStyle = this.color;
      ctx.fillRect(14, -4.5, 4, 9);
    }

    // Central pivot dome
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Target lock indicator line if targeted
    if (this.currentTarget && this.currentTarget.isAlive) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.currentTarget.x, this.currentTarget.y);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
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
