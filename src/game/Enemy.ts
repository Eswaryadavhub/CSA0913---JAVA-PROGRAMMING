import { Point } from '../algorithms/AStar';
import { EnemyStats, EnemyType } from '../data/gameTypes';
import { ENEMIES_CONFIG } from '../data/enemiesData';
import { CELL_SIZE, getCellCenter } from '../data/mapData';

export class Enemy {
  public readonly id: string;
  public readonly type: EnemyType;
  public readonly name: string;
  public health: number;
  public maxHealth: number;
  public speed: number;
  public reward: number;
  public damageToBase: number;
  public size: number;
  public color: string;
  public glowColor: string;

  public x: number;
  public y: number;
  public path: Point[];
  public pathIndex: number = 0;
  public distanceTraveled: number = 0;
  public isAlive: boolean = true;
  public reachedBase: boolean = false;
  public hitFlashTimer: number = 0;

  constructor(
    id: string,
    type: EnemyType,
    path: Point[],
    healthMultiplier: number = 1.0,
    speedMultiplier: number = 1.0,
    rewardMultiplier: number = 1.0
  ) {
    this.id = id;
    this.type = type;
    const config: EnemyStats = ENEMIES_CONFIG[type];
    this.name = config.name;

    this.maxHealth = Math.round(config.maxHealth * healthMultiplier);
    this.health = this.maxHealth;
    this.speed = config.speed * speedMultiplier;
    this.reward = Math.round(config.reward * rewardMultiplier);
    this.damageToBase = config.damageToBase;
    this.size = config.size;
    this.color = config.color;
    this.glowColor = config.glowColor;

    this.path = path;
    if (path.length > 0) {
      const center = getCellCenter(path[0]);
      this.x = center.x;
      this.y = center.y;
    } else {
      this.x = 0;
      this.y = 0;
    }
  }

  /**
   * Updates enemy position along the A* calculated waypoints.
   * @param dt Delta time in seconds
   * @returns boolean true if reached base
   */
  public update(dt: number): boolean {
    if (!this.isAlive || this.reachedBase) return false;

    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= dt;
    }

    if (this.path.length === 0 || this.pathIndex >= this.path.length - 1) {
      this.reachedBase = true;
      this.isAlive = false;
      return true;
    }

    const nextTargetPoint = this.path[this.pathIndex + 1];
    const targetPixel = getCellCenter(nextTargetPoint);

    const dx = targetPixel.x - this.x;
    const dy = targetPixel.y - this.y;
    const distanceToNext = Math.hypot(dx, dy);

    const moveDistance = this.speed * dt;
    this.distanceTraveled += moveDistance;

    if (distanceToNext <= moveDistance) {
      // Reached this waypoint
      this.x = targetPixel.x;
      this.y = targetPixel.y;
      this.pathIndex++;

      if (this.pathIndex >= this.path.length - 1) {
        this.reachedBase = true;
        this.isAlive = false;
        return true;
      }
    } else {
      // Move towards next waypoint
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * moveDistance;
      this.y += Math.sin(angle) * moveDistance;
    }

    return false;
  }

  /**
   * Takes damage and triggers hit flash
   * @returns true if enemy died from this hit
   */
  public takeDamage(amount: number): boolean {
    if (!this.isAlive) return false;

    this.health -= amount;
    this.hitFlashTimer = 0.12; // Flash white on hit

    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;
      return true;
    }
    return false;
  }

  /**
   * Updates the enemy path dynamically if grid obstacles change
   */
  public updatePath(newPath: Point[], currentGridPos: Point) {
    // Find closest waypoint in new path or start from current position
    let bestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < newPath.length; i++) {
      const center = getCellCenter(newPath[i]);
      const dist = Math.hypot(center.x - this.x, center.y - this.y);
      if (dist < minDistance) {
        minDistance = dist;
        bestIndex = i;
      }
    }

    this.path = newPath;
    this.pathIndex = bestIndex;
  }

  /**
   * Render enemy with health bar and glowing aura
   */
  public draw(ctx: CanvasRenderingContext2D) {
    if (!this.isAlive) return;

    ctx.save();

    // Subtle shadow / ground contact
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + this.size * 0.8, this.size * 0.9, this.size * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Outer glow
    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = this.hitFlashTimer > 0 ? 16 : 8;

    // Enemy body
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : this.color;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Type emblem / visual detail
    ctx.shadowBlur = 0;
    if (this.type === EnemyType.STRONG) {
      // Hexagonal armored plate
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size, this.size);
    } else if (this.type === EnemyType.FAST) {
      // Speed arrow chevron
      ctx.beginPath();
      ctx.moveTo(this.x - this.size * 0.4, this.y + this.size * 0.4);
      ctx.lineTo(this.x + this.size * 0.5, this.y);
      ctx.lineTo(this.x - this.size * 0.4, this.y - this.size * 0.4);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Inner core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
    }

    // Health Bar
    const barWidth = this.size * 2.2;
    const barHeight = 4;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.size - 9;

    // Background track
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

    // Current health ratio
    const healthRatio = Math.max(0, this.health / this.maxHealth);
    const healthColor = healthRatio > 0.5 ? '#22c55e' : healthRatio > 0.25 ? '#eab308' : '#ef4444';

    ctx.fillStyle = healthColor;
    ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);

    ctx.restore();
  }
}
