import { Button, Flex, Heading, Spacer, Stack } from "@chakra-ui/react";
import AccountList from "../components/accounts/account-list/AccountList";
import { useNavigate } from "react-router-dom";

function Accounts() {
  const navigate = useNavigate();

  return (
    <Stack spacing="2rem">
      <Flex>
        <Heading as="h1" size="xl">
          Accounts
        </Heading>
        <Spacer />
        <Button onClick={() => navigate("/account-management")}>
          Manage Accounts
        </Button>
      </Flex>
      <AccountList />
    </Stack>
  );
}

export default Accounts;
