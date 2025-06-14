import { Heading } from "@chakra-ui/react";
import AccountsAccordion from "../components/accounts/AccountsAccordion";
import LaunchLink from "../components/launch-link/LaunchLink";
import { useUserContext } from "../context/UserProvider";
import { useCreateLinkToken } from "../hooks/useCreateLinkToken";

function Accounts() {
  const {
    userInfo: { userId },
  } = useUserContext();
  const linkToken = useCreateLinkToken({ userId });

  return (
    <>
      <Heading as="h1" size="lg">
        Accounts
      </Heading>
      <br />
      <AccountsAccordion />
      <br />
      {linkToken && <LaunchLink linkToken={linkToken}>Link Account</LaunchLink>}
    </>
  );
}

export default Accounts;
