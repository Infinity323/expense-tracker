import { Accordion, Box, Skeleton } from "@chakra-ui/react";
import { useAccounts } from "../../hooks/useAccounts";
import AccountAccordionItem from "./account-accordion-item/AccountAccordionItem";

function AccountsAccordion() {
  const { accounts, isLoading } = useAccounts();

  if (isLoading) {
    return <Skeleton height="200px" />;
  }

  if (!accounts?.length) {
    return <Box p="1rem">No accounts linked.</Box>;
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
