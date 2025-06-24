import { useQuery } from "react-query";
import { createLinkToken } from "../services/linkService";

export const useCreateLinkToken = ({
  accessToken,
}: {
  accessToken?: string;
}) => {
  const { data } = useQuery(["linkToken", { accessToken }], createLinkToken);
  return data?.link_token;
};
