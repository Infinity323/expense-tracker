import {
  Box,
  Card,
  CardFooter,
  Center,
  Divider,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

function Home() {
  return (
    <VStack spacing={{ base: 12, md: 20 }}>
      <Center minHeight={{ base: "40vh", md: "50vh" }} py={8}>
        <VStack spacing={4}>
          <Box textAlign="center" maxWidth="60em">
            <Heading fontSize={{ base: "4xl" }}>
              Take command of your spending
              <Heading
                fontSize={{ base: "4xl" }}
                color="teal"
                as="span"
              >
                {" "}
                today
              </Heading>
            </Heading>
          </Box>
          <Box textAlign="center" marginTop={{ base: 4, md: 8 }} maxWidth="50em">
            <Text fontSize="lg">
              Expense Tracker empowers users with the freedom to spend and save.
            </Text>
            <Text fontSize="md"></Text>
          </Box>
        </VStack>
      </Center>
      <Divider />
      <Heading size="2xl">Features</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        <GridItem>
          <Card variant="outline" size="sm">
            <Image
              objectFit="cover"
              src="/assets/images/overview.png"
              alt="Overview"
            />
            <CardFooter>
              View your net worth and current month spend.
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem>
          <Card variant="outline" size="sm">
            <Image
              objectFit="cover"
              src="/assets/images/insights.png"
              alt="Insights"
            />
            <CardFooter>
              See insights into your monthly cash flow and spending trends.
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem>
          <Card variant="outline" size="sm">
            <Image
              objectFit="cover"
              src="/assets/images/transactions.png"
              alt="Transactions"
            />
            <CardFooter>Sync transactions from linked accounts.</CardFooter>
          </Card>
        </GridItem>
        <GridItem>
          <Card variant="outline" size="sm">
            <Image
              objectFit="cover"
              src="/assets/images/accounts.png"
              alt="Accounts"
            />
            <CardFooter>View account balances.</CardFooter>
          </Card>
        </GridItem>
      </Grid>
    </VStack>
  );
}

export default Home;
