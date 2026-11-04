import {
  Alert,
  Skeleton,
  Stack,
  Tabs,
  Text,
} from "@chakra-ui/react";
import {
  FaCreditCard,
  FaEllipsis,
  FaMoneyBill,
  FaMoneyBillTrendUp,
  FaSackDollar,
} from "react-icons/fa6";
import { useAccounts } from "../../../hooks/useAccounts";
import { useLinkedInstitutions } from "../../../hooks/useLinkedInstitutions";
import AccountListCard from "./account-list-card/AccountListCard";
import { ReactIcon } from "../../ui/ReactIcon";

interface AccountListProps {}

const AccountList = (props: AccountListProps) => {
  const { accounts, flattenedAccounts, isLoading, isError } = useAccounts();
  const { isError: isInstitutionsError } = useLinkedInstitutions();
  const needsAttention = accounts?.some((item) => item.needs_attention);

  if (isLoading) {
    return <Skeleton height="200px" />;
  }

  if (isError || isInstitutionsError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        Could not load account details. Please try again.
      </Alert.Root>
    );
  }

  if (!flattenedAccounts.length) {
    return (
      <Stack>
        {needsAttention && (
          <Alert.Root status="warning">
            <Alert.Indicator />
            One or more linked institutions need attention. Visit Manage
            Accounts to reconnect them.
          </Alert.Root>
        )}
        <Text>
          {needsAttention
            ? "No account details are available for the items needing attention."
            : "No accounts linked."}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack>
      {needsAttention && (
        <Alert.Root status="warning">
          <Alert.Indicator />
          One or more linked institutions need attention. Visit Manage Accounts
          to reconnect them.
        </Alert.Root>
      )}
      <Tabs.Root defaultValue="cash">
        <Tabs.List flexWrap="wrap">
          <Tabs.Trigger value="cash">
            <ReactIcon icon={FaMoneyBill} marginRight={1} />
            Cash
          </Tabs.Trigger>
          <Tabs.Trigger value="investments">
            <ReactIcon icon={FaMoneyBillTrendUp} marginRight={1} />
            Investments
          </Tabs.Trigger>
          <Tabs.Trigger value="credit">
            <ReactIcon icon={FaCreditCard} marginRight={1} />
            Credit
          </Tabs.Trigger>
          <Tabs.Trigger value="loan">
            <ReactIcon icon={FaSackDollar} marginRight={1} />
            Loan
          </Tabs.Trigger>
          <Tabs.Trigger value="other">
            <ReactIcon icon={FaEllipsis} marginRight={1} />
            Other
          </Tabs.Trigger>
        </Tabs.List>
          <Tabs.Content value="cash">
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) => account.type === "depository",
              )}
            />
          </Tabs.Content>
          <Tabs.Content value="investments">
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) =>
                  account.type === "investment" || account.type === "brokerage",
              )}
            />
          </Tabs.Content>
          <Tabs.Content value="credit">
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) => account.type === "credit",
              )}
            />
          </Tabs.Content>
          <Tabs.Content value="loan">
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) => account.type === "loan",
              )}
            />
          </Tabs.Content>
          <Tabs.Content value="other">
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) => account.type === "other",
              )}
            />
          </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
};

export default AccountList;
