import { AccountResponse } from "@backend/types/accountResponse";
import { get } from "./httpService";

const ACCOUNT_API = "/api/account";

export const getAccounts = async () =>
  await get<AccountResponse[]>({ uri: ACCOUNT_API });
