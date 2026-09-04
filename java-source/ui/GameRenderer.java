package ui;

import engine.CombatSystem;
import engine.ResourceManager;
import engine.WaveManager;
import model.Enemy;
import model.GameState;
import model.Player;
import model.Tower;
import pathfinding.AStarPathfinder;
import pathfinding.Node;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.util.List;

/**
 * Dedicated Java Swing Graphics2D rendering engine.
 * Renders the 18x12 tactical grid, terrain crags, A* shortest path,
 * 3D-styled towers, creep movement, projectiles, range circles, and HUD stats.
 */
public class GameRenderer {
    private final int cellSize;
    private final int cols;
    private final int rows;

    // Tactical Strategy Palette (Graphite / Emerald / Warm Gold / Slate)
    private final Color bgColor = new Color(10, 13, 20);
    private final Color gridLineColor = new Color(255, 255, 255, 12);
    private final Color obstacleColor = new Color(30, 41, 59);
    private final Color pathGlowColor = new Color(16, 185, 129, 60);
    private final Color pathLineColor = new Color(52, 211, 153, 180);
    private final Color spawnColor = new Color(245, 158, 11);
    private final Color baseColor = new Color(16, 185, 129);

    public GameRenderer(int cellSize, int cols, int rows) {
        this.cellSize = cellSize;
        this.cols = cols;
        this.rows = rows;
    }

    public void render(Graphics2D g2d, GameState state, AStarPathfinder pathfinder,
                       List<Node> activePath, List<Tower> towers, List<Enemy> enemies,
                       List<CombatSystem.Projectile> projectiles, Tower selectedTower,
                       Node hoveredNode, Player player, ResourceManager resourceManager,
                       WaveManager waveManager, int startX, int startY, int targetX, int targetY) {

        // Enable high-fidelity antialiasing
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        // 1. Clear background
        g2d.setColor(bgColor);
        g2d.fillRect(0, 0, cols * cellSize, rows * cellSize);

        // 2. Draw tactical grid cells & obstacles
        for (int x = 0; x < cols; x++) {
            for (int y = 0; y < rows; y++) {
                int px = x * cellSize;
                int py = y * cellSize;

                if (pathfinder.isObstacle(x, y)) {
                    g2d.setColor(obstacleColor);
                    g2d.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                    g2d.setColor(new Color(51, 65, 85));
                    g2d.drawRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                } else {
                    g2d.setColor(gridLineColor);
                    g2d.drawRect(px, py, cellSize, cellSize);
                }
            }
        }

        // 3. Draw A* shortest path line
        if (activePath != null && activePath.size() > 1) {
            g2d.setColor(pathGlowColor);
            g2d.setStroke(new BasicStroke(8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
            for (int i = 0; i < activePath.size() - 1; i++) {
                Node n1 = activePath.get(i);
                Node n2 = activePath.get(i + 1);
                g2d.drawLine(
                    n1.getX() * cellSize + cellSize / 2, n1.getY() * cellSize + cellSize / 2,
                    n2.getX() * cellSize + cellSize / 2, n2.getY() * cellSize + cellSize / 2
                );
            }

            g2d.setColor(pathLineColor);
            g2d.setStroke(new BasicStroke(2.5f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
            for (int i = 0; i < activePath.size() - 1; i++) {
                Node n1 = activePath.get(i);
                Node n2 = activePath.get(i + 1);
                g2d.drawLine(
                    n1.getX() * cellSize + cellSize / 2, n1.getY() * cellSize + cellSize / 2,
                    n2.getX() * cellSize + cellSize / 2, n2.getY() * cellSize + cellSize / 2
                );
            }
        }

        // 4. Draw Spawn Portal and Defensive Base
        drawPortal(g2d, startX * cellSize, startY * cellSize, spawnColor, "SPAWN");
        drawPortal(g2d, targetX * cellSize, targetY * cellSize, baseColor, "BASE");

        // 5. Draw Hover indicator
        if (hoveredNode != null) {
            g2d.setColor(new Color(16, 185, 129, 80));
            g2d.fillRect(hoveredNode.getX() * cellSize, hoveredNode.getY() * cellSize, cellSize, cellSize);
            g2d.setColor(new Color(52, 211, 153));
            g2d.setStroke(new BasicStroke(1.5f));
            g2d.drawRect(hoveredNode.getX() * cellSize, hoveredNode.getY() * cellSize, cellSize, cellSize);
        }

        // 6. Draw Towers
        for (Tower tower : towers) {
            drawTower(g2d, tower, tower == selectedTower);
        }

        // 7. Draw Enemies
        for (Enemy enemy : enemies) {
            drawEnemy(g2d, enemy);
        }

        // 8. Draw Projectiles
        g2d.setColor(new Color(251, 191, 36)); // Amber tracer
        g2d.setStroke(new BasicStroke(3f));
        for (CombatSystem.Projectile p : projectiles) {
            g2d.fillOval((int) p.x - 3, (int) p.y - 3, 6, 6);
        }

        // 9. Selected Tower Range Circle
        if (selectedTower != null) {
            g2d.setColor(new Color(16, 185, 129, 35));
            int r = (int) selectedTower.getRange();
            g2d.fillOval((int) selectedTower.getWorldX() - r, (int) selectedTower.getWorldY() - r, r * 2, r * 2);
            g2d.setColor(new Color(16, 185, 129, 160));
            g2d.setStroke(new BasicStroke(1.5f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new float[]{6, 4}, 0));
            g2d.drawOval((int) selectedTower.getWorldX() - r, (int) selectedTower.getWorldY() - r, r * 2, r * 2);
        }

        // 10. Top Tactical HUD Bar
        drawHUD(g2d, player, resourceManager, waveManager, state);
    }

    private void drawPortal(Graphics2D g2d, int x, int y, Color c, String label) {
        g2d.setColor(new Color(c.getRed(), c.getGreen(), c.getBlue(), 60));
        g2d.fillRoundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 10, 10);
        g2d.setColor(c);
        g2d.setStroke(new BasicStroke(2f));
        g2d.drawRoundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 10, 10);

        g2d.setFont(new Font("SansSerif", Font.BOLD, 10));
        g2d.setColor(Color.WHITE);
        g2d.drawString(label, x + 6, y + cellSize / 2 + 4);
    }

    private void drawTower(Graphics2D g2d, Tower tower, boolean isSelected) {
        int x = (int) tower.getWorldX();
        int y = (int) tower.getWorldY();

        // Base pedestal (3D shaded oval)
        g2d.setColor(new Color(15, 23, 42));
        g2d.fillOval(x - 18, y - 12, 36, 24);
        g2d.setColor(tower.getPrimaryColor());
        g2d.setStroke(new BasicStroke(1.5f));
        g2d.drawOval(x - 18, y - 12, 36, 24);

        // Central turret column
        g2d.setColor(new Color(30, 41, 59));
        g2d.fillOval(x - 10, y - 18, 20, 20);

        // Rotating cannon barrel
        AffineTransform old = g2d.getTransform();
        g2d.translate(x, y - 8);
        g2d.rotate(tower.getRotationAngle());

        g2d.setColor(new Color(15, 23, 42));
        g2d.fillRect(0, -3, 20, 6);
        g2d.setColor(tower.getPrimaryColor());
        g2d.fillRect(16, -4, 4, 8);

        // Turret cap
        g2d.setColor(Color.WHITE);
        g2d.fillOval(-4, -4, 8, 8);

        g2d.setTransform(old);

        // Selection ring
        if (isSelected) {
            g2d.setColor(new Color(52, 211, 153));
            g2d.setStroke(new BasicStroke(2f));
            g2d.drawOval(x - 22, y - 16, 44, 32);
        }
    }

    private void drawEnemy(Graphics2D g2d, Enemy enemy) {
        int x = (int) enemy.getX();
        int y = (int) enemy.getY();
        int sz = enemy.getSize();

        // Shadow
        g2d.setColor(new Color(0, 0, 0, 100));
        g2d.fillOval(x - sz, y + sz / 2, sz * 2, sz / 2);

        // Creep body
        g2d.setColor(enemy.getColor());
        g2d.fillOval(x - sz / 2, y - sz / 2, sz, sz);
        g2d.setColor(Color.WHITE);
        g2d.setStroke(new BasicStroke(1.5f));
        g2d.drawOval(x - sz / 2, y - sz / 2, sz, sz);

        // Health bar
        int barW = 24;
        int barH = 4;
        int barX = x - barW / 2;
        int barY = y - sz - 6;

        g2d.setColor(new Color(0, 0, 0, 180));
        g2d.fillRect(barX, barY, barW, barH);

        int currentW = (int) (barW * enemy.getHealthPercentage());
        g2d.setColor(new Color(16, 185, 129));
        g2d.fillRect(barX, barY, currentW, barH);
        g2d.setColor(Color.GRAY);
        g2d.drawRect(barX, barY, barW, barH);
    }

    private void drawHUD(Graphics2D g2d, Player player, ResourceManager resourceManager, WaveManager waveManager, GameState state) {
        g2d.setColor(new Color(15, 23, 42, 220));
        g2d.fillRect(0, 0, cols * cellSize, 32);
        g2d.setColor(new Color(255, 255, 255, 30));
        g2d.drawLine(0, 32, cols * cellSize, 32);

        g2d.setFont(new Font("SansSerif", Font.BOLD, 12));

        // Base HP
        g2d.setColor(new Color(239, 68, 68));
        g2d.drawString("♥ Base HP: " + player.getBaseHealth() + " / " + player.getMaxHealth(), 16, 21);

        // Gold/Coins
        g2d.setColor(new Color(245, 158, 11));
        g2d.drawString("⛁ Coins: " + resourceManager.getCoins(), 180, 21);

        // Wave Progress
        g2d.setColor(new Color(52, 211, 153));
        g2d.drawString("🌊 Wave: " + waveManager.getCurrentWave() + " / " + waveManager.getTotalWaves(), 310, 21);

        // Score
        g2d.setColor(Color.WHITE);
        g2d.drawString("★ Score: " + player.getScore(), 440, 21);

        // Status
        g2d.setColor(new Color(148, 163, 184));
        g2d.drawString("Status: " + state.name() + " | Hotkeys: [Space]=Wave/Pause [1/2/3]=Towers", 580, 21);
    }
}
