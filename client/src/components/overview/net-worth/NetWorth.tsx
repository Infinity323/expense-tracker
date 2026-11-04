import {
  Alert,
  Box,
  Card,
  Grid,
  GridItem,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FaCreditCard,
  FaMoneyBill,
  FaMoneyBillTrendUp,
  FaSackDollar,
} from "react-icons/fa6";
import { useAccounts } from "../../../hooks/useAccounts";
import { getBalance } from "../../../utils/BalanceUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import NetWorthOverTime from "./NetWorthOverTime";
import { ReactIcon } from "../../ui/ReactIcon";

interface NetWorthProps {}

const NetWorth = (props: NetWorthProps) => {
  const { flattenedAccounts, isLoading, isError } = useAccounts();

  if (isLoading) {
    return <Skeleton height="200px" />;
  }

  if (isError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        Could not load account balances. Please try again.
      </Alert.Root>
    );
  }

  const cash = getBalance(flattenedAccounts, "depository");
  const investment =
    getBalance(flattenedAccounts, "investment") +
    getBalance(flattenedAccounts, "brokerage");
  const credit = getBalance(flattenedAccounts, "credit");
  const loan = getBalance(flattenedAccounts, "loan");
  const liabilityWorth = credit + loan;
  const assetWorth = cash + investment;
  const netWorth = assetWorth - liabilityWorth;

  return (
    <Stack gap="2rem">
      <Box p="1rem">
        <Heading as="h3" size="lg">
          {formatCurrency(netWorth)}
        </Heading>
        <Text>Total Net Worth</Text>
      </Box>
      <NetWorthOverTime />
      <HStack
        gap="2rem"
        align="stretch"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Card.Root
          width={{ base: "100%", md: "50%" }}
          p="1.5rem"
          variant="outline"
        >
          <Card.Header>
            <Heading as="h3" size="md">
              {formatCurrency(assetWorth)}
            </Heading>
            <Text fontSize="sm">Total Assets</Text>
          </Card.Header>
          <Card.Body>
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(2, 1fr)"
              gap="0.5rem"
            >
              <GridItem>
                <Text>
                  <ReactIcon icon={FaMoneyBill} marginRight={2} />
                  Cash
                </Text>
              </GridItem>
              <GridItem>{formatCurrency(cash)}</GridItem>
              <GridItem>
                <Text>
                  <ReactIcon icon={FaMoneyBillTrendUp} marginRight={2} />
                  Investments
                </Text>
              </GridItem>
              <GridItem>{formatCurrency(investment)}</GridItem>
            </Grid>
          </Card.Body>
        </Card.Root>
        <Card.Root
          width={{ base: "100%", md: "50%" }}
          p="1.5rem"
          variant="outline"
        >
          <Card.Header>
            <Heading as="h3" size="md">
              {formatCurrency(liabilityWorth)}
            </Heading>
            <Text fontSize="sm">Total Liabilities</Text>
          </Card.Header>
          <Card.Body>
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(2, 1fr)"
              gap="0.5rem"
            >
              <GridItem>
                <Text>
                  <ReactIcon icon={FaCreditCard} marginRight={2} />
                  Credit
                </Text>
              </GridItem>
              <GridItem>{formatCurrency(credit)}</GridItem>
              <GridItem>
                <Text>
                  <ReactIcon icon={FaSackDollar} marginRight={2} />
                  Loans
                </Text>
              </GridItem>
              <GridItem>{formatCurrency(loan)}</GridItem>
            </Grid>
          </Card.Body>
        </Card.Root>
      </HStack>
    </Stack>
  );
};

export default NetWorth;
