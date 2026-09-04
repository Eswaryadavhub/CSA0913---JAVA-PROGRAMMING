package engine;

import model.Enemy;
import pathfinding.Node;

import java.util.ArrayList;
import java.util.List;

/**
 * Manages wave generation, progressive enemy difficulty escalation,
 * creep spawning intervals, and wave victory bonus payouts.
 */
public class WaveManager {
    private int currentWave;
    private final int totalWaves = 10;
    private boolean waveInProgress;
    private double spawnTimer;
    private int enemiesLeftToSpawn;
    private double waveDelayTimer;

    private final ResourceManager resourceManager;

    public WaveManager(ResourceManager resourceManager) {
        this.resourceManager = resourceManager;
        this.currentWave = 0;
        this.waveInProgress = false;
        this.spawnTimer = 0;
        this.enemiesLeftToSpawn = 0;
        this.waveDelayTimer = 0;
    }

    public void startNextWave() {
        if (currentWave < totalWaves && !waveInProgress) {
            currentWave++;
            waveInProgress = true;
            // Wave enemy quantity escalates: 6 + wave * 2
            enemiesLeftToSpawn = 5 + currentWave * 2;
            spawnTimer = 0;
        }
    }

    /**
     * Updates wave spawning queues using delta time.
     * Returns a newly spawned Enemy if spawn interval elapsed, otherwise null.
     */
    public Enemy update(double deltaTime, List<Node> activePath, int cellSize, List<Enemy> currentActiveEnemies) {
        if (!waveInProgress) {
            return null;
        }

        // Check if wave is cleared
        if (enemiesLeftToSpawn == 0 && currentActiveEnemies.isEmpty()) {
            waveInProgress = false;
            // Completion dividend: 50 + wave * 15 coins
            resourceManager.addCoins(50 + currentWave * 15);
            return null;
        }

        if (enemiesLeftToSpawn > 0) {
            spawnTimer -= deltaTime;
            if (spawnTimer <= 0) {
                spawnTimer = Math.max(0.6, 1.4 - (currentWave * 0.06)); // Faster spawns on later waves
                enemiesLeftToSpawn--;

                // Determine enemy type based on wave composition
                Enemy.Type type;
                if (currentWave >= 4 && enemiesLeftToSpawn % 4 == 0) {
                    type = Enemy.Type.STRONG;
                } else if (currentWave >= 2 && enemiesLeftToSpawn % 2 == 0) {
                    type = Enemy.Type.FAST;
                } else {
                    type = Enemy.Type.BASIC;
                }

                String id = "W" + currentWave + "-E" + enemiesLeftToSpawn;
                return new Enemy(id, type, activePath, cellSize);
            }
        }

        return null;
    }

    public void reset() {
        currentWave = 0;
        waveInProgress = false;
        spawnTimer = 0;
        enemiesLeftToSpawn = 0;
        waveDelayTimer = 0;
    }

    public int getCurrentWave() { return currentWave; }
    public int getTotalWaves() { return totalWaves; }
    public boolean isWaveInProgress() { return waveInProgress; }
    public boolean isAllWavesCompleted() {
        return currentWave >= totalWaves && !waveInProgress;
    }
}
