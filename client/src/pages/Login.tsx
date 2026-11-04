import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from "react-router-dom";

function Login() {
  const { signinRedirect, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const returnTo = location.state?.from ?? "/overview";

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />;
  }

  return (
    <Center minHeight="60vh">
      <Stack align="center" gap={4}>
        <Text>Sign in to access your expense tracker.</Text>
        <Button
          colorPalette="teal"
          onClick={() => signinRedirect()}
          loading={isLoading}
        >
          Sign in
        </Button>
      </Stack>
    </Center>
  );
}

export default Login;
