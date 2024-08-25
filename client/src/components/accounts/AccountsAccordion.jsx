import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { getAccounts } from "../../services/AccountsService";

function AccountsAccordion({ reload, setReload }) {
  const [accounts, setAccounts] = useState([]);

  const loadAccounts = async () => {
    setAccounts(await getAccounts());
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (reload) {
      loadAccounts();
      setReload(false);
    }
  }, [reload, setReload]);

  return (
    <Accordion allowToggle>
      {accounts.map((account) => (
        <AccordionItem key={account.account_id}>
          <Heading as="h3" size="md">
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <HStack>
                  <Text
                    as="span"
                    fontWeight="bold"
                  >{`${account.name} - ${account.mask}`}</Text>
                  {account.needs_attention && (
                    <>
                      <Icon
                        as={FaCircleExclamation}
                        verticalAlign="center"
                        color="red"
                      />
                      <Text as="span" color="red">
                        Needs attention!
                      </Text>
                    </>
                  )}
                </HStack>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            {account.official_name}
            <br />
            <br />
            Linked on {new Date(account.created_timestamp).toLocaleDateString()}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default AccountsAccordion;
