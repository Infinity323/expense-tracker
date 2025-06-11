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
