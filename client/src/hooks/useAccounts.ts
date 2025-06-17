import { useQuery } from "react-query";
import { getAccounts } from "../services/accountsService";
import { ItemAccount } from "../types/itemAccount";

export const useAccounts = () => {
  const {
    data: accounts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const flattenedAccounts: ItemAccount[] = accounts?.flatMap((item) => {
    const updated = item.accounts.map((account) => ({
      ...account,
      institutionId: item.institution_id,
      itemId: item.item_id,
    }));
    return updated;
  });

  return { accounts, flattenedAccounts, isLoading, isError, refetch };
};
