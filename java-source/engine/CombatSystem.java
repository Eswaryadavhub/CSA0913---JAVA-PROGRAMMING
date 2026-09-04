package engine;

import model.Enemy;
import model.Player;
import model.Tower;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Handles ballistic combat calculations, targeting policies, projectile updates,
 * damage distribution (including AoE splash), and creep bounty payouts.
 */
public class CombatSystem {
    public static class Projectile {
        public double x, y;
        public final double targetX, targetY;
        public final int damage;
        public final double speed;
        public final boolean isSplash;
        public final double splashRadius;
        public boolean active;

        public Projectile(double x, double y, double targetX, double targetY, int damage, double speed, boolean isSplash, double splashRadius) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.damage = damage;
            this.speed = speed;
            this.isSplash = isSplash;
            this.splashRadius = splashRadius;
            this.active = true;
        }

        public void update(double deltaTime) {
            double dx = targetX - x;
            double dy = targetY - y;
            double dist = Math.hypot(dx, dy);
            double step = speed * deltaTime;

            if (dist <= step) {
                x = targetX;
                y = targetY;
                active = false;
            } else {
                x += (dx / dist) * step;
                y += (dy / dist) * step;
            }
        }
    }

    private final List<Projectile> activeProjectiles;
    private final ResourceManager resourceManager;
    private final Player player;

    public CombatSystem(ResourceManager resourceManager, Player player) {
        this.activeProjectiles = new ArrayList<>();
        this.resourceManager = resourceManager;
        this.player = player;
    }

    /**
     * Updates active towers and launches projectile/laser attacks.
     */
    public void update(double deltaTime, List<Tower> towers, List<Enemy> enemies) {
        // 1. Tower attack execution
        for (Tower tower : towers) {
            tower.update(deltaTime, enemies);

            if (tower.canFire()) {
                Enemy target = tower.getCurrentTarget();
                if (target != null && target.isAlive()) {
                    fireTowerWeapon(tower, target);
                    tower.resetCooldown();
                }
            }
        }

        // 2. Projectile flight and collision
        Iterator<Projectile> it = activeProjectiles.iterator();
        while (it.hasNext()) {
            Projectile p = it.next();
            p.update(deltaTime);

            if (!p.active) {
                // Apply impact damage
                applyImpactDamage(p, enemies);
                it.remove();
            }
        }
    }

    private void fireTowerWeapon(Tower tower, Enemy target) {
        if (tower.getType() == Tower.Type.PULSE_LASER) {
            // Instant photon laser strike
            target.takeDamage(tower.getDamage());
            checkCreepDefeat(target);
        } else if (tower.getType() == Tower.Type.PLASMA_MORTAR) {
            // Explosive shell with AoE splash
            activeProjectiles.add(new Projectile(
                tower.getWorldX(), tower.getWorldY(),
                target.getX(), target.getY(),
                tower.getDamage(), 240.0, true, 60.0
            ));
        } else {
            // Kinetic bullet
            activeProjectiles.add(new Projectile(
                tower.getWorldX(), tower.getWorldY(),
                target.getX(), target.getY(),
                tower.getDamage(), 380.0, false, 0
            ));
        }
    }

    private void applyImpactDamage(Projectile p, List<Enemy> enemies) {
        for (Enemy enemy : enemies) {
            if (!enemy.isAlive()) continue;

            double dist = Math.hypot(enemy.getX() - p.targetX, enemy.getY() - p.targetY);

            if (p.isSplash) {
                if (dist <= p.splashRadius) {
                    // Falloff damage based on proximity
                    double factor = 1.0 - (dist / p.splashRadius) * 0.4;
                    enemy.takeDamage((int) Math.round(p.damage * factor));
                    checkCreepDefeat(enemy);
                }
            } else {
                if (dist <= 20.0) {
                    enemy.takeDamage(p.damage);
                    checkCreepDefeat(enemy);
                    break;
                }
            }
        }
    }

    private void checkCreepDefeat(Enemy enemy) {
        if (!enemy.isAlive()) {
            resourceManager.addCoins(enemy.getRewardCoins());
            player.addScore(enemy.getRewardCoins() * 10);
        }
    }

    public List<Projectile> getActiveProjectiles() {
        return activeProjectiles;
    }

    public void clear() {
        activeProjectiles.clear();
    }
}
