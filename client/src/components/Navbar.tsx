import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import { FaChartLine } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <Box>
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
        <Box p="2">
          <ButtonGroup gap="2">
            <Link to="/overview">
              <Button variant="link">Overview</Button>
            </Link>
            <Link to="/insights">
              <Button variant="link">Insights</Button>
            </Link>
            <Link to="/transactions">
              <Button variant="link">Transactions</Button>
            </Link>
            <Link to="/budgets">
              <Button variant="link">Budgets</Button>
            </Link>
            <Link to="/accounts">
              <Button variant="link">Accounts</Button>
            </Link>
          </ButtonGroup>
        </Box>
        <Spacer />
        <ButtonGroup gap="2">
          <Link to="/login">
            <Button colorScheme="teal">Log In</Button>
          </Link>
        </ButtonGroup>
      </Flex>
      <Divider borderColor="gray.400" />
    </Box>
  );
}

export default Navbar;
