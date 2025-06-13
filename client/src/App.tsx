import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { UserProvider } from "./context/UserProvider";
import { useTheme } from "./hooks/useTheme";
import Accounts from "./pages/Accounts";
import Budgets from "./pages/Budgets";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Swagger from "./pages/Swagger";
import Transactions from "./pages/Transactions";
import { getAccessTokens } from "./services/linkService";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

function App() {
  const loadAccessTokens = async () => {
    let accessTokens = await getAccessTokens();
    sessionStorage.setItem("accessTokens", JSON.stringify(accessTokens));
  };

  useEffect(() => {
    loadAccessTokens();
  }, []);

  return (
    <ChakraProvider theme={useTheme()}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" Component={Home} />
              <Route path="/overview" Component={Overview} />
              <Route path="/insights" Component={Insights} />
              <Route path="/budgets" Component={Budgets} />
              <Route path="/transactions" Component={Transactions} />
              <Route path="/accounts" Component={Accounts} />
              <Route path="/login" Component={Login} />
              <Route path="/api" Component={Swagger} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </UserProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
