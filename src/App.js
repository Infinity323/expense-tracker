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

PouchDB.plugin(PouchdbFind);

function App() {
  const db = new PouchDB("local");

  return (
    <ChakraProvider>
      <DbContext.Provider value={db}>
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
      </DbContext.Provider>
    </ChakraProvider>
  );
}

export default App;
