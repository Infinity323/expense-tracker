import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { syncTransactions } from "../../services/TransactionService";

function SyncTransactions({ setReload }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sync = async () => {
    onOpen();
    let accessTokens = JSON.parse(sessionStorage.getItem("accessTokens"));
    for (const entry of accessTokens) {
      await syncTransactions(entry.itemId, entry.accessToken);
    }
    onClose();
    setReload(true);
  };

  return (
    <>
      <Button colorScheme="teal" onClick={sync}>
        Refresh
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
    </>
  );
}

export default SyncTransactions;
