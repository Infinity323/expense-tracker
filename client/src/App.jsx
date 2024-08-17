import { ChakraProvider } from "@chakra-ui/react";
import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Link from "./Link";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Budgets from "./pages/Budgets";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import { getLinkToken } from "./services/PlaidService";

PouchDB.plugin(PouchdbFind);

function App() {
  const [linkToken, setLinkToken] = useState();

  useEffect(() => {
    const establishLink = async () => {
      const newLinkToken = await getLinkToken();
      setLinkToken(newLinkToken);
    };
    establishLink();
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
          <Route path="/login" Component={Login} />
        </Routes>
        <Footer />
      </BrowserRouter>
      {linkToken && <Link linkToken={linkToken} />}
    </ChakraProvider>
  );
}

export default App;
