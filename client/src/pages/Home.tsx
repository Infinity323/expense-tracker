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
    <VStack spacing={20}>
      <Center height="50vh">
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
      <Divider />
      <Heading size="2xl">Features</Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
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
