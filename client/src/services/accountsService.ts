import { get } from "./httpService";

const ACCOUNT_API = "/api/account";

export const getAccounts = async () => await get<any>({ uri: ACCOUNT_API });
