package engine;

import model.Tower;

/**
 * Handles tower upgrade progression and salvage refund calculations.
 * Interacts with ResourceManager and Tower entities.
 */
public class UpgradeSystem {
    private final ResourceManager resourceManager;

    public UpgradeSystem(ResourceManager resourceManager) {
        this.resourceManager = resourceManager;
    }

    /**
     * Executes tower upgrade if within max tier and player has adequate capital.
     */
    public boolean upgradeTower(Tower tower) {
        if (tower == null || tower.getLevel() >= tower.getMaxLevel()) {
            return false;
        }

        int cost = tower.getUpgradeCost();
        if (resourceManager.spend(cost)) {
            return tower.upgrade();
        }
        return false;
    }

    /**
     * Sells an existing tower, refunding 70% of total invested coins.
     */
    public int sellTower(Tower tower) {
        if (tower == null) return 0;
        int refund = tower.getSellValue();
        resourceManager.addCoins(refund);
        return refund;
    }
}
