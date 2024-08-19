import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getAccounts } from "../../services/AccountsService";

function AccountsAccordion() {
  const [accounts, setAccounts] = useState([]);

  const loadAccounts = async () => {
    let accounts = await getAccounts();
    setAccounts(accounts);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <Accordion allowToggle>
      {accounts.map((account) => (
        <AccordionItem key={account.account_id}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <b>{`${account.name} - ${account.mask}`}</b>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {account.official_name}
            <br />
            <br />
            Added on {new Date(account.created_timestamp).toDateString()}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default AccountsAccordion;
