package engine;

/**
 * Manages tactical economic transactions: starting capital, deployment costs,
 * upgrade expenditures, kill bounties, and salvage refunds.
 * Demonstrates Encapsulation and Transaction Validation.
 */
public class ResourceManager {
    private int coins;
    private int totalEarned;
    private int totalSpent;

    public ResourceManager(int initialCoins) {
        this.coins = initialCoins;
        this.totalEarned = initialCoins;
        this.totalSpent = 0;
    }

    public boolean canAfford(int amount) {
        return this.coins >= amount;
    }

    public boolean spend(int amount) {
        if (canAfford(amount)) {
            this.coins -= amount;
            this.totalSpent += amount;
            return true;
        }
        return false;
    }

    public void addCoins(int amount) {
        if (amount > 0) {
            this.coins += amount;
            this.totalEarned += amount;
        }
    }

    public void reset(int initialCoins) {
        this.coins = initialCoins;
        this.totalEarned = initialCoins;
        this.totalSpent = 0;
    }

    public int getCoins() { return coins; }
    public int getTotalEarned() { return totalEarned; }
    public int getTotalSpent() { return totalSpent; }
}
