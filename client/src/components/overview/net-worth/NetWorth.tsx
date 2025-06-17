import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
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

interface NetWorthProps {}

const NetWorth: React.FC<NetWorthProps> = (props) => {
  const { accounts, flattenedAccounts } = useAccounts();

  if (!accounts) {
    return <Skeleton height="200px" />;
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
    <Stack spacing="2rem">
      <Box p="1rem">
        <Heading as="h3" size="lg">
          {formatCurrency(netWorth)}
        </Heading>
        <Text>Total Net Worth</Text>
      </Box>
      <HStack spacing="2rem">
        <Card width="50%" p="1.5rem" variant="outline">
          <CardHeader>
            <Heading as="h3" size="md">
              {formatCurrency(assetWorth)}
            </Heading>
            <Text>Total Assets</Text>
          </CardHeader>
          <CardBody>
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(2, 1fr)"
              gap="0.5rem"
            >
              <GridItem>
                <Text>
                  <Icon as={FaMoneyBill} marginRight={2} />
                  Cash
                </Text>
              </GridItem>
              <GridItem>{formatCurrency(cash)}</GridItem>
              <GridItem>
                <Text>
                  <Icon as={FaMoneyBillTrendUp} marginRight={2} />
                  Investments
                </Text>
              </GridItem>
              <GridItem>{formatCurrency(investment)}</GridItem>
            </Grid>
          </CardBody>
        </Card>
        <Card width="50%" p="1.5rem" variant="outline">
          <CardHeader>
            <Heading as="h3" size="md">
              {formatCurrency(liabilityWorth)}
            </Heading>
            <Text>Total Liabilities</Text>
          </CardHeader>
          <CardBody>
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(2, 1fr)"
              gap="0.5rem"
            >
              <GridItem>
                <Text>
                  <Icon as={FaCreditCard} marginRight={2} />
                  Credit
                </Text>
              </GridItem>
              <GridItem>{formatCurrency(credit)}</GridItem>
              <GridItem>
                <Text>
                  <Icon as={FaSackDollar} marginRight={2} />
                  Loans
                </Text>
              </GridItem>
              <GridItem>{formatCurrency(loan)}</GridItem>
            </Grid>
          </CardBody>
        </Card>
      </HStack>
    </Stack>
  );
};

export default NetWorth;
