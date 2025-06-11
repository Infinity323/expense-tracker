import {
  Center,
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

function LoadingModal({ isLoading }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isLoading) {
      onOpen();
    } else {
      onClose();
    }
  }, [isLoading, onOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <Center>
            <VStack>
              <Spinner color="teal" size="lg" />
              <Text fontWeight="semibold">Loading...</Text>
            </VStack>
          </Center>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default LoadingModal;
