import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Budgets from "./pages/Budgets";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <ChakraProvider>
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
    </ChakraProvider>
  );
}

export default App;
