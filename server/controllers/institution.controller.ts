import { CountryCode } from "plaid";
import plaidClient from "../clients/plaidClient";
import { findAllAccessTokens } from "../db/repositories/item.repository";

export const getLinkedInstitutions = async (req, res, next) => {
  try {
    const accessTokens = await findAllAccessTokens();
    const items = await Promise.all(
      accessTokens.map(
        async (accessToken) =>
          (
            await plaidClient.itemGet({
              access_token: accessToken.access_token,
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
