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
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { useUserContext } from "../../context/UserProvider";
import { syncTransactions } from "../../services/transactionService";

function SyncTransactions({ setReload }) {
  const { accessTokens } = useUserContext();

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
    for (const entry of accessTokens) {
      try {
        await syncTransactions(entry.itemId, entry.accessToken);
      } catch (err) {
        errorOnOpen();
      }
    }
    refreshOnClose();
    setReload(true);
  };

  return (
    <>
      <Button colorScheme="teal" onClick={sync}>
        Sync
      </Button>
      <Modal isOpen={refreshIsOpen} onClose={refreshOnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalBody>
            <Center>
              <VStack>
                <Spinner color="teal" size="lg" />
                <Text fontWeight="semibold">Syncing transactions...</Text>
              </VStack>
            </Center>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
      <Modal isOpen={errorIsOpen} onClose={errorOnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalBody>
            <VStack>
              <Center>
                <Icon as={FaCircleExclamation} boxSize={16} color="red" />
              </Center>
              <Text fontWeight="semibold">
                One or more of your accounts require attention.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}

export default SyncTransactions;
