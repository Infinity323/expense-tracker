import { CountryCode } from "plaid";
import plaidClient from "../clients/plaidClient";
import { findAccessTokensByUserId } from "../db/repositories/item.repository";
import { getUserId } from "../utils/authUtil";

export const getLinkedInstitutions = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const accessTokens = await findAccessTokensByUserId(userId);
    const items = await Promise.all(
      accessTokens.map(
        async (accessToken) =>
          (
            await plaidClient.itemGet({
              access_token: accessToken.accessToken,
            })
          ).data
      )
    );
    const institutions = await Promise.all(
      items.map(
        async (item) =>
          (
            await plaidClient.institutionsGetById({
              institution_id: item.item.institution_id,
              country_codes: [CountryCode.Us],
              options: { include_optional_metadata: true },
            })
          ).data
      )
    );
    console.log(`Retrieved ${institutions.length} linked institutions`);
    res.json(institutions);
  } catch (err) {
    next(err);
  }
};
