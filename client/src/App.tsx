import {
  Center,
  ChakraProvider,
  Divider,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { UserProvider } from "./context/UserProvider";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

function App() {
  const { isLoading } = useAuth();
  return (
    <ChakraProvider theme={useTheme()}>
      <QueryClientProvider client={queryClient}>
        <GlobalModalProvider>
          <UserProvider>
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
                    <Route path="/overview" Component={Overview} />
                    <Route path="/insights" Component={Insights} />
                    <Route path="/budgets" Component={Budgets} />
                    <Route path="/transactions" Component={Transactions} />
                    <Route path="/accounts" Component={Accounts} />
                    <Route path="/login" Component={Login} />
                    <Route path="/api" Component={Swagger} />
                    <Route
                      path="/account-management"
                      Component={AccountManagement}
                    />
                  </Routes>
                </main>
                <Divider />
                <Footer />
              </BrowserRouter>
            )}
          </UserProvider>
        </GlobalModalProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
