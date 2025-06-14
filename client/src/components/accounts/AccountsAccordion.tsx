import { Accordion, Box, Skeleton } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getAccounts } from "../../services/accountsService";
import AccountAccordionItem from "./account-item/AccountAccordionItem";

function AccountsAccordion() {
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  if (!accounts) {
    return <Skeleton height="200px" />;
  }

  if (!accounts.length) {
    return <Box p="3rem">No accounts linked.</Box>;
  }

  return (
    <Accordion allowToggle>
      {accounts?.map((account) => (
        <AccountAccordionItem account={account} />
      ))}
    </Accordion>
  );
}

export default AccountsAccordion;
