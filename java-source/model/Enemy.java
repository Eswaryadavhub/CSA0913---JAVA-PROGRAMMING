package model;

import pathfinding.Node;
import java.awt.Color;
import java.util.List;

/**
 * Represents an autonomous hostile creep navigating through the tactical grid.
 * Demonstrates Object-Oriented inheritance, state tracking, and waypoint traversal.
 */
public class Enemy {
    public enum Type { BASIC, FAST, STRONG }

    private final String id;
    private final Type type;
    private double x;
    private double y;
    private int health;
    private final int maxHealth;
    private final double speed; // pixels per second
    private final int rewardCoins;
    private final int baseDamage;
    private final Color color;
    private final int size;

    private List<Node> path;
    private int currentPathIndex;
    private boolean alive;
    private boolean reachedBase;

    public Enemy(String id, Type type, List<Node> path, int cellSize) {
        this.id = id;
        this.type = type;
        this.path = path;
        this.currentPathIndex = 0;
        this.alive = true;
        this.reachedBase = false;

        // Position at spawn cell center
        if (path != null && !path.isEmpty()) {
            this.x = path.get(0).getX() * cellSize + (cellSize / 2.0);
            this.y = path.get(0).getY() * cellSize + (cellSize / 2.0);
        } else {
            this.x = 0;
            this.y = 0;
        }

        // Configure attributes based on Creep Type
        switch (type) {
            case FAST:
                this.maxHealth = 65;
                this.health = 65;
                this.speed = 95.0;
                this.rewardCoins = 18;
                this.baseDamage = 5;
                this.color = new Color(244, 63, 94); // Crimson / Red
                this.size = 12;
                break;
            case STRONG:
                this.maxHealth = 280;
                this.health = 280;
                this.speed = 45.0;
                this.rewardCoins = 40;
                this.baseDamage = 20;
                this.color = new Color(217, 119, 6); // Amber / Bronze
                this.size = 20;
                break;
            case BASIC:
            default:
                this.maxHealth = 110;
                this.health = 110;
                this.speed = 65.0;
                this.rewardCoins = 14;
                this.baseDamage = 10;
                this.color = new Color(16, 185, 129); // Emerald Green
                this.size = 15;
                break;
        }
    }

    /**
     * Updates real-time movement along the computed A* waypoints using delta time.
     */
    public void update(double deltaTime, int cellSize) {
        if (!alive || reachedBase || path == null || currentPathIndex >= path.size()) {
            return;
        }

        Node targetNode = path.get(currentPathIndex);
        double targetX = targetNode.getX() * cellSize + (cellSize / 2.0);
        double targetY = targetNode.getY() * cellSize + (cellSize / 2.0);

        double dx = targetX - this.x;
        double dy = targetY - this.y;
        double distance = Math.hypot(dx, dy);
        double step = speed * deltaTime;

        if (distance <= step) {
            this.x = targetX;
            this.y = targetY;
            currentPathIndex++;

            if (currentPathIndex >= path.size()) {
                reachedBase = true;
                alive = false;
            }
        } else {
            this.x += (dx / distance) * step;
            this.y += (dy / distance) * step;
        }
    }

    public void takeDamage(int damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    public void updatePath(List<Node> newPath, int cellSize) {
        this.path = newPath;
        this.currentPathIndex = 0;
    }

    // Getters
    public String getId() { return id; }
    public Type getType() { return type; }
    public double getX() { return x; }
    public double getY() { return y; }
    public int getHealth() { return health; }
    public int getMaxHealth() { return maxHealth; }
    public int getRewardCoins() { return rewardCoins; }
    public int getBaseDamage() { return baseDamage; }
    public Color getColor() { return color; }
    public int getSize() { return size; }
    public boolean isAlive() { return alive; }
    public boolean hasReachedBase() { return reachedBase; }

    public double getHealthPercentage() {
        return (double) health / maxHealth;
    }
}
