import { AccountBase } from "plaid";

export interface AccountResponse extends AccountBase {
  item_id: string;
  needs_attention: string;
  created_timestamp: string;
}
