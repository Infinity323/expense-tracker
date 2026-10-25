import { useQuery } from "react-query";
import { createLinkToken } from "../services/linkService";

export const useCreateLinkToken = ({
  itemId,
}: {
  itemId?: string;
}) => {
  const { data, isLoading, isFetching, isError, refetch } = useQuery(
    ["linkToken", { itemId }],
    createLinkToken,
  );
  return {
    linkToken: data?.link_token,
    isLoading: isLoading || isFetching,
    isError,
    refreshLinkToken: refetch,
  };
};
