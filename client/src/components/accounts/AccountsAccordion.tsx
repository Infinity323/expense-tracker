import { Accordion } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getAccounts } from "../../services/accountsService";
import AccountAccordionItem from "./account-item/AccountAccordionItem";

function AccountsAccordion() {
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  return (
    <Accordion allowToggle>
      {accounts?.map((account) => (
        <AccountAccordionItem account={account} />
      ))}
    </Accordion>
  );
}

export default AccountsAccordion;
