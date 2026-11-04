import {
  Box,
  Card,
  Center,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  VStack,
  Separator,
} from "@chakra-ui/react";

function Home() {
  return (
    <VStack gap={{ base: 12, md: 20 }}>
      <Center
        minHeight={{ base: "40vh", md: "50vh" }}
        py={8}
      >
        <VStack gap={4}>
          <Box textAlign="center" maxWidth="60em">
            <Heading size="5xl">
              Take command of your spending
              <Heading size="5xl" color="teal" as="span">
                {" "}
                today
              </Heading>
            </Heading>
          </Box>
          <Box
            textAlign="center"
            marginTop={{ base: 4, md: 8 }}
            maxWidth="50em"
          >
            <Text fontSize="lg">
              Expense Tracker empowers users with the freedom to spend and save.
            </Text>
            <Text fontSize="md"></Text>
          </Box>
        </VStack>
      </Center>
      <Separator width="100%" flexShrink={0} />
      <Heading size="3xl">Features</Heading>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
        }}
        gap={6}
      >
        <GridItem>
          <Card.Root variant="outline" size="sm">
            <Image
              objectFit="cover"
              src="/assets/images/overview.png"
              alt="Overview"
            />
            <Card.Footer pt="var(--card-padding)">
              View your net worth and current month spend.
            </Card.Footer>
          </Card.Root>
        </GridItem>
        <GridItem>
          <Card.Root variant="outline" size="sm">
            <Image
              objectFit="cover"
              src="/assets/images/insights.png"
              alt="Insights"
            />
            <Card.Footer pt="var(--card-padding)">
              See insights into your monthly cash flow and spending trends.
            </Card.Footer>
          </Card.Root>
        </GridItem>
        <GridItem>
          <Card.Root variant="outline" size="sm">
            <Image
              objectFit="cover"
              src="/assets/images/transactions.png"
              alt="Transactions"
            />
            <Card.Footer pt="var(--card-padding)">
              Sync transactions from linked accounts.
            </Card.Footer>
          </Card.Root>
        </GridItem>
        <GridItem>
          <Card.Root variant="outline" size="sm">
            <Image
              objectFit="cover"
              src="/assets/images/accounts.png"
              alt="Accounts"
            />
            <Card.Footer pt="var(--card-padding)">
              View account balances.
            </Card.Footer>
          </Card.Root>
        </GridItem>
      </Grid>
    </VStack>
  );
}

export default Home;
