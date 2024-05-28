import { ChakraProvider } from "@chakra-ui/react";
import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "use-pouchdb";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Budgets from "./pages/Budgets";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";

function App() {
  const [db, setDb] = useState(() => new PouchDB("local"));

  useEffect(() => {
    PouchDB.plugin(PouchdbFind);
    const listener = (dbName) => {
      if (dbName === "local") {
        setDb(new PouchDB("local"));
      }
    };
    PouchDB.on("destroyed", listener);
    return () => {
      PouchDB.removeListener("destroyed", listener);
    };
  }, []);

  return (
    <ChakraProvider>
      <Provider pouchdb={db}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/login" Component={Login} />
            <Route path="/budgets" Component={Budgets} />
            <Route path="/transactions" Component={Transactions} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  );
}

export default App;
