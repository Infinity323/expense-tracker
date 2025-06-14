import { AccountBase } from "plaid";

export const getBalance = (balances: AccountBase[], type: string) =>
  balances
    .filter((balance) => balance.type === type)
    .map((balance) => balance.balances.current)
    .reduce((sum, current) => sum + current, 0);
