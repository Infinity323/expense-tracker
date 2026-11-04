import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import InstitutionGroups from "../components/accounts/institution-groups/InstitutionGroups";
import LaunchLink from "../components/launch-link/LaunchLink";

interface AccountManagementProps {}

const AccountManagement = (props: AccountManagementProps) => {
  return (
    <Stack gap="2rem">
      <Box>
        <Heading as="h1" size="3xl">
          Manage Accounts
        </Heading>
        <Text>Link, unlink, or repair linked accounts</Text>
      </Box>
      <InstitutionGroups />
      <Box>
        <LaunchLink colorPalette="teal">Link Account</LaunchLink>
      </Box>
    </Stack>
  );
};

export default AccountManagement;
