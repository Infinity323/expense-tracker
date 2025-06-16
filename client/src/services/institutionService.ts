import { InstitutionsGetByIdResponse } from "plaid";
import { get } from "./httpService";

const INSTITUTION_URL = "/api/institution";

export const getLinkedInstitutions = async () =>
  await get<InstitutionsGetByIdResponse[]>({
    uri: `${INSTITUTION_URL}/linked`,
  });
