import { Box, Heading, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AccountsAccordion from "../components/accounts/AccountsAccordion";
import Link from "../components/accounts/Link";
import LoadingModal from "../components/shared/LoadingModal";
import { getLinkToken } from "../services/LinkService";

function Accounts() {
  const [linkToken, setLinkToken] = useState();
  const [reload, setReload] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  const establishLink = async () => {
    onOpenRef.current();
    const newLinkToken = await getLinkToken();
    setLinkToken(newLinkToken);
    onCloseRef.current();
    setReload(false);
  };

  useEffect(() => {
    establishLink();
  }, []);

  useEffect(() => {
    if (reload === true) {
      onOpenRef.current();
    } else if (reload === false) {
      onCloseRef.current();
    }
  }, [reload]);

  return (
    <>
      <Box padding="7rem">
        <Heading as="h1" size="lg">
          Accounts
        </Heading>
        <br />
        <AccountsAccordion reload={reload} setReload={setReload} />
        <br />
        {linkToken && <Link linkToken={linkToken} setReload={setReload} />}
      </Box>
      <LoadingModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Accounts;
