import { Doc } from "./doc";

export interface TransactionDoc extends Doc<"transaction"> {
  date: string;
  account_id: string;
  name: string;
  description: string;
  merchant_name: string;
  merchant_entity_id: string;
  pending: false;
  category: string;
  subcategory: string;
  amount: number;
}
