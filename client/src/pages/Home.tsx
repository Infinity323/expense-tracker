import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";

function Home() {
  return (
    <Center height="70vh">
      <VStack>
        <Box textAlign="center" maxWidth="60em">
          <Heading size="4xl">
            Take command of your spending
            <Heading size="4xl" color="teal" as="span">
              {" "}
              today
            </Heading>
          </Heading>
        </Box>
        <Box textAlign="center" marginTop="2rem" maxWidth="50em">
          <Text fontSize="lg">
            Expense Tracker empowers users with the freedom to spend and save.
          </Text>
          <Text fontSize="md"></Text>
        </Box>
      </VStack>
    </Center>
  );
}

export default Home;
