import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import InstitutionGroups from "../components/accounts/institution-groups/InstitutionGroups";
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
      <Box>
        <Heading as="h1" size="xl">
          Manage Accounts
        </Heading>
        <Text>Link, unlink, or repair linked accounts</Text>
      </Box>
      <InstitutionGroups />
      <Box>
        {linkToken ? (
          <LaunchLink linkToken={linkToken} colorScheme="teal">
            Link Account
          </LaunchLink>
        ) : (
          <Button disabled isLoading colorScheme="teal">
            Link Account
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default AccountManagement;
