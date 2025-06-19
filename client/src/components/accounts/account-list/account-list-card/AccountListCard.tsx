import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
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

const AccountListCard: React.FC<AccountListCardProps> = (props) => {
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
                  account.institutionId
              )?.institution;
              const logo = institution?.logo;

              return (
                <Flex gap={5}>
                  <Center>
                    {logo === undefined ? (
                      <Skeleton boxSize="50px" />
                    ) : (
                      <Image
                        boxSize="50px"
                        src={
                          logo
                            ? `data:image/png;base64,${logo}`
                            : "https://placehold.co/50x50/png"
                        }
                        alt="logo"
                      />
                    )}
                  </Center>
                  <Box>
                    <Text fontWeight="semibold">{account.name}</Text>
                    <Text>
                      {account.official_name} (...{account.mask})
                    </Text>
                    <Text>{account.balances.last_updated_datetime}</Text>
                  </Box>
                  <Spacer />
                  <Text>{formatCurrency(account.balances.current)}</Text>
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
