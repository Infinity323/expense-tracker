import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AccountList from "../components/accounts/account-list/AccountList";

function Accounts() {
  const navigate = useNavigate();

  return (
    <Stack spacing="2rem">
      <Flex>
        <Box>
          <Heading as="h1" size="xl">
            Accounts
          </Heading>
          <Text>An overview of all linked accounts</Text>
        </Box>
        <Spacer />
        <Button
          colorScheme="teal"
          onClick={() => navigate("/account-management")}
        >
          Manage Accounts
        </Button>
      </Flex>
      <AccountList />
    </Stack>
  );
}

export default Accounts;
