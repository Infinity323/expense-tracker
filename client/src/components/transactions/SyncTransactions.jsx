import {
  Button,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { syncTransactions } from "../../services/TransactionService";

function SyncTransactions({ setReload }) {
  const {
    isOpen: refreshIsOpen,
    onOpen: refreshOnOpen,
    onClose: refreshOnClose,
  } = useDisclosure();
  const {
    isOpen: errorIsOpen,
    onOpen: errorOnOpen,
    onClose: errorOnClose,
  } = useDisclosure();

  const sync = async () => {
    refreshOnOpen();
    let accessTokens = JSON.parse(sessionStorage.getItem("accessTokens"));
    for (const entry of accessTokens) {
      try {
        await syncTransactions(entry.itemId, entry.accessToken);
      } catch (err) {
        errorOnOpen();
      }
    }
    refreshOnClose();
  };

  useEffect(() => {
    if (!errorIsOpen) {
      setReload(true);
    }
  }, [errorIsOpen]);

  return (
    <>
      <Button colorScheme="teal" onClick={sync}>
        Refresh
      </Button>
      <Modal isOpen={refreshIsOpen} onClose={refreshOnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>Refreshing transactions...</Center>
          </ModalHeader>
          <ModalBody>
            <Center>
              <Spinner color="teal" size="xl" />
            </Center>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
      <Modal isOpen={errorIsOpen} onClose={errorOnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>One or more of your accounts require attention</Center>
          </ModalHeader>
          <ModalBody>
            <Center>
              <Icon as={FaCircleExclamation} boxSize={16} color="red" />
            </Center>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}

export default SyncTransactions;
