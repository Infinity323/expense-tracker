export interface SpendingByCategory {
  category: string;
  totals: {
    subcategory: string;
    subtotals: { date: string; amount: number }[];
  }[];
}
