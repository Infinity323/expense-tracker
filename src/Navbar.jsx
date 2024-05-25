import { Box, Button, ButtonGroup, Flex, Heading, Spacer } from "@chakra-ui/react";

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
        <Button colorScheme='teal'>Sign Up</Button>
        <Button colorScheme='teal'>Log In</Button>
      </ButtonGroup>
    </Flex>
  );
}

export default Navbar;