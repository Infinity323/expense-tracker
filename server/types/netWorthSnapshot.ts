export interface NetWorthSnapshot {
  userId: string;
  snapshotDate: string;
  netWorth: number;
  assets: number;
  liabilities: number;
  capturedAt: string;
}
