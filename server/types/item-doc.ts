import { AccountBase } from "plaid";
import { Doc } from "./doc";

export interface ItemDoc extends Doc<"item"> {
  item_id: string;
  access_token: string;
  accounts: AccountBase[];
  created_timestamp: Date;
}
