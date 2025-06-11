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
import { useEffect, useRef } from "react";

function LoadingModal({ isLoading }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    if (isLoading) {
      onOpenRef.current();
    } else {
      onCloseRef.current();
    }
  }, [isLoading]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <Center>
            <VStack>
              <Spinner color="teal" size="lg" />
              <Text fontWeight="medium">Loading...</Text>
            </VStack>
          </Center>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default LoadingModal;
