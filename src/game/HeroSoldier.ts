import { Point } from '../algorithms/AStar';
import { Enemy } from './Enemy';
import { CELL_SIZE, getCellCenter } from '../data/mapData';

export class HeroSoldier {
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public speed: number = 130; // pixels per second (fast response)
  public health: number = 200;
  public maxHealth: number = 200;
  public damage: number = 35;
  public attackRange: number = 65;
  public attackCooldown: number = 0.6;
  public cooldownTimer: number = 0;
  public isMoving: boolean = false;
  public level: number = 1;
  public kills: number = 0;
  public currentTarget: Enemy | null = null;
  public rallyPoint: Point;

  constructor(initialGridPos: Point = { x: 8, y: 5 }) {
    const center = getCellCenter(initialGridPos);
    this.x = center.x;
    this.y = center.y;
    this.targetX = center.x;
    this.targetY = center.y;
    this.rallyPoint = { ...initialGridPos };
  }

  public setRallyPoint(pixelX: number, pixelY: number) {
    this.targetX = pixelX;
    this.targetY = pixelY;
    this.isMoving = true;
    this.rallyPoint = {
      x: Math.floor(pixelX / CELL_SIZE),
      y: Math.floor(pixelY / CELL_SIZE),
    };
  }

  public update(
    dt: number,
    enemies: Enemy[],
    onAttack: (hero: HeroSoldier, enemy: Enemy) => void
  ) {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= dt;
    }

    // Move toward target location if rallied
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distToTarget = Math.hypot(dx, dy);

    if (distToTarget > 4) {
      this.isMoving = true;
      const step = Math.min(distToTarget, this.speed * dt);
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * step;
      this.y += Math.sin(angle) * step;
    } else {
      this.isMoving = false;
    }

    // Search for enemies to intercept within combat range
    const enemiesInRange = enemies.filter((e) => {
      if (!e.isAlive) return false;
      return Math.hypot(e.x - this.x, e.y - this.y) <= this.attackRange;
    });

    if (enemiesInRange.length > 0) {
      // Engage closest enemy
      this.currentTarget = enemiesInRange.reduce((prev, curr) => {
        const dPrev = Math.hypot(prev.x - this.x, prev.y - this.y);
        const dCurr = Math.hypot(curr.x - this.x, curr.y - this.y);
        return dCurr < dPrev ? curr : prev;
      });

      if (this.cooldownTimer <= 0 && this.currentTarget) {
        this.cooldownTimer = this.attackCooldown;
        onAttack(this, this.currentTarget);
      }
    } else {
      this.currentTarget = null;
    }
  }

  public onKill() {
    this.kills++;
    if (this.kills % 5 === 0) {
      this.level++;
      this.damage += 10;
      this.maxHealth += 30;
      this.health = this.maxHealth;
    }
  }

  public draw(ctx: CanvasRenderingContext2D, isSelected: boolean = false) {
    ctx.save();

    // Ground shadow
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 12, 16, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // 3D Isometric Hero Soldier Model
    // 1. Lower chassis / boots (dark metallic)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(this.x - 7, this.y + 2, 14, 8);

    // 2. Armored 3D Torso (Emerald Tactical gradient with lighting)
    const torsoGrad = ctx.createLinearGradient(this.x - 8, this.y - 12, this.x + 8, this.y + 2);
    torsoGrad.addColorStop(0, '#34d399');
    torsoGrad.addColorStop(1, '#059669');
    ctx.fillStyle = torsoGrad;
    ctx.beginPath();
    ctx.roundRect(this.x - 9, this.y - 12, 18, 14, 3);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. Cybernetic Visor / Helmet (3D dome)
    ctx.beginPath();
    ctx.arc(this.x, this.y - 16, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Glowing Emerald Visor Line
    ctx.fillStyle = '#34d399';
    ctx.fillRect(this.x - 4, this.y - 18, 8, 3);

    // 4. Plasma Sword / Blaster arm
    ctx.save();
    if (this.currentTarget) {
      // Aim at target
      const angle = Math.atan2(this.currentTarget.y - this.y, this.currentTarget.x - this.x);
      ctx.translate(this.x, this.y - 6);
      ctx.rotate(angle);
      // Sword blade
      ctx.beginPath();
      ctx.moveTo(8, -2);
      ctx.lineTo(24, 0);
      ctx.lineTo(8, 2);
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      ctx.fill();
    } else {
      // Idle sword raised
      ctx.fillStyle = '#34d399';
      ctx.fillRect(this.x + 8, this.y - 16, 3, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.x + 8, this.y - 18, 3, 4);
    }
    ctx.restore();

    // Hero Rank Banner & Health Bar
    const barWidth = 28;
    const barHeight = 4;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(this.x - barWidth / 2 - 1, this.y - 28, barWidth + 2, barHeight + 2);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(this.x - barWidth / 2, this.y - 27, barWidth * (this.health / this.maxHealth), barHeight);

    // Level Badge
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.fillText(`HERO LV.${this.level}`, this.x, this.y - 32);

    // Selection ring or rally line
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 22, 0, Math.PI * 2);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw dashed line to rally destination
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.targetX, this.targetY);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rally target icon
      ctx.beginPath();
      ctx.arc(this.targetX, this.targetY, 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.fill();
    }

    ctx.restore();
  }
}
