export interface TransactionDoc {
  transactionId: string;
  date: string;
  accountId: string;
  name: string;
  description: string;
  merchantName: string;
  merchantEntityId: string;
  pending: boolean;
  category: string;
  subcategory: string;
  amount: number;
  userId: string;
}
