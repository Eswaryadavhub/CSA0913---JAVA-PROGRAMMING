import engine.CombatSystem;
import engine.ResourceManager;
import engine.UpgradeSystem;
import engine.WaveManager;
import model.Enemy;
import model.GameState;
import model.Player;
import model.Tower;
import pathfinding.AStarPathfinder;
import pathfinding.Node;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Central Game Controller orchestrating the Tower Defence simulation lifecycle,
 * event dispatches, path calculation, combat ticks, and state evaluations.
 * Course: CSA0913 – Programming in Java.
 */
public class GameController {
    public static final int COLS = 18;
    public static final int ROWS = 12;
    public static final int CELL_SIZE = 50;

    public static final int SPAWN_X = 0;
    public static final int SPAWN_Y = 2;
    public static final int BASE_X = 17;
    public static final int BASE_Y = 9;

    private GameState state;
    private final Player player;
    private final ResourceManager resourceManager;
    private final UpgradeSystem upgradeSystem;
    private final CombatSystem combatSystem;
    private final WaveManager waveManager;
    private final AStarPathfinder pathfinder;

    private final List<Tower> towers;
    private final List<Enemy> enemies;
    private List<Node> activePath;

    private Tower selectedTower;
    private Tower.Type selectedTowerTypeToPlace;
    private Node hoveredNode;

    public GameController() {
        this.state = GameState.PLAYING;
        this.player = new Player(100);
        this.resourceManager = new ResourceManager(300);
        this.upgradeSystem = new UpgradeSystem(resourceManager);
        this.combatSystem = new CombatSystem(resourceManager, player);
        this.waveManager = new WaveManager(resourceManager);
        this.pathfinder = new AStarPathfinder(COLS, ROWS);

        this.towers = new ArrayList<>();
        this.enemies = new ArrayList<>();
        this.selectedTower = null;
        this.selectedTowerTypeToPlace = Tower.Type.GATLING;
        this.hoveredNode = null;

        setupEnvironmentCrags();
        recalculatePath();
    }

    private void setupEnvironmentCrags() {
        // Place initial tactical obstacle crags on map
        int[][] crags = {
            {5, 2}, {5, 3}, {5, 4}, {5, 5},
            {9, 6}, {9, 7}, {9, 8}, {9, 9},
            {13, 3}, {13, 4}, {13, 5}
        };
        for (int[] crag : crags) {
            pathfinder.setObstacle(crag[0], crag[1], true);
        }
    }

    public void recalculatePath() {
        this.activePath = pathfinder.findPath(SPAWN_X, SPAWN_Y, BASE_X, BASE_Y);
    }

    public void update(double deltaTime) {
        if (state != GameState.PLAYING) return;

        // 1. Update wave spawner
        Enemy spawned = waveManager.update(deltaTime, activePath, CELL_SIZE, enemies);
        if (spawned != null) {
            enemies.add(spawned);
        }

        // 2. Update creep movement & base breach check
        Iterator<Enemy> it = enemies.iterator();
        while (it.hasNext()) {
            Enemy enemy = it.next();
            enemy.update(deltaTime, CELL_SIZE);

            if (enemy.hasReachedBase()) {
                player.takeDamage(enemy.getBaseDamage());
                it.remove();
            } else if (!enemy.isAlive()) {
                it.remove();
            }
        }

        // 3. Update combat subsystem
        combatSystem.update(deltaTime, towers, enemies);

        // 4. Game state condition evaluation
        if (!player.isAlive()) {
            state = GameState.GAME_OVER;
        } else if (waveManager.isAllWavesCompleted() && enemies.isEmpty()) {
            state = GameState.VICTORY;
        }
    }

    public boolean placeTower(int gridX, int gridY, Tower.Type type) {
        if (!pathfinder.isValidCoordinate(gridX, gridY)) return false;
        if ((gridX == SPAWN_X && gridY == SPAWN_Y) || (gridX == BASE_X && gridY == BASE_Y)) return false;
        if (pathfinder.isObstacle(gridX, gridY)) return false;

        // Check if tower already exists
        for (Tower t : towers) {
            if (t.getGridX() == gridX && t.getGridY() == gridY) return false;
        }

        // Temporary placement to check path validity (cannot completely block spawn to base)
        pathfinder.setObstacle(gridX, gridY, true);
        List<Node> testPath = pathfinder.findPath(SPAWN_X, SPAWN_Y, BASE_X, BASE_Y);

        if (testPath.isEmpty()) {
            // Revert - would block path completely
            pathfinder.setObstacle(gridX, gridY, false);
            return false;
        }

        int cost = (type == Tower.Type.PLASMA_MORTAR) ? 175 : (type == Tower.Type.PULSE_LASER) ? 125 : 100;
        if (!resourceManager.spend(cost)) {
            pathfinder.setObstacle(gridX, gridY, false);
            return false;
        }

        Tower newTower = new Tower("T-" + (towers.size() + 1), type, gridX, gridY, CELL_SIZE);
        towers.add(newTower);
        recalculatePath();

        // Update all alive enemies with new recalculated path
        for (Enemy e : enemies) {
            e.updatePath(activePath, CELL_SIZE);
        }

        selectedTower = newTower;
        return true;
    }

    public void upgradeSelectedTower() {
        if (selectedTower != null) {
            upgradeSystem.upgradeTower(selectedTower);
        }
    }

    public void sellSelectedTower() {
        if (selectedTower != null) {
            upgradeSystem.sellTower(selectedTower);
            pathfinder.setObstacle(selectedTower.getGridX(), selectedTower.getGridY(), false);
            towers.remove(selectedTower);
            selectedTower = null;
            recalculatePath();
        }
    }

    public void togglePause() {
        if (state == GameState.PLAYING) {
            state = GameState.PAUSED;
        } else if (state == GameState.PAUSED) {
            state = GameState.PLAYING;
        }
    }

    public void startNextWave() {
        if (state == GameState.PLAYING) {
            waveManager.startNextWave();
        }
    }

    // Getters & Setters
    public GameState getState() { return state; }
    public Player getPlayer() { return player; }
    public ResourceManager getResourceManager() { return resourceManager; }
    public WaveManager getWaveManager() { return waveManager; }
    public CombatSystem getCombatSystem() { return combatSystem; }
    public AStarPathfinder getPathfinder() { return pathfinder; }
    public List<Tower> getTowers() { return towers; }
    public List<Enemy> getEnemies() { return enemies; }
    public List<Node> getActivePath() { return activePath; }
    public Tower getSelectedTower() { return selectedTower; }
    public void setSelectedTower(Tower tower) { this.selectedTower = tower; }
    public Tower.Type getSelectedTowerTypeToPlace() { return selectedTowerTypeToPlace; }
    public void setSelectedTowerTypeToPlace(Tower.Type type) { this.selectedTowerTypeToPlace = type; }
    public Node getHoveredNode() { return hoveredNode; }
    public void setHoveredNode(Node node) { this.hoveredNode = node; }
}
