import {
  Alert,
  AlertIcon,
  Icon,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
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
      <Alert status="error">
        <AlertIcon />
        Could not load account details. Please try again.
      </Alert>
    );
  }

  if (!flattenedAccounts.length) {
    return (
      <Stack>
        {needsAttention && (
          <Alert status="warning">
            <AlertIcon />
            One or more linked institutions need attention. Visit Manage Accounts
            to reconnect them.
          </Alert>
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
        <Alert status="warning">
          <AlertIcon />
          One or more linked institutions need attention. Visit Manage Accounts
          to reconnect them.
        </Alert>
      )}
      <Tabs>
        <TabList>
          <Tab>
            <Icon as={FaMoneyBill} marginRight={1} />
            Cash
          </Tab>
          <Tab>
            <Icon as={FaMoneyBillTrendUp} marginRight={1} />
            Investments
          </Tab>
          <Tab>
            <Icon as={FaCreditCard} marginRight={1} />
            Credit
          </Tab>
          <Tab>
            <Icon as={FaSackDollar} marginRight={1} />
            Loan
          </Tab>
          <Tab>
            <Icon as={FaEllipsis} marginRight={1} />
            Other
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) => account.type === "depository",
              )}
            />
          </TabPanel>
          <TabPanel>
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) =>
                  account.type === "investment" || account.type === "brokerage",
              )}
            />
          </TabPanel>
          <TabPanel>
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) => account.type === "credit",
              )}
            />
          </TabPanel>
          <TabPanel>
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) => account.type === "loan",
              )}
            />
          </TabPanel>
          <TabPanel>
            <AccountListCard
              balances={flattenedAccounts.filter(
                (account) => account.type === "other",
              )}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default AccountList;
