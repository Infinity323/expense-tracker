import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Footer';
import Home from './pages/Home';
import Navbar from './Navbar';
import Budgets from './pages/Budgets';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' Component={Home}/>
          <Route path='/budgets' Component={Budgets} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
