import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import { get, put } from "./httpService";
import { AccountBase } from "plaid";

const ITEM_API = "/api/item";

export const updateItem = async (
  itemId: string,
  metadata: PlaidLinkOnSuccessMetadata
) =>
  await put<PlaidLinkOnSuccessMetadata>({
    uri: `${ITEM_API}/${itemId}`,
    data: metadata,
  });

export const getBalances = async () =>
  await get<AccountBase[]>({ uri: `${ITEM_API}/balances` });
