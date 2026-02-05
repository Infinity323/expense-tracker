import {
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleInfo,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { useModal } from "../../context/GlobalModalProvider";
import { ModalProps } from "../../types/modalProps";

export interface AlertModalProps {
  header: string;
  body: string;
  status?: "error" | "info" | "success" | "warning";
}

const AlertModal = (props: ModalProps) => {
  const { isOpen, onClose } = props;

  const { props: modalProps } = useModal() as {
    props?: AlertModalProps;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            {modalProps?.status && (
              <Icon
                as={
                  modalProps.status === "error"
                    ? FaCircleExclamation
                    : modalProps.status === "warning"
                      ? FaTriangleExclamation
                      : modalProps.status === "success"
                        ? FaCircleCheck
                        : FaCircleInfo
                }
                color={
                  modalProps.status === "error"
                    ? "red"
                    : modalProps.status === "warning"
                      ? "orange"
                      : modalProps.status === "success"
                        ? "green"
                        : "blue"
                }
                boxSize={8}
                marginRight={1}
              />
            )}
            <Text>{modalProps?.header}</Text>
          </HStack>
        </ModalHeader>
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
