import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AccountsAccordion from "../components/accounts/AccountsAccordion";
import Link from "../components/accounts/Link";
import LoadingModal from "../components/shared/LoadingModal";
import { getLinkToken } from "../services/LinkService";

function Accounts() {
  const [linkToken, setLinkToken] = useState();
  const [isLoading, setIsLoading] = useState();
  const [reload, setReload] = useState();

  const establishLink = async () => {
    setIsLoading(true);
    const newLinkToken = await getLinkToken();
    setLinkToken(newLinkToken);
    setIsLoading(false);
    setReload(false);
  };

  useEffect(() => {
    establishLink();
  }, []);

  useEffect(() => {
    if (reload === true) {
      setIsLoading(true);
    } else if (reload === false) {
      setIsLoading(false);
    }
  }, [reload]);

  return (
    <>
      <Box padding="7rem">
        <Heading as="h1" size="lg">
          Accounts
        </Heading>
        <br />
        <AccountsAccordion reload={reload} setReload={setReload} />
        <br />
        {linkToken && <Link linkToken={linkToken} setReload={setReload} />}
      </Box>
      <LoadingModal isLoading={isLoading} />
    </>
  );
}

export default Accounts;
