import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import InstitutionGroups from "../components/accounts/institution-groups/InstitutionGroups";
import LaunchLink from "../components/launch-link/LaunchLink";

interface AccountManagementProps {}

const AccountManagement = (props: AccountManagementProps) => {
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
        <LaunchLink colorScheme="teal">Link Account</LaunchLink>
      </Box>
    </Stack>
  );
};

export default AccountManagement;
