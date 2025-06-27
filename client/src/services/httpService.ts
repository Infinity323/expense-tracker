import axios from "axios";
import { User } from "oidc-client-ts";

export const get = async <T extends any>({
  uri,
  params,
}: {
  uri: string;
  params?: Record<string, any>;
}): Promise<T> =>
  (
    await axios.get<T>(getUrl(uri), {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      params,
    })
  ).data;

export const post = async <T extends any>({
  uri,
  data,
}: {
  uri: string;
  data?: Record<string, any>;
}): Promise<T> =>
  (
    await axios.post<T>(getUrl(uri), data, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
  ).data;

export const put = async <T extends any>({
  uri,
  data,
}: {
  uri: string;
  data?: Record<string, any>;
}): Promise<T> =>
  (
    await axios.put<T>(getUrl(uri), data, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
  ).data;

export const delete_ = async <T extends any>({
  uri,
  params,
}: {
  uri: string;
  params?: Record<string, any>;
}): Promise<T> =>
  (
    await axios.delete<T>(getUrl(uri), {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      params,
    })
  ).data;

const getToken = () => {
  const oidcStorageKey = `oidc.user:${process.env.REACT_APP_COGNITO_AUTHORITY}:${process.env.REACT_APP_COGNITO_CLIENT_ID}`;
  const oidcStorage = sessionStorage.getItem(oidcStorageKey);

  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage).access_token;
};

const getUrl = (uri: string) => process.env.REACT_APP_API_URL + uri;
