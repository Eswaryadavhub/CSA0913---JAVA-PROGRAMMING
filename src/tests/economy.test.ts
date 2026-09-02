import { describe, it, expect } from 'vitest';
import { Economy } from '../game/Economy';

describe('Economy & Resource Management System (TC11)', () => {
  it('initializes starting coins correctly', () => {
    const eco = new Economy(300);
    expect(eco.getBalance()).toBe(300);
    expect(eco.getTotalEarned()).toBe(300);
    expect(eco.getTotalSpent()).toBe(0);
  });

  it('allows valid purchase and deducts coins accurately', () => {
    const eco = new Economy(300);
    const success = eco.spend(100, 'Built Basic Tower');
    expect(success).toBe(true);
    expect(eco.getBalance()).toBe(200);
    expect(eco.getTotalSpent()).toBe(100);
  });

  it('prevents spending more coins than available balance', () => {
    const eco = new Economy(100);
    const success = eco.spend(175, 'Attempted Heavy Tower');
    expect(success).toBe(false);
    expect(eco.getBalance()).toBe(100); // Balance unaltered
  });

  it('credits rewards on enemy defeat and records transaction history', () => {
    const eco = new Economy(200);
    eco.earn(40, 'Defeated Goliath Mech');
    expect(eco.getBalance()).toBe(240);
    expect(eco.getTotalEarned()).toBe(240);

    const history = eco.getTransactions();
    expect(history.length).toBe(1);
    expect(history[0].amount).toBe(40);
    expect(history[0].reason).toBe('Defeated Goliath Mech');
  });

  it('correctly resets resources upon new game difficulty selection', () => {
    const eco = new Economy(300);
    eco.spend(200, 'Spent');
    eco.reset(400); // Easy difficulty starting coins
    expect(eco.getBalance()).toBe(400);
    expect(eco.getTotalSpent()).toBe(0);
  });
});
