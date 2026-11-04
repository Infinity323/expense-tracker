import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Circle,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  Spacer,
  Portal,
} from "@chakra-ui/react";
import { useColorMode } from "./ui/ColorMode";
import { FaBars, FaChartLine, FaGithub, FaMoon, FaSun } from "react-icons/fa6";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { ReactIcon } from "./ui/ReactIcon";

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
      logoutUri,
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
                <ReactIcon icon={FaChartLine} color="white" boxSize={4} />
              </Circle>
              <Heading
                size={{ base: "sm", sm: "md" }}
                as="span"
              >
                Expense Tracker
              </Heading>
            </HStack>
          </Link>
        </Box>
        {isAuthenticated && (
          <>
            <Box
              p="2"
              display={{ base: "none", lg: "block" }}
            >
              <ButtonGroup gap="2">
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to}>
                    <Button variant="plain">{label}</Button>
                  </Link>
                ))}
              </ButtonGroup>
            </Box>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton
                  aria-label="Open navigation menu"
                  variant="ghost"
                  display={{
                    base: "inline-flex",
                    lg: "none",
                  }}
                >
                  <ReactIcon icon={FaBars} />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    {navLinks.map(({ to, label }) => (
                      <Menu.Item key={to} value={to} asChild>
                        <Link to={to}>
                          {label}
                        </Link>
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </>
        )}
        <Spacer />
        <ButtonGroup
          gap={{ base: 0, sm: 2 }}
          alignItems="center"
          variant="ghost"
          colorPalette="gray"
          marginRight={{ base: 0, md: 5 }}
        >
          <Link
            to="https://github.com/Infinity323/expense-tracker"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton
              aria-label="GitHub"
              display={{
                base: "none",
                sm: "inline-flex",
              }}
            >
              <ReactIcon icon={FaGithub} />
            </IconButton>
          </Link>
          <IconButton aria-label="toggle mode" onClick={toggleColorMode}>
            <ReactIcon icon={colorMode === "light" ? FaMoon : FaSun} />
          </IconButton>
        </ButtonGroup>
        {isAuthenticated && user ? (
          <Menu.Root>
            <Menu.Trigger aria-label="Open account menu">
              <Avatar.Root bg="teal" size="sm">
                <Avatar.Fallback
                  name={`${user.profile.given_name} ${user.profile.family_name}`}
                />
              </Avatar.Root>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="item-1">
                    <Link to="/account-management">Manage Accounts</Link>
                  </Menu.Item>
                  <Menu.Item onSelect={onSignout} value="item-2">
                    Sign out
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        ) : (
          <Button colorPalette="teal" onClick={onSignin}>
            Sign in
          </Button>
        )}
      </Flex>
    </Box>
  );
}

export default Navbar;
