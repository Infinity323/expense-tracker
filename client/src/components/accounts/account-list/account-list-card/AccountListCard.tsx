import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { AccountBase } from "plaid";
import { formatCurrency } from "../../../../utils/CurrencyUtil";

interface AccountListCardProps {
  balances: AccountBase[];
}

const AccountListCard: React.FC<AccountListCardProps> = (props) => {
  const { balances } = props;

  const totalBalance = balances
    .map((account) => account.balances.current)
    .reduce((sum, current) => sum + current, 0);

  return (
    <Card p="1.5rem" variant="outline">
      <CardHeader>
        <Box>
          <Heading size="lg">{formatCurrency(totalBalance)}</Heading>
          <Text>Total Balance</Text>
        </Box>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />}>
          {balances.length ? (
            balances.map((account) => (
              <Grid templateColumns="repeat(8, 1fr)">
                <GridItem colSpan={1}>
                  <Text>Placeholder</Text>
                </GridItem>
                <GridItem colSpan={6}>
                  <Box>
                    <Text fontWeight="semibold">{account.name}</Text>
                    <Text>
                      {account.official_name} (...{account.mask})
                    </Text>
                    <Text>{account.balances.last_updated_datetime}</Text>
                  </Box>
                </GridItem>
                <GridItem colSpan={1}>
                  <Text>{formatCurrency(account.balances.current)}</Text>
                </GridItem>
              </Grid>
            ))
          ) : (
            <Text>No accounts linked.</Text>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default AccountListCard;
