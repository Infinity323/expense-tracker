import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AccountsAccordion from "../components/accounts/AccountsAccordion";
import Link from "../Link";
import { getLinkToken } from "../services/LinkService";

function Accounts() {
  const [linkToken, setLinkToken] = useState();

  const establishLink = async () => {
    const newLinkToken = await getLinkToken();
    setLinkToken(newLinkToken);
  };

  useEffect(() => {
    establishLink();
  }, []);

  return (
    <Box padding="7rem">
      <Heading as="h1" size="lg">
        Accounts
      </Heading>
      <br />
      <AccountsAccordion />
      <br />
      {linkToken && <Link linkToken={linkToken} />}
    </Box>
  );
}

export default Accounts;
