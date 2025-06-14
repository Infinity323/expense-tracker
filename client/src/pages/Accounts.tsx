import { Heading, Stack } from "@chakra-ui/react";
import AccountsAccordion from "../components/accounts/AccountsAccordion";
import LaunchLink from "../components/launch-link/LaunchLink";
import { useUserContext } from "../context/UserProvider";
import { useCreateLinkToken } from "../hooks/useCreateLinkToken";
import AccountList from "../components/accounts/account-list/AccountList";

function Accounts() {
  const {
    userInfo: { userId },
  } = useUserContext();
  const linkToken = useCreateLinkToken({ userId });

  return (
    <Stack spacing="2rem">
      <Heading as="h1" size="lg">
        Accounts
      </Heading>
      <AccountList />
      <AccountsAccordion />
      {linkToken && <LaunchLink linkToken={linkToken}>Link Account</LaunchLink>}
    </Stack>
  );
}

export default Accounts;
