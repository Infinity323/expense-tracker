import { useContext, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { getAccessToken } from "./PlaidService";
import { DbContext } from "./DbContext";
import { Button } from "@chakra-ui/react";

function Link({ linkToken }) {
  const db = useContext(DbContext);

  const onSuccess = async (publicToken, metadata) => {
    await db.createIndex({
      index: { fields: ["type", "metadata.institution.institution_id"] },
    });
    let existingLink = await db.find({
      selector: {
        type: "linkMetadata",
        metadata: {
          institution: {
            institution_id: metadata.institution.institution_id,
          },
        },
      },
    });
    if (existingLink && existingLink.length) {
      console.log(
        "Institution %s already linked",
        metadata.institution.institution_id
      );
    } else {
      // save link metadata to DB to prevent duplicate linkage
      const linkMetadataDoc = {
        _id: crypto.randomUUID(),
        type: "linkMetadata",
        metadata: metadata,
      };
      await db.put(linkMetadataDoc);
      console.log(
        "Saved new institution [%s] link metadata to database",
        metadata.institution.institution_id
      );
      // get access token and save to DB
      let accessTokenResponse = await getAccessToken(publicToken);
      const accessTokenDoc = {
        _id: crypto.randomUUID(),
        type: "accessToken",
        itemId: accessTokenResponse.item_id,
        accessToken: accessTokenResponse.access_token,
      };
      await db.put(accessTokenDoc);
      console.log(
        "Saved access token for item [%s] to database",
        accessTokenResponse.item_id
      );
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <Button onClick={open} disabled={!ready}>
      Link account
    </Button>
  );
}

export default Link;
