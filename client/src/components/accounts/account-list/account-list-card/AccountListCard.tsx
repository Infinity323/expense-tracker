import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Circle,
  Flex,
  Heading,
  Image,
  Skeleton,
  Spacer,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { useLinkedInstitutions } from "../../../../hooks/useLinkedInstitutions";
import { ItemAccount } from "../../../../types/itemAccount";
import { formatCurrency } from "../../../../utils/CurrencyUtil";

interface AccountListCardProps {
  balances: ItemAccount[];
}

const AccountListCard = (props: AccountListCardProps) => {
  const { balances } = props;
  const { institutions } = useLinkedInstitutions();

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
            balances.map((account) => {
              const institution = institutions?.find(
                (institution) =>
                  institution.institution.institution_id ===
                  account.institutionId,
              )?.institution;
              const logo = institution?.logo;

              return (
                <Flex gap={{ base: 3, sm: 5 }} align="center" minWidth={0}>
                  <Center>
                    {logo === undefined ? (
                      <Skeleton boxSize="50px" />
                    ) : logo === null ? (
                      <Circle size="50px" />
                    ) : (
                      <Image
                        boxSize="50px"
                        src={`data:image/png;base64,${logo}`}
                        alt="logo"
                      />
                    )}
                  </Center>
                  <Box minWidth={0}>
                    <Text fontWeight="semibold" noOfLines={1}>{account.name}</Text>
                    <Text noOfLines={1}>
                      {account.official_name} (...{account.mask})
                    </Text>
                  </Box>
                  <Spacer />
                  <Text whiteSpace="nowrap">
                    {formatCurrency(account.balances.current)}
                  </Text>
                </Flex>
              );
            })
          ) : (
            <Text>No accounts linked.</Text>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default AccountListCard;
