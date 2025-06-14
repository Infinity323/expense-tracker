import { Box, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import AccountsAccordion from "../components/accounts/AccountsAccordion";
import LaunchLink from "../components/launch-link/LaunchLink";
import { useUserContext } from "../context/UserProvider";
import { useCreateLinkToken } from "../hooks/useCreateLinkToken";

interface AccountManagementProps {}

const AccountManagement: React.FC<AccountManagementProps> = (props) => {
  const {
    userInfo: { userId },
  } = useUserContext();
  const linkToken = useCreateLinkToken({ userId });

  return (
    <Stack spacing="2rem">
      <Heading as="h1" size="xl">
        Manage Accounts
      </Heading>
      <AccountsAccordion />
      <Box>
        {linkToken && (
          <LaunchLink linkToken={linkToken}>Link Account</LaunchLink>
        )}
      </Box>
    </Stack>
  );
};

export default AccountManagement;
