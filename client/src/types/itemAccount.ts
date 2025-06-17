import { AccountBase } from "plaid";

export interface ItemAccount extends AccountBase {
  institutionId: string;
  itemId: string;
}
