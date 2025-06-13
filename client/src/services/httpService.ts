import axios from "axios";

export const get = async <T extends any>({
  uri,
  params,
}: {
  uri: string;
  params?: Record<string, any>;
}): Promise<T> =>
  (
    await axios.get<T>(uri, {
      params,
    })
  ).data;

export const post = async <T extends any>({
  uri,
  data,
}: {
  uri: string;
  data?: Record<string, any>;
}): Promise<T> => (await axios.post<T>(uri, data)).data;

export const put = async <T extends any>({
  uri,
  data,
}: {
  uri: string;
  data?: Record<string, any>;
}): Promise<T> => (await axios.put<T>(uri, data)).data;
