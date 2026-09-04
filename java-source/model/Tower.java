package model;

import java.awt.Color;
import java.util.List;

/**
 * Represents a strategic defensive tower stationed on a grid cell.
 * Demonstrates Object-Oriented Polymorphism (Targeting Strategies),
 * Encapsulation (Damage, Range, Leveling), and Combat Mathematics.
 */
public class Tower {
    public enum Type { GATLING, PULSE_LASER, PLASMA_MORTAR }
    public enum TargetingMode { FIRST, CLOSEST, LOWEST_HP }

    private final String id;
    private final Type type;
    private final int gridX;
    private final int gridY;
    private final double worldX;
    private final double worldY;

    private int level;
    private final int maxLevel = 3;
    private int damage;
    private double range;
    private double fireRate; // Shots per second
    private double cooldownTimer;
    private TargetingMode targetingMode;
    private Enemy currentTarget;
    private double rotationAngle; // Radians
    private int totalInvestedCoins;

    private final Color primaryColor;

    public Tower(String id, Type type, int gridX, int gridY, int cellSize) {
        this.id = id;
        this.type = type;
        this.gridX = gridX;
        this.gridY = gridY;
        this.worldX = gridX * cellSize + (cellSize / 2.0);
        this.worldY = gridY * cellSize + (cellSize / 2.0);
        this.level = 1;
        this.cooldownTimer = 0;
        this.targetingMode = TargetingMode.FIRST;
        this.currentTarget = null;
        this.rotationAngle = 0;

        switch (type) {
            case PULSE_LASER:
                this.damage = 18;
                this.range = 145.0;
                this.fireRate = 3.2;
                this.primaryColor = new Color(16, 185, 129); // Tactical Emerald
                this.totalInvestedCoins = 125;
                break;
            case PLASMA_MORTAR:
                this.damage = 60;
                this.range = 210.0;
                this.fireRate = 0.85;
                this.primaryColor = new Color(245, 158, 11); // Warm Amber
                this.totalInvestedCoins = 175;
                break;
            case GATLING:
            default:
                this.damage = 25;
                this.range = 130.0;
                this.fireRate = 1.8;
                this.primaryColor = new Color(5, 150, 105); // Forest Green
                this.totalInvestedCoins = 100;
                break;
        }
    }

    public void update(double deltaTime, List<Enemy> enemies) {
        if (cooldownTimer > 0) {
            cooldownTimer -= deltaTime;
        }

        // Target Acquisition via Selected Heuristic Strategy
        acquireTarget(enemies);

        // Rotate turret towards locked target
        if (currentTarget != null && currentTarget.isAlive()) {
            double dx = currentTarget.getX() - this.worldX;
            double dy = currentTarget.getY() - this.worldY;
            this.rotationAngle = Math.atan2(dy, dx);
        }
    }

    public boolean canFire() {
        return cooldownTimer <= 0 && currentTarget != null && currentTarget.isAlive();
    }

    public void resetCooldown() {
        this.cooldownTimer = 1.0 / fireRate;
    }

    /**
     * Polymorphic target acquisition supporting multiple tactical policies.
     */
    public void acquireTarget(List<Enemy> enemies) {
        currentTarget = null;
        double bestMetric = Double.MAX_VALUE;

        for (Enemy enemy : enemies) {
            if (!enemy.isAlive()) continue;

            double dist = Math.hypot(enemy.getX() - worldX, enemy.getY() - worldY);
            if (dist > range) continue;

            switch (targetingMode) {
                case CLOSEST:
                    if (dist < bestMetric) {
                        bestMetric = dist;
                        currentTarget = enemy;
                    }
                    break;
                case LOWEST_HP:
                    if (enemy.getHealth() < bestMetric) {
                        bestMetric = enemy.getHealth();
                        currentTarget = enemy;
                    }
                    break;
                case FIRST:
                default:
                    // First valid enemy discovered in range
                    currentTarget = enemy;
                    return;
            }
        }
    }

    public int getUpgradeCost() {
        if (level >= maxLevel) return 0;
        return (int) (totalInvestedCoins * 0.75);
    }

    public int getSellValue() {
        return (int) (totalInvestedCoins * 0.70);
    }

    public boolean upgrade() {
        if (level >= maxLevel) return false;
        int cost = getUpgradeCost();
        totalInvestedCoins += cost;
        level++;
        damage = (int) Math.round(damage * 1.45);
        range = Math.round(range * 1.15);
        fireRate = fireRate * 1.15;
        return true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public Type getType() { return type; }
    public int getGridX() { return gridX; }
    public int getGridY() { return gridY; }
    public double getWorldX() { return worldX; }
    public double getWorldY() { return worldY; }
    public int getLevel() { return level; }
    public int getMaxLevel() { return maxLevel; }
    public int getDamage() { return damage; }
    public double getRange() { return range; }
    public double getFireRate() { return fireRate; }
    public TargetingMode getTargetingMode() { return targetingMode; }
    public void setTargetingMode(TargetingMode mode) { this.targetingMode = mode; }
    public Enemy getCurrentTarget() { return currentTarget; }
    public double getRotationAngle() { return rotationAngle; }
    public Color getPrimaryColor() { return primaryColor; }
}
