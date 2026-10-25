import axios from "axios";
import { User } from "oidc-client-ts";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export const get = async <T extends any>({
  uri,
  params,
}: {
  uri: string;
  params?: Record<string, any>;
}): Promise<T> =>
  (
    await axios.get<T>(uri, {
      headers: {
        ...getAuthorizationHeaders(),
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
    await axios.post<T>(uri, data, {
      headers: {
        ...getAuthorizationHeaders(),
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
    await axios.put<T>(uri, data, {
      headers: {
        ...getAuthorizationHeaders(),
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
    await axios.delete<T>(uri, {
      headers: {
        ...getAuthorizationHeaders(),
      },
      params,
    })
  ).data;

const getToken = () => {
  try {
    const oidcStorageKey = `oidc.user:${process.env.REACT_APP_COGNITO_AUTHORITY}:${process.env.REACT_APP_COGNITO_CLIENT_ID}`;
    const oidcStorage = sessionStorage.getItem(oidcStorageKey);
    if (!oidcStorage) return null;

    const user = User.fromStorageString(oidcStorage);
    return user.expired ? null : user.access_token;
  } catch {
    return null;
  }
};

const getAuthorizationHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
