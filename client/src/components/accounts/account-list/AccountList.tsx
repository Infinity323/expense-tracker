import {
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
import AccountListCard from "./account-list-card/AccountListCard";
import {
  FaCreditCard,
  FaEllipsis,
  FaMoneyBill,
  FaMoneyBillTrendUp,
  FaSackDollar,
} from "react-icons/fa6";
import { useAccounts } from "../../../hooks/useAccounts";

interface AccountListProps {}

const AccountList: React.FC<AccountListProps> = (props) => {
  const { accounts, isLoading } = useAccounts();

  if (isLoading) {
    return <Skeleton height="200px" />;
  }

  if (!accounts) {
    return <Text>No accounts linked.</Text>;
  }

  return (
    <Stack>
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
              balances={accounts.filter(
                (account) => account.type === "depository"
              )}
            />
          </TabPanel>
          <TabPanel>
            <AccountListCard
              balances={accounts.filter(
                (account) =>
                  account.type === "investment" || account.type === "brokerage"
              )}
            />
          </TabPanel>
          <TabPanel>
            <AccountListCard
              balances={accounts.filter((account) => account.type === "credit")}
            />
          </TabPanel>
          <TabPanel>
            <AccountListCard
              balances={accounts.filter((account) => account.type === "loan")}
            />
          </TabPanel>
          <TabPanel>
            <AccountListCard
              balances={accounts.filter((account) => account.type === "other")}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default AccountList;
