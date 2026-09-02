import { Enemy } from './Enemy';

export class Projectile {
  public x: number;
  public y: number;
  public readonly startX: number;
  public readonly startY: number;
  public targetX: number;
  public targetY: number;
  public targetEnemy: Enemy | null;
  public speed: number;
  public damage: number;
  public splashRadius: number;
  public color: string;
  public bulletType: 'bullet' | 'laser' | 'cannon';
  public isDead: boolean = false;
  private lifeTime: number = 0;
  private maxLifeTime: number = 2.5; // safety expiry

  constructor(
    startX: number,
    startY: number,
    targetEnemy: Enemy | null,
    targetX: number,
    targetY: number,
    speed: number,
    damage: number,
    splashRadius: number,
    color: string,
    bulletType: 'bullet' | 'laser' | 'cannon'
  ) {
    this.startX = startX;
    this.startY = startY;
    this.x = startX;
    this.y = startY;
    this.targetEnemy = targetEnemy;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = speed;
    this.damage = damage;
    this.splashRadius = splashRadius;
    this.color = color;
    this.bulletType = bulletType;
  }

  public update(
    dt: number,
    enemies: Enemy[],
    onHit: (p: Projectile, hitEnemy: Enemy | null) => void
  ) {
    if (this.isDead) return;

    this.lifeTime += dt;
    if (this.lifeTime >= this.maxLifeTime) {
      this.isDead = true;
      return;
    }

    // Update target coordinates if tracking an active enemy
    if (this.targetEnemy && this.targetEnemy.isAlive) {
      this.targetX = this.targetEnemy.x;
      this.targetY = this.targetEnemy.y;
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    // Laser hits almost instantaneously or in short duration
    if (this.bulletType === 'laser') {
      this.x = this.targetX;
      this.y = this.targetY;
      this.isDead = true;
      onHit(this, this.targetEnemy);
      return;
    }

    const step = this.speed * dt;

    if (dist <= step || dist < 10) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.isDead = true;
      onHit(this, this.targetEnemy);
    } else {
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * step;
      this.y += Math.sin(angle) * step;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.isDead) return;

    ctx.save();

    if (this.bulletType === 'laser') {
      // Draw instant pulsing laser beam
      ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
      ctx.lineTo(this.targetX, this.targetY);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Bright inner core
      ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
      ctx.lineTo(this.targetX, this.targetY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (this.bulletType === 'cannon') {
      // Cannon shell with fiery aura
      ctx.beginPath();
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 12;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else {
      // Standard kinetic bullet
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    ctx.restore();
  }
}
