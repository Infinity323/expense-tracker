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
    <Stack gap="2rem">
      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ base: "stretch", sm: "center" }}
        gap={4}
      >
        <Box>
          <Heading as="h1" size="3xl">
            Accounts
          </Heading>
          <Text>An overview of all linked accounts</Text>
        </Box>
        <Spacer display={{ base: "none", sm: "block" }} />
        <Button
          colorPalette="teal"
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
