import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getBalances } from "../../../services/itemService";
import { formatCurrency } from "../../../utils/CurrencyUtil";

interface NetWorthProps {}

const NetWorth: React.FC<NetWorthProps> = (props) => {
  const { data: balances } = useQuery({
    queryKey: ["balances"],
    queryFn: getBalances,
  });

  if (!balances) {
    return <Skeleton height="200px" />;
  }

  const getBalance = (type: string) =>
    balances
      .filter((balance) => balance.type === type)
      .map((balance) => balance.balances.current)
      .reduce((sum, current) => sum + current, 0);

  const cash = getBalance("depository");
  const investment = getBalance("investment") + getBalance("brokerage");
  const credit = getBalance("credit");
  const loan = getBalance("loan");
  const liabilityWorth = credit + loan;
  const assetWorth = cash + investment;
  const netWorth = assetWorth - liabilityWorth;

  return (
    <Stack>
      <Box p="1rem">
        <Heading as="h3" size="lg">
          {formatCurrency(netWorth)}
        </Heading>
        <Text>Total Net Worth</Text>
      </Box>
      <HStack spacing="2rem">
        <Card width="50%" p="1.5rem">
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
              <GridItem>Cash</GridItem>
              <GridItem>{formatCurrency(cash)}</GridItem>
              <GridItem>Investments</GridItem>
              <GridItem>{formatCurrency(investment)}</GridItem>
            </Grid>
          </CardBody>
        </Card>
        <Card width="50%" p="1.5rem">
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
              <GridItem>Credit</GridItem>
              <GridItem>{formatCurrency(credit)}</GridItem>
              <GridItem>Loans</GridItem>
              <GridItem>{formatCurrency(loan)}</GridItem>
            </Grid>
          </CardBody>
        </Card>
      </HStack>
    </Stack>
  );
};

export default NetWorth;
