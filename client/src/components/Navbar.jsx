import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import { FaChartLine } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <Flex minWidth="max-content" p="2" alignItems="center" gap="2">
      <Box p="2" justifyContent="center">
        <Link to="/">
          <Icon as={FaChartLine} />
          <Heading size="md" as="span">
            {" "}
            Expense Tracker
          </Heading>
        </Link>
      </Box>
      <Spacer />
      <ButtonGroup gap="2">
        <Link to="/overview">
          <Button colorScheme="teal">Overview</Button>
        </Link>
        <Link to="/transactions">
          <Button colorScheme="teal">Transactions</Button>
        </Link>
        <Link to="/budgets">
          <Button colorScheme="teal">Budgets</Button>
        </Link>
        <Link to="/accounts">
          <Button colorScheme="teal">Accounts</Button>
        </Link>
        <Link to="/login">
          <Button colorScheme="teal">Log In</Button>
        </Link>
      </ButtonGroup>
    </Flex>
  );
}

export default Navbar;
