import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <Flex minWidth="max-content" p="2" alignItems="center" gap="2">
      <Box p="2">
        <Link to="/">
          <Heading size="md">Expense Tracker</Heading>
        </Link>
      </Box>
      <Spacer />
      <ButtonGroup gap="2">
        <Link to="/transactions">
          <Button colorScheme="teal">Transactions</Button>
        </Link>
        <Link to="/budgets">
          <Button colorScheme="teal">Budgets</Button>
        </Link>
        <Link to="/login">
          <Button colorScheme="teal">Log In</Button>
        </Link>
      </ButtonGroup>
    </Flex>
  );
}

export default Navbar;
