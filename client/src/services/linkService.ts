import { LinkTokenCreateResponse } from "plaid";
import { AccessToken } from "../types/accessToken";
import { get, post } from "./httpService";

const LINK_API = "/api/link";

export const createLinkToken = async ({ queryKey }: any) => {
  const [, { userId, accessToken }] = queryKey;
  return await post<LinkTokenCreateResponse>({
    uri: `${LINK_API}/link-token`,
    data: {
      userId,
      accessToken,
    },
  });
};

export const getAccessTokens = async () =>
  await get<AccessToken[]>({ uri: `${LINK_API}/access-token` });

export const postAccessToken = async (publicToken, metadata) =>
  await post<AccessToken>({
    uri: `${LINK_API}/access-token`,
    data: { publicToken, metadata },
  });

export const postLink = async (metadata) =>
  await post<{}>({ uri: LINK_API, data: metadata });
