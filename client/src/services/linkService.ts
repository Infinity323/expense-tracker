import { LinkTokenCreateResponse } from "plaid";
import { post } from "./httpService";

const LINK_API = "/api/link";

export const createLinkToken = async ({ queryKey }: any) => {
  const [, { itemId }] = queryKey;
  return await post<LinkTokenCreateResponse>({
    uri: `${LINK_API}/link-token`,
    data: {
      itemId,
    },
  });
};

export const postAccessToken = async (publicToken, metadata) =>
  await post<{ itemId: string }>({
    uri: `${LINK_API}/access-token`,
    data: { publicToken, metadata },
  });

export const postLink = async (metadata) =>
  await post<{}>({ uri: LINK_API, data: metadata });
