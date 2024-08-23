import { Button } from "@chakra-ui/react";
import { usePlaidLink } from "react-plaid-link";
import {
  postAccessToken,
  postLink,
  saveAccessTokenToSession,
} from "../../services/LinkService";

function Link({ linkToken, setReload }) {
  const onSuccess = async (publicToken, metadata) => {
    await postLink(metadata);
    let accessTokenResponse = await postAccessToken(publicToken);
    await saveAccessTokenToSession(accessTokenResponse);
    setReload();
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
