import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { getAccounts } from "../../services/AccountsService";
import LoadingModal from "../shared/LoadingModal";

function AccountsAccordion() {
  const [accounts, setAccounts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  const loadAccounts = async () => {
    onOpenRef.current();
    setAccounts(await getAccounts());
    onCloseRef.current();
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <>
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
      <LoadingModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default AccountsAccordion;
