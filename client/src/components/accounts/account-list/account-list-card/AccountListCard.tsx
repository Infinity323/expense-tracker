import {
  Box,
  Card,
  Center,
  Circle,
  Flex,
  Heading,
  Image,
  Skeleton,
  Spacer,
  Stack,
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
    <Card.Root p="1.5rem" variant="outline">
      <Card.Header>
        <Box>
          <Heading size="lg">{formatCurrency(totalBalance)}</Heading>
          <Text>Total Balance</Text>
        </Box>
      </Card.Header>
      <Card.Body>
        <Stack>
          {balances.length ? (
            balances.map((account) => {
              const institution = institutions?.find(
                (institution) =>
                  institution.institution.institution_id ===
                  account.institutionId,
              )?.institution;
              const logo = institution?.logo;

              return (
                <Flex
                  gap={{ base: 3, sm: 5 }}
                  align="center"
                  minWidth={0}
                >
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
                    <Text fontWeight="semibold" lineClamp={1}>
                      {account.name}
                    </Text>
                    <Text lineClamp={1}>
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
      </Card.Body>
    </Card.Root>
  );
};

export default AccountListCard;
