import { useQuery } from "react-query";
import { createLinkToken } from "../services/linkService";

export const useCreateLinkToken = ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken?: string;
}) => {
  const { data } = useQuery(
    ["linkToken", { userId, accessToken }],
    createLinkToken
  );
  return data?.link_token;
};
