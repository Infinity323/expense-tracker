import { Box, Button, ButtonGroup, Flex, Heading, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Navbar() {
  
  return (
    <Flex
      minWidth='max-content'
      p='2'
      alignItems='center'
      gap='2'
    >
      <Box p='2'>
        <Heading size='md'>Expense Tracker</Heading>
      </Box>
      <Spacer />
      <ButtonGroup gap='2'>
        <Button colorScheme='teal'>
          <Link to='/budgets'>Budgets</Link>
        </Button>
        <Button colorScheme='teal'>Log In</Button>
      </ButtonGroup>
    </Flex>
  );
}

export default Navbar;