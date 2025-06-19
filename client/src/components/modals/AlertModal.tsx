import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useModal } from "../../context/GlobalModalProvider";
import { ModalProps } from "../../types/modalProps";

export interface AlertModalProps {
  header: string;
  body: string;
}

const AlertModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose } = props;

  const { props: modalProps } = useModal() as {
    props?: AlertModalProps;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalProps?.header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{modalProps?.body}</ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
