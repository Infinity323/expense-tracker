import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import { put } from "./httpService";

const ITEM_API = "/api/item";

export const updateItem = async (
  itemId: string,
  metadata: PlaidLinkOnSuccessMetadata
) =>
  await put<PlaidLinkOnSuccessMetadata>({
    uri: `${ITEM_API}/${itemId}`,
    data: metadata,
  });
