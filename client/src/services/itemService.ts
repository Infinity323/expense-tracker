import { get, put, delete_ } from "./httpService";
import { AccountBase } from "plaid";

const ITEM_API = "/api/item";

export const updateItem = async (itemId: string) =>
  await put<void>({
    uri: `${ITEM_API}/${itemId}`,
  });

export const getBalances = async () =>
  await get<AccountBase[]>({ uri: `${ITEM_API}/balances` });


export const deleteItem = async (
  itemId: string,
) =>
  await delete_({
    uri: `${ITEM_API}/${itemId}`,
  });