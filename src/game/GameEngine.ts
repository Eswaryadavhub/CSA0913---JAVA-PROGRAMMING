import {
  findAStarPath,
  Point,
  AStarResult,
  pointKey,
} from '../algorithms/AStar';
import {
  CellType,
  Difficulty,
  EnemyType,
  GameState,
  GameStats,
  TowerType,
} from '../data/gameTypes';
import { DIFFICULTY_CONFIGS } from '../data/difficultyData';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_SIZE,
  DEFAULT_BASE_POINT,
  DEFAULT_GRID_MAP,
  DEFAULT_SPAWN_POINT,
  getCellCenter,
  GRID_COLS,
  GRID_ROWS,
  pixelToGrid,
} from '../data/mapData';
import { TOWERS_CONFIG } from '../data/towersData';
import { Economy } from './Economy';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { soundManager } from './SoundManager';
import { Tower } from './Tower';
import { VisualEffectsManager } from './VisualEffects';
import { WaveManager, WaveStatus } from './WaveManager';

export interface GameEngineListener {
  onStateChange?: (state: GameState) => void;
  onCoinsChange?: (coins: number) => void;
  onHealthChange?: (health: number) => void;
  onWaveChange?: (wave: number, total: number) => void;
  onEnemiesChange?: (remaining: number) => void;
  onStatsChange?: (stats: GameStats) => void;
  onNotification?: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export class GameEngine {
  // Game State
  public state: GameState = GameState.MENU;
  public difficulty: Difficulty = Difficulty.MEDIUM;
  public baseHealth: number = 100;
  public maxBaseHealth: number = 100;
  public gameSpeed: number = 1.0; // 0.5x, 1x, 2x

  // Grid & Map
  public grid: number[][] = [];
  public spawnPoint: Point = { ...DEFAULT_SPAWN_POINT };
  public basePoint: Point = { ...DEFAULT_BASE_POINT };
  public currentAStarResult: AStarResult | null = null;
  public showAStarVisuals: boolean = false;
  public hoveredGridNode: Point | null = null;

  // Entities
  public towers: Tower[] = [];
  public enemies: Enemy[] = [];
  public projectiles: Projectile[] = [];
  public selectedTower: Tower | null = null;
  public selectedTowerTypeToPlace: TowerType | null = null;

  // Subsystems
  public economy: Economy;
  public waveManager: WaveManager;
  public vfx: VisualEffectsManager;

  // Statistics
  public stats: GameStats = {
    score: 0,
    enemiesDefeated: 0,
    towersBuilt: 0,
    towersUpgraded: 0,
    coinsEarned: 0,
    coinsSpent: 0,
    wavesCompleted: 0,
    damageDealt: 0,
    baseDamageReceived: 0,
    durationSeconds: 0,
  };

  private listeners: GameEngineListener[] = [];
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private enemyIdCounter: number = 0;
  private towerIdCounter: number = 0;

  constructor() {
    this.economy = new Economy(300);
    this.waveManager = new WaveManager();
    this.vfx = new VisualEffectsManager();
    this.resetMap();
    this.recalculateAStarPath();
  }

  public addListener(listener: GameEngineListener) {
    this.listeners.push(listener);
  }

  public removeListener(listener: GameEngineListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notify(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    this.listeners.forEach((l) => l.onNotification?.(message, type));
  }

  private notifyStats() {
    this.listeners.forEach((l) => l.onStatsChange?.({ ...this.stats }));
  }

  private notifyState() {
    this.listeners.forEach((l) => l.onStateChange?.(this.state));
  }

  private notifyCoins() {
    this.listeners.forEach((l) => l.onCoinsChange?.(this.economy.getBalance()));
  }

  private notifyHealth() {
    this.listeners.forEach((l) => l.onHealthChange?.(this.baseHealth));
  }

  private notifyWave() {
    this.listeners.forEach((l) =>
      l.onWaveChange?.(this.waveManager.getCurrentWaveNumber(), this.waveManager.getTotalWaves())
    );
  }

  private notifyEnemies() {
    this.listeners.forEach((l) => l.onEnemiesChange?.(this.enemies.length));
  }

  public resetMap() {
    this.grid = DEFAULT_GRID_MAP.map((row) => [...row]);
    this.spawnPoint = { ...DEFAULT_SPAWN_POINT };
    this.basePoint = { ...DEFAULT_BASE_POINT };
  }

  /**
   * Recalculates the optimal A* path based on current grid & obstacles
   */
  public recalculateAStarPath(): AStarResult {
    // Custom walkable function: paths, open walkable, base, and spawn are walkable for enemies.
    // Obstacles (1) and placed towers are impassable.
    const towerPositions = new Set(this.towers.map((t) => pointKey({ x: t.gridX, y: t.gridY })));

    const isWalkable = (val: number, x: number, y: number) => {
      if (towerPositions.has(pointKey({ x, y }))) return false;
      // Walkable (0), Path (3), Base (4), Spawn (5) are passable
      return val === CellType.WALKABLE || val === CellType.ENEMY_PATH || val === CellType.BASE || val === CellType.SPAWN;
    };

    const result = findAStarPath(this.grid, this.spawnPoint, this.basePoint, isWalkable, true);
    this.currentAStarResult = result;
    return result;
  }

  /**
   * Set difficulty level and reset matching parameters
   */
  public setDifficulty(diff: Difficulty) {
    this.difficulty = diff;
    const config = DIFFICULTY_CONFIGS[diff];
    this.baseHealth = config.startingHealth;
    this.maxBaseHealth = config.startingHealth;
    this.economy.reset(config.startingCoins);
    this.notifyCoins();
    this.notifyHealth();
  }

  /**
   * Starts a new game session with selected difficulty
   */
  public startNewGame(difficulty: Difficulty = this.difficulty) {
    this.setDifficulty(difficulty);
    this.state = GameState.PLAYING;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.selectedTower = null;
    this.selectedTowerTypeToPlace = null;
    this.vfx.clear();
    this.waveManager.reset();
    this.resetMap();
    this.recalculateAStarPath();

    this.stats = {
      score: 0,
      enemiesDefeated: 0,
      towersBuilt: 0,
      towersUpgraded: 0,
      coinsEarned: DIFFICULTY_CONFIGS[difficulty].startingCoins,
      coinsSpent: 0,
      wavesCompleted: 0,
      damageDealt: 0,
      baseDamageReceived: 0,
      durationSeconds: 0,
    };

    this.notifyState();
    this.notifyCoins();
    this.notifyHealth();
    this.notifyWave();
    this.notifyEnemies();
    this.notifyStats();
    this.notify(`Defense initialized on ${DIFFICULTY_CONFIGS[difficulty].label}!`, 'info');

    this.startLoop();
  }

  /**
   * Starts the current enemy wave
   */
  public startWave(): boolean {
    if (this.state !== GameState.PLAYING && this.state !== GameState.WAVE_COMPLETE) {
      this.notify('Cannot trigger wave in current game state.', 'warning');
      return false;
    }

    const started = this.waveManager.startWave();
    if (started) {
      this.state = GameState.PLAYING;
      soundManager.playWaveStart();
      this.notify(`Wave ${this.waveManager.getCurrentWaveNumber()} initiated!`, 'info');
      this.notifyState();
      this.notifyWave();
    }
    return started;
  }

  /**
   * Pauses the active game loop
   */
  public pauseGame() {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED;
      this.notifyState();
      this.notify('Tactical simulation paused.', 'info');
    }
  }

  /**
   * Resumes the paused game loop
   */
  public resumeGame() {
    if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING;
      this.lastTimestamp = performance.now();
      this.notifyState();
      this.notify('Tactical simulation resumed.', 'info');
    }
  }

  /**
   * Toggles game speed between 0.5x, 1x, and 2x
   */
  public setSpeed(speed: number) {
    this.gameSpeed = speed;
    this.notify(`Simulation rate adjusted to ${speed}x`, 'info');
  }

  /**
   * Validates whether a tower can be placed at the specified grid cell
   */
  public canPlaceTowerAt(gridX: number, gridY: number, towerType: TowerType): { allowed: boolean; reason: string } {
    // 1. Check bounds
    if (gridX < 0 || gridX >= GRID_COLS || gridY < 0 || gridY >= GRID_ROWS) {
      return { allowed: false, reason: 'Placement location is outside operational bounds.' };
    }

    // 2. Check cost
    const cost = TOWERS_CONFIG[towerType].cost;
    if (!this.economy.canAfford(cost)) {
      return { allowed: false, reason: `Insufficient funds! Need ${cost} coins, but have ${this.economy.getBalance()}.` };
    }

    // 3. Check tile type
    const cellValue = this.grid[gridY][gridX];
    if (cellValue === CellType.OBSTACLE) {
      return { allowed: false, reason: 'Cannot place defenses on impassable environmental obstacles.' };
    }
    if (cellValue === CellType.ENEMY_PATH) {
      return { allowed: false, reason: 'Tower placement on active enemy march routes is strictly prohibited.' };
    }
    if (cellValue === CellType.BASE || cellValue === CellType.SPAWN) {
      return { allowed: false, reason: 'Cannot place towers directly on Headquarters or Rift portals.' };
    }

    // 4. Check if a tower is already placed here
    const existing = this.towers.find((t) => t.gridX === gridX && t.gridY === gridY);
    if (existing) {
      return { allowed: false, reason: 'A defensive turret already occupies this emplacement.' };
    }

    return { allowed: true, reason: 'Valid strategic placement position.' };
  }

  /**
   * Places a tower at grid position
   */
  public placeTower(gridX: number, gridY: number, towerType: TowerType): boolean {
    const validation = this.canPlaceTowerAt(gridX, gridY, towerType);
    if (!validation.allowed) {
      soundManager.playError();
      this.notify(validation.reason, 'error');
      return false;
    }

    const config = TOWERS_CONFIG[towerType];
    if (!this.economy.spend(config.cost, `Built ${config.name}`)) {
      return false;
    }

    this.towerIdCounter++;
    const newTower = new Tower(`tower-${this.towerIdCounter}`, towerType, { x: gridX, y: gridY });
    this.towers.push(newTower);
    this.selectedTower = newTower;
    this.selectedTowerTypeToPlace = null;

    this.stats.towersBuilt++;
    this.stats.coinsSpent += config.cost;

    soundManager.playPlace();
    this.vfx.addCoinText(newTower.x, newTower.y, -config.cost);
    this.notify(`${config.name} successfully deployed for ${config.cost} coins!`, 'success');

    this.notifyCoins();
    this.notifyStats();
    return true;
  }

  /**
   * Upgrades the currently selected tower
   */
  public upgradeSelectedTower(): boolean {
    if (!this.selectedTower) {
      this.notify('No tower selected for upgrade.', 'warning');
      return false;
    }

    const cost = this.selectedTower.getUpgradeCost();
    if (cost === 0) {
      this.notify('Tower has reached maximum upgrade rank.', 'info');
      return false;
    }

    if (!this.economy.canAfford(cost)) {
      soundManager.playError();
      this.notify(`Insufficient coins to upgrade! Cost: ${cost} coins.`, 'error');
      return false;
    }

    if (this.economy.spend(cost, `Upgraded ${this.selectedTower.type} to Rank ${this.selectedTower.level + 1}`)) {
      this.selectedTower.upgrade();
      this.stats.towersUpgraded++;
      this.stats.coinsSpent += cost;

      soundManager.playUpgrade();
      this.vfx.addCoinText(this.selectedTower.x, this.selectedTower.y, -cost);
      this.notify(`${this.selectedTower.type} upgraded to Level ${this.selectedTower.level}!`, 'success');

      this.notifyCoins();
      this.notifyStats();
      return true;
    }

    return false;
  }

  /**
   * Sells the currently selected tower
   */
  public sellSelectedTower(): boolean {
    if (!this.selectedTower) return false;

    const refund = this.selectedTower.getSellValue();
    const index = this.towers.indexOf(this.selectedTower);
    if (index !== -1) {
      const soldX = this.selectedTower.x;
      const soldY = this.selectedTower.y;
      this.towers.splice(index, 1);
      this.selectedTower = null;

      this.economy.earn(refund, 'Sold turret emplacement');
      this.vfx.addCoinText(soldX, soldY, refund);
      soundManager.playCoin();
      this.notify(`Turret decommissioned. Recovered ${refund} coins.`, 'info');

      this.notifyCoins();
      return true;
    }
    return false;
  }

  /**
   * Spawns an enemy of the given type along the optimal A* path
   */
  private spawnEnemy(type: EnemyType) {
    if (!this.currentAStarResult || this.currentAStarResult.path.length === 0) {
      this.recalculateAStarPath();
    }

    const path = this.currentAStarResult ? [...this.currentAStarResult.path] : [];
    if (path.length === 0) return;

    this.enemyIdCounter++;
    const diffConfig = DIFFICULTY_CONFIGS[this.difficulty];

    const enemy = new Enemy(
      `enemy-${this.enemyIdCounter}`,
      type,
      path,
      diffConfig.enemyHealthMultiplier,
      diffConfig.enemySpeedMultiplier,
      diffConfig.rewardMultiplier
    );

    this.enemies.push(enemy);
    this.notifyEnemies();
  }

  /**
   * Projectile hit callback handling single target and AoE splash damage
   */
  private handleProjectileHit(projectile: Projectile, hitEnemy: Enemy | null) {
    if (projectile.splashRadius > 0) {
      // Splash damage handling (Heavy Cannon)
      soundManager.playExplosion();
      this.vfx.addExplosion(projectile.x, projectile.y, projectile.splashRadius);

      for (const enemy of this.enemies) {
        if (!enemy.isAlive) continue;
        const dist = Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y);
        if (dist <= projectile.splashRadius) {
          // Linear falloff splash damage
          const falloff = 1 - (dist / projectile.splashRadius) * 0.45;
          const damageApplied = Math.round(projectile.damage * falloff);
          const fatal = enemy.takeDamage(damageApplied);

          this.stats.damageDealt += damageApplied;
          this.vfx.addDamageText(enemy.x, enemy.y, damageApplied);
          this.vfx.addHitSparks(enemy.x, enemy.y, projectile.color, 4);

          if (fatal) {
            this.handleEnemyDefeated(enemy);
          }
        }
      }
    } else if (hitEnemy && hitEnemy.isAlive) {
      // Single target damage
      soundManager.playHit();
      const fatal = hitEnemy.takeDamage(projectile.damage);

      this.stats.damageDealt += projectile.damage;
      this.vfx.addDamageText(hitEnemy.x, hitEnemy.y, projectile.damage);
      this.vfx.addHitSparks(hitEnemy.x, hitEnemy.y, projectile.color, 6);

      if (fatal) {
        this.handleEnemyDefeated(hitEnemy);
      }
    }
  }

  /**
   * Rewards coins and updates statistics on enemy kill
   */
  private handleEnemyDefeated(enemy: Enemy) {
    soundManager.playCoin();
    this.economy.earn(enemy.reward, `Destroyed ${enemy.name}`);
    this.vfx.addCoinText(enemy.x, enemy.y, enemy.reward);

    this.stats.enemiesDefeated++;
    this.stats.coinsEarned += enemy.reward;
    this.stats.score += enemy.reward * 10;

    this.notifyCoins();
    this.notifyStats();
  }

  /**
   * Main simulation update loop
   */
  public update(dt: number) {
    if (this.state !== GameState.PLAYING) return;

    // Apply simulation speed multiplier
    const scaledDt = dt * this.gameSpeed;
    this.stats.durationSeconds += scaledDt;

    // 1. Update wave spawner
    this.waveManager.update(scaledDt, (type) => this.spawnEnemy(type));

    // 2. Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const reachedBase = enemy.update(scaledDt);

      if (reachedBase) {
        // Damage base
        this.baseHealth = Math.max(0, this.baseHealth - enemy.damageToBase);
        this.stats.baseDamageReceived += enemy.damageToBase;
        soundManager.playExplosion();
        this.vfx.addExplosion(enemy.x, enemy.y, 30);
        this.notify(`Enemy breached defenses! Base sustained -${enemy.damageToBase} HP damage.`, 'warning');
        this.notifyHealth();
        this.notifyStats();

        this.enemies.splice(i, 1);
        this.notifyEnemies();

        if (this.baseHealth <= 0) {
          this.triggerGameOver();
          return;
        }
      } else if (!enemy.isAlive) {
        this.enemies.splice(i, 1);
        this.notifyEnemies();
      }
    }

    // 3. Update towers (targeting & firing)
    for (const tower of this.towers) {
      tower.update(scaledDt, this.enemies, (proj) => {
        this.projectiles.push(proj);
        soundManager.playShoot(tower.bulletType);
      });
    }

    // 4. Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.update(scaledDt, this.enemies, (p, hitEnemy) => {
        this.handleProjectileHit(p, hitEnemy);
      });
      if (proj.isDead) {
        this.projectiles.splice(i, 1);
      }
    }

    // 5. Update visual effects
    this.vfx.update(scaledDt);

    // 6. Check wave completion
    if (
      this.waveManager.getStatus() === WaveStatus.IN_PROGRESS &&
      this.enemies.length === 0
    ) {
      const bonus = this.waveManager.completeCurrentWave();
      this.economy.earn(bonus, `Wave bonus`);
      this.stats.wavesCompleted++;
      this.stats.score += bonus * 5;
      this.vfx.addCoinText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, bonus);
      soundManager.playVictory();

      this.notifyCoins();
      this.notifyStats();

      if (this.waveManager.getStatus() === WaveStatus.ALL_CLEARED) {
        this.triggerVictory();
      } else {
        this.state = GameState.WAVE_COMPLETE;
        this.notify(`Wave cleared! Defense bonus: +${bonus} coins awarded. Ready for next wave.`, 'success');
        this.notifyState();
        this.notifyWave();
      }
    }
  }

  private triggerGameOver() {
    this.state = GameState.GAME_OVER;
    soundManager.playGameOver();
    this.notify('MISSION FAILED: Base defenses collapsed!', 'error');
    this.notifyState();
    this.stopLoop();
  }

  private triggerVictory() {
    this.state = GameState.VICTORY;
    soundManager.playVictory();
    this.notify('MISSION ACCOMPLISHED: All 10 enemy invasion waves repelled!', 'success');
    this.notifyState();
    this.stopLoop();
  }

  /**
   * Game loop driver using requestAnimationFrame
   */
  public startLoop() {
    this.stopLoop();
    if (typeof performance !== 'undefined') {
      this.lastTimestamp = performance.now();
    }

    if (typeof requestAnimationFrame === 'undefined') {
      return; // Headless / Unit test environment safety
    }

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1); // Clamp max 100ms
      this.lastTimestamp = timestamp;

      this.update(dt);
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stopLoop() {
    if (this.animationFrameId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Save current game state to localStorage
   */
  public saveGame(): boolean {
    try {
      const saveData = {
        difficulty: this.difficulty,
        baseHealth: this.baseHealth,
        coins: this.economy.getBalance(),
        wave: this.waveManager.getCurrentWaveNumber(),
        stats: this.stats,
        towers: this.towers.map((t) => ({
          type: t.type,
          gridX: t.gridX,
          gridY: t.gridY,
          level: t.level,
        })),
        timestamp: Date.now(),
      };
      localStorage.setItem('tower_defence_save', JSON.stringify(saveData));
      this.notify('Tactical deployment state successfully saved.', 'success');
      return true;
    } catch {
      this.notify('Failed to save state to browser storage.', 'error');
      return false;
    }
  }

  /**
   * Load saved game state from localStorage
   */
  public loadGame(): boolean {
    try {
      const raw = localStorage.getItem('tower_defence_save');
      if (!raw) {
        this.notify('No saved session found in browser memory.', 'warning');
        return false;
      }
      const data = JSON.parse(raw);
      this.difficulty = data.difficulty || Difficulty.MEDIUM;
      this.baseHealth = data.baseHealth || 100;
      this.economy.reset(data.coins || 300);
      this.stats = data.stats || this.stats;

      // Restore towers
      this.towers = [];
      if (Array.isArray(data.towers)) {
        for (const tData of data.towers) {
          const t = new Tower(`tower-${++this.towerIdCounter}`, tData.type, { x: tData.gridX, y: tData.gridY });
          for (let lvl = 1; lvl < tData.level; lvl++) {
            t.upgrade();
          }
          this.towers.push(t);
        }
      }

      this.enemies = [];
      this.projectiles = [];
      this.state = GameState.PLAYING;
      this.recalculateAStarPath();

      this.notifyState();
      this.notifyCoins();
      this.notifyHealth();
      this.notifyWave();
      this.notifyEnemies();
      this.notifyStats();
      this.notify('Saved operational deployment restored!', 'success');
      return true;
    } catch {
      this.notify('Corrupted or incompatible save file.', 'error');
      return false;
    }
  }

  /**
   * Primary render pass for the 900x600 canvas
   */
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Grid Tiles
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const val = this.grid[y][x];
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        // Base tile background
        if (val === CellType.ENEMY_PATH) {
          // March road
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          // Road texture border
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        } else if (val === CellType.TOWER_ZONE) {
          // Prepared stone platform
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px + 3, py + 3, CELL_SIZE - 6, CELL_SIZE - 6);
          // Platform inner crosshair
          ctx.beginPath();
          ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
        } else if (val === CellType.OBSTACLE) {
          // Rocky crags / obstacle
          ctx.fillStyle = '#090d16';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);
          // Obstacle rock symbol
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.moveTo(px + 10, py + 40);
          ctx.lineTo(px + 25, py + 12);
          ctx.lineTo(px + 40, py + 40);
          ctx.closePath();
          ctx.fill();
        } else if (val === CellType.SPAWN) {
          // Invasion Rift Portal
          ctx.fillStyle = '#831843';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          // Portal spiral effect
          ctx.beginPath();
          ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, 14, 0, Math.PI * 2);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
        } else if (val === CellType.BASE) {
          // Player Headquarters / Crystal
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          // Crystal diamond
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(px + CELL_SIZE / 2, py + 8);
          ctx.lineTo(px + CELL_SIZE - 8, py + CELL_SIZE / 2);
          ctx.lineTo(px + CELL_SIZE / 2, py + CELL_SIZE - 8);
          ctx.lineTo(px + 8, py + CELL_SIZE / 2);
          ctx.closePath();
          ctx.fill();
        } else {
          // Open walkable ground
          ctx.fillStyle = '#0b0f19';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // 2. A* Path & Visualizer Overlays (If enabled)
    if (this.showAStarVisuals && this.currentAStarResult) {
      // Draw closed set nodes (blue tint)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.22)';
      for (const node of this.currentAStarResult.closedSetSnapshot) {
        ctx.fillRect(node.x * CELL_SIZE, node.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      // Draw open set nodes (green tint)
      ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
      for (const node of this.currentAStarResult.openSetSnapshot) {
        ctx.fillRect(node.x * CELL_SIZE, node.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(node.x * CELL_SIZE + 1, node.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      }

      // Draw reconstructed optimal A* path line
      if (this.currentAStarResult.path.length > 1) {
        ctx.beginPath();
        const startPixel = getCellCenter(this.currentAStarResult.path[0]);
        ctx.moveTo(startPixel.x, startPixel.y);

        for (let i = 1; i < this.currentAStarResult.path.length; i++) {
          const pt = getCellCenter(this.currentAStarResult.path[i]);
          ctx.lineTo(pt.x, pt.y);
        }

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Path waypoint nodes
        for (const pt of this.currentAStarResult.path) {
          const center = getCellCenter(pt);
          ctx.beginPath();
          ctx.arc(center.x, center.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      }

      // Draw cost numbers on hovered node
      if (this.hoveredGridNode) {
        const key = pointKey(this.hoveredGridNode);
        const details = this.currentAStarResult.nodeDetails.get(key);
        if (details) {
          const px = this.hoveredGridNode.x * CELL_SIZE;
          const py = this.hoveredGridNode.y * CELL_SIZE;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);

          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#22c55e';
          ctx.fillText(`G:${details.g}`, px + 3, py + 12);
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`H:${details.h}`, px + 3, py + 26);
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(`F:${details.f}`, px + 3, py + 42);
        }
      }
    }

    // 3. Draw Placed Towers
    for (const tower of this.towers) {
      const isSelected = this.selectedTower?.id === tower.id;
      tower.draw(ctx, isSelected);
      if (isSelected) {
        tower.drawRange(ctx, true);
      }
    }

    // 4. Tower Placement Preview (under cursor)
    if (this.selectedTowerTypeToPlace && this.hoveredGridNode) {
      const px = this.hoveredGridNode.x * CELL_SIZE;
      const py = this.hoveredGridNode.y * CELL_SIZE;
      const validation = this.canPlaceTowerAt(this.hoveredGridNode.x, this.hoveredGridNode.y, this.selectedTowerTypeToPlace);

      ctx.fillStyle = validation.allowed ? 'rgba(56, 189, 248, 0.35)' : 'rgba(239, 68, 68, 0.4)';
      ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
      ctx.strokeStyle = validation.allowed ? '#38bdf8' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);

      // Range indicator preview
      const range = TOWERS_CONFIG[this.selectedTowerTypeToPlace].range;
      const center = getCellCenter(this.hoveredGridNode);
      ctx.save();
      ctx.beginPath();
      ctx.arc(center.x, center.y, range, 0, Math.PI * 2);
      ctx.fillStyle = validation.allowed ? 'rgba(56, 189, 248, 0.12)' : 'rgba(239, 68, 68, 0.15)';
      ctx.fill();
      ctx.strokeStyle = validation.allowed ? 'rgba(56, 189, 248, 0.7)' : 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.restore();
    }

    // 5. Draw Enemies
    for (const enemy of this.enemies) {
      enemy.draw(ctx);
    }

    // 6. Draw Projectiles
    for (const proj of this.projectiles) {
      proj.draw(ctx);
    }

    // 7. Draw Visual Effects (Particles and Floating Text)
    this.vfx.draw(ctx);
  }
}
