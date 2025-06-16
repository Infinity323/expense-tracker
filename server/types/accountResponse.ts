import { AccountBase } from "plaid";

export interface AccountResponse extends AccountBase {
  item_id: string;
  institution_id: string;
  needs_attention: boolean;
  created_timestamp: Date;
}
