import { Doc } from "./doc";

export interface ItemDoc extends Doc<"item"> {
  item_id: string;
  access_token: string;
  needs_attention?: boolean;
  created_timestamp: Date;
}
