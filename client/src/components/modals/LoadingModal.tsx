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
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useModal } from "../../context/GlobalModalProvider";
import { ModalProps } from "../../types/modalProps";

export interface LoadingModalProps {
  body: string;
}

const LoadingModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose } = props;

  const { props: modalProps } = useModal() as {
    props?: LoadingModalProps;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <Center>
            <VStack>
              <Spinner color="teal" size="lg" />
              <Text fontWeight="semibold">{modalProps?.body}</Text>
            </VStack>
          </Center>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default LoadingModal;
