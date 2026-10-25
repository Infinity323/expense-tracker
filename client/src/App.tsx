import {
  Center,
  ChakraProvider,
  Divider,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useTheme } from "./hooks/useTheme";
import AccountManagement from "./pages/AccountManagement";
import Accounts from "./pages/Accounts";
import Budgets from "./pages/Budgets";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Swagger from "./pages/Swagger";
import Transactions from "./pages/Transactions";
import { GlobalModalProvider } from "./context/GlobalModalProvider";
import { useAuth } from "react-oidc-context";

const UserQueryClient = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const UserQueryCache = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const identityKey = user?.profile.sub ?? "signed-out";

  return <UserQueryClient key={identityKey}>{children}</UserQueryClient>;
};

const RequireAuthentication = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
};

function App() {
  const { isLoading } = useAuth();
  return (
    <ChakraProvider theme={useTheme()}>
      <UserQueryCache>
        <GlobalModalProvider>
          {isLoading ? (
              <div style={{ height: "100vh", width: "100vw" }}>
                <Center height="100%" width="100%">
                  <VStack>
                    <Spinner color="teal" size="xl" />
                    <Text fontSize="lg" fontWeight="semibold">
                      Loading...
                    </Text>
                  </VStack>
                </Center>
              </div>
          ) : (
              <BrowserRouter>
                <Navbar />
                <Divider />
                <main className="app-main">
                  <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/login" Component={Login} />
                    <Route path="/api" Component={Swagger} />
                    <Route element={<RequireAuthentication />}>
                      <Route path="/overview" Component={Overview} />
                      <Route path="/insights" Component={Insights} />
                      <Route path="/budgets" Component={Budgets} />
                      <Route path="/transactions" Component={Transactions} />
                      <Route path="/accounts" Component={Accounts} />
                      <Route
                        path="/account-management"
                        Component={AccountManagement}
                      />
                    </Route>
                  </Routes>
                </main>
                <Divider />
                <Footer />
              </BrowserRouter>
          )}
        </GlobalModalProvider>
      </UserQueryCache>
    </ChakraProvider>
  );
}

export default App;
