import model.Tower;
import pathfinding.Node;
import ui.GameRenderer;

import javax.swing.JPanel;
import javax.swing.Timer;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;

/**
 * Main Java Swing Game Panel.
 * Implements MouseListener, MouseMotionListener, and KeyListener for event handling.
 * Drives the ~60 FPS simulation loop using javax.swing.Timer.
 * Course: CSA0913 – Programming in Java.
 */
public class GamePanel extends JPanel implements ActionListener, MouseListener, MouseMotionListener, KeyListener {
    private final GameController controller;
    private final GameRenderer renderer;
    private final Timer gameTimer;
    private long lastTime;

    public GamePanel(GameController controller) {
        this.controller = controller;
        this.renderer = new GameRenderer(GameController.CELL_SIZE, GameController.COLS, GameController.ROWS);

        int panelWidth = GameController.COLS * GameController.CELL_SIZE;
        int panelHeight = GameController.ROWS * GameController.CELL_SIZE;
        setPreferredSize(new Dimension(panelWidth, panelHeight));
        setFocusable(true);

        addMouseListener(this);
        addMouseMotionListener(this);
        addKeyListener(this);

        this.lastTime = System.nanoTime();
        // 60 FPS delta loop timer (16 milliseconds)
        this.gameTimer = new Timer(16, this);
        this.gameTimer.start();
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        long now = System.nanoTime();
        double deltaTime = (now - lastTime) / 1_000_000_000.0;
        lastTime = now;

        // Cap deltaTime to prevent quantum jumps during window drags
        deltaTime = Math.min(deltaTime, 0.05);

        controller.update(deltaTime);
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

        renderer.render(
            g2d,
            controller.getState(),
            controller.getPathfinder(),
            controller.getActivePath(),
            controller.getTowers(),
            controller.getEnemies(),
            controller.getCombatSystem().getActiveProjectiles(),
            controller.getSelectedTower(),
            controller.getHoveredNode(),
            controller.getPlayer(),
            controller.getResourceManager(),
            controller.getWaveManager(),
            GameController.SPAWN_X, GameController.SPAWN_Y,
            GameController.BASE_X, GameController.BASE_Y
        );
    }

    // --- Mouse Event Handling ---
    @Override
    public void mouseClicked(MouseEvent e) {
        int gridX = e.getX() / GameController.CELL_SIZE;
        int gridY = e.getY() / GameController.CELL_SIZE;

        if (e.getButton() == MouseEvent.BUTTON1) { // Left click
            // Check if clicking existing tower
            boolean towerFound = false;
            for (Tower t : controller.getTowers()) {
                if (t.getGridX() == gridX && t.getGridY() == gridY) {
                    controller.setSelectedTower(t);
                    towerFound = true;
                    break;
                }
            }

            if (!towerFound) {
                // Attempt to place selected tower type
                controller.placeTower(gridX, gridY, controller.getSelectedTowerTypeToPlace());
            }
        } else if (e.getButton() == MouseEvent.BUTTON3) { // Right click: deselect
            controller.setSelectedTower(null);
        }
    }

    @Override
    public void mouseMoved(MouseEvent e) {
        int gridX = e.getX() / GameController.CELL_SIZE;
        int gridY = e.getY() / GameController.CELL_SIZE;

        if (controller.getPathfinder().isValidCoordinate(gridX, gridY)) {
            controller.setHoveredNode(new Node(gridX, gridY, false));
        } else {
            controller.setHoveredNode(null);
        }
    }

    // --- Keyboard Event Handling ---
    @Override
    public void keyPressed(KeyEvent e) {
        int code = e.getKeyCode();
        if (code == KeyEvent.VK_SPACE) {
            if (!controller.getWaveManager().isWaveInProgress()) {
                controller.startNextWave();
            } else {
                controller.togglePause();
            }
        } else if (code == KeyEvent.VK_1) {
            controller.setSelectedTowerTypeToPlace(Tower.Type.GATLING);
        } else if (code == KeyEvent.VK_2) {
            controller.setSelectedTowerTypeToPlace(Tower.Type.PULSE_LASER);
        } else if (code == KeyEvent.VK_3) {
            controller.setSelectedTowerTypeToPlace(Tower.Type.PLASMA_MORTAR);
        } else if (code == KeyEvent.VK_U) {
            controller.upgradeSelectedTower();
        } else if (code == KeyEvent.VK_S || code == KeyEvent.VK_DELETE) {
            controller.sellSelectedTower();
        } else if (code == KeyEvent.VK_ESCAPE) {
            controller.setSelectedTower(null);
        }
    }

    @Override public void mousePressed(MouseEvent e) {}
    @Override public void mouseReleased(MouseEvent e) {}
    @Override public void mouseEntered(MouseEvent e) {}
    @Override public void mouseExited(MouseEvent e) { controller.setHoveredNode(null); }
    @Override public void mouseDragged(MouseEvent e) {}
    @Override public void keyTyped(KeyEvent e) {}
    @Override public void keyReleased(KeyEvent e) {}
}
