import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Circle,
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
import {
  FaBars,
  FaChartLine,
  FaGithub,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, signinRedirect, removeUser } = useAuth();

  const onSignin = () => signinRedirect();

  const onSignout = () => {
    removeUser();
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const logoutUri = window.location.origin;
    const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const navLinks = [
    { to: "/overview", label: "Overview" },
    { to: "/insights", label: "Insights" },
    { to: "/transactions", label: "Transactions" },
    { to: "/budgets", label: "Budgets" },
    { to: "/accounts", label: "Accounts" },
  ];

  return (
    <Box>
      <Flex
        width="100%"
        minWidth={0}
        p={{ base: 1, md: 2 }}
        alignItems="center"
        gap={{ base: 1, md: 2 }}
      >
        <Box p={{ base: 1, md: 2 }} flexShrink={0}>
          <Link to="/">
            <HStack>
              <Circle bg="teal" size="30px" marginRight={1}>
                <Icon as={FaChartLine} color="white" boxSize={4} />
              </Circle>
              <Heading size={{ base: "sm", sm: "md" }} as="span">
                Expense Tracker
              </Heading>
            </HStack>
          </Link>
        </Box>
        {isAuthenticated && (
          <>
            <Box p="2" display={{ base: "none", lg: "block" }}>
              <ButtonGroup gap="2">
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to}>
                    <Button variant="link">{label}</Button>
                  </Link>
                ))}
              </ButtonGroup>
            </Box>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Open navigation menu"
                icon={<FaBars />}
                variant="ghost"
                display={{ base: "inline-flex", lg: "none" }}
              />
              <MenuList>
                {navLinks.map(({ to, label }) => (
                  <MenuItem key={to} as={Link} to={to}>
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </>
        )}
        <Spacer />
        <ButtonGroup
          gap={{ base: 0, sm: 2 }}
          alignItems="center"
          variant="ghost"
          colorScheme="grayAlpha" // TODO
          marginRight={{ base: 0, md: 5 }}
        >
          <Link
            to="https://github.com/Infinity323/expense-tracker"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton
              aria-label="GitHub"
              icon={<FaGithub />}
              display={{ base: "none", sm: "inline-flex" }}
            />
          </Link>
          <IconButton
            aria-label="toggle mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </ButtonGroup>
        {isAuthenticated && user ? (
          <Menu>
            <MenuButton aria-label="Open account menu">
              <Avatar
                bg="teal"
                size="sm"
                name={`${user.profile.given_name} ${user.profile.family_name}`}
              />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link to="/account-management">Manage Accounts</Link>
              </MenuItem>
              <MenuItem onClick={onSignout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button colorScheme="teal" onClick={onSignin}>
            Sign in
          </Button>
        )}
      </Flex>
    </Box>
  );
}

export default Navbar;
