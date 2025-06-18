import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Circle,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { FaChartLine, FaMoon, FaSun } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <Flex minWidth="max-content" p="2" alignItems="center" gap="2">
        <Box p="2" justifyContent="center">
          <Link to="/">
            <HStack>
              <Circle bg="teal" size="30px" marginRight={1} >
                <Icon as={FaChartLine} color="white" boxSize={4}/>
              </Circle>
              <Heading size="md" as="span">
                Expense Tracker
              </Heading>
            </HStack>
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
        <ButtonGroup gap="2" alignItems="center">
          <IconButton
            aria-label="toggle mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
          <Menu>
            <MenuButton>
              <Avatar name="Paul Lee" bg="teal" />
            </MenuButton>
            <MenuList>
              <MenuItem>Preferences</MenuItem>
              <MenuItem>
                <Link to="/account-management">Manage Accounts</Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Flex>
    </Box>
  );
}

export default Navbar;
