export interface Transaction {
  id: string;
  type: 'EARN' | 'SPEND';
  amount: number;
  reason: string;
  timestamp: number;
}

export class Economy {
  private coins: number;
  private totalEarned: number = 0;
  private totalSpent: number = 0;
  private transactions: Transaction[] = [];

  constructor(startingCoins: number = 300) {
    this.coins = startingCoins;
    this.totalEarned = startingCoins;
  }

  public getBalance(): number {
    return this.coins;
  }

  public getTotalEarned(): number {
    return this.totalEarned;
  }

  public getTotalSpent(): number {
    return this.totalSpent;
  }

  public canAfford(amount: number): boolean {
    return this.coins >= amount;
  }

  public spend(amount: number, reason: string): boolean {
    if (!this.canAfford(amount)) {
      return false;
    }

    this.coins -= amount;
    this.totalSpent += amount;
    this.transactions.unshift({
      id: Math.random().toString(36).substring(2, 9),
      type: 'SPEND',
      amount,
      reason,
      timestamp: Date.now(),
    });

    if (this.transactions.length > 20) {
      this.transactions.pop();
    }

    return true;
  }

  public earn(amount: number, reason: string) {
    if (amount <= 0) return;
    this.coins += amount;
    this.totalEarned += amount;
    this.transactions.unshift({
      id: Math.random().toString(36).substring(2, 9),
      type: 'EARN',
      amount,
      reason,
      timestamp: Date.now(),
    });

    if (this.transactions.length > 20) {
      this.transactions.pop();
    }
  }

  public reset(startingCoins: number) {
    this.coins = startingCoins;
    this.totalEarned = startingCoins;
    this.totalSpent = 0;
    this.transactions = [];
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }
}
