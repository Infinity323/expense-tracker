import { ChakraProvider } from '@chakra-ui/react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Footer from './Footer';
import Home from './pages/Home';
import Navbar from './Navbar';
import Budgets from './pages/Budgets';

function App() {
  return (
    <ChakraProvider>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path='/' Component={Home}/>
          <Route path='/budgets' Component={Budgets} />
        </Routes>
        <Footer />
      </HashRouter>
    </ChakraProvider>
  );
}

export default App;
