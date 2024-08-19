import { ChakraProvider } from "@chakra-ui/react";
import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Accounts from "./pages/Accounts";
import Budgets from "./pages/Budgets";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Swagger from "./pages/Swagger";
import Transactions from "./pages/Transactions";
import { getAccessTokens } from "./services/LinkService";

PouchDB.plugin(PouchdbFind);

function App() {
  const loadAccessTokens = async () => {
    let accessTokens = await getAccessTokens();
    sessionStorage.setItem("accessTokens", JSON.stringify(accessTokens));
  };

  useEffect(() => {
    loadAccessTokens();
  }, []);

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/overview" Component={Overview} />
          <Route path="/budgets" Component={Budgets} />
          <Route path="/transactions" Component={Transactions} />
          <Route path="/accounts" Component={Accounts} />
          <Route path="/login" Component={Login} />
          <Route path="/api" Component={Swagger} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
