package model;

/**
 * Encapsulates player base status, health points, and running score.
 * Demonstrates OOP Encapsulation with protected state and validated accessors.
 */
public class Player {
    private int baseHealth;
    private final int maxHealth;
    private int score;
    private int enemiesDefeated;

    public Player(int initialHealth) {
        this.maxHealth = initialHealth;
        this.baseHealth = initialHealth;
        this.score = 0;
        this.enemiesDefeated = 0;
    }

    public void takeDamage(int amount) {
        this.baseHealth -= amount;
        if (this.baseHealth < 0) {
            this.baseHealth = 0;
        }
    }

    public void addScore(int points) {
        if (points > 0) {
            this.score += points;
            this.enemiesDefeated++;
        }
    }

    public boolean isAlive() {
        return this.baseHealth > 0;
    }

    public void reset() {
        this.baseHealth = this.maxHealth;
        this.score = 0;
        this.enemiesDefeated = 0;
    }

    // Encapsulation Getters
    public int getBaseHealth() { return baseHealth; }
    public int getMaxHealth() { return maxHealth; }
    public int getScore() { return score; }
    public int getEnemiesDefeated() { return enemiesDefeated; }

    public double getHealthPercentage() {
        return ((double) baseHealth / maxHealth) * 100.0;
    }
}
