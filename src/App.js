import { ChakraProvider } from "@chakra-ui/react";
import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DbContext } from "./DbContext";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Budgets from "./pages/Budgets";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import Overview from "./pages/Overview";
import { useEffect, useState } from "react";
import { getLinkToken } from "./PlaidService";
import Link from "./Link";

PouchDB.plugin(PouchdbFind);

function App() {
  const db = new PouchDB("local");

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
      <DbContext.Provider value={db}>
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
      </DbContext.Provider>
    </ChakraProvider>
  );
}

export default App;
