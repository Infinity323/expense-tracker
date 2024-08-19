import {
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";

function LoadingModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>Loading...</Center>
        </ModalHeader>
        <ModalBody>
          <Center>
            <Spinner color="teal" size="xl" />
          </Center>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default LoadingModal;
