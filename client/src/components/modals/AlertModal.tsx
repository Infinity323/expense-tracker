import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
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

const AlertModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose } = props;

  const { props: modalProps } = useModal() as {
    props?: AlertModalProps;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Stack direction="row" spacing={0}>
          <ModalHeader>
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
                boxSize={10}
              />
            )}
          </ModalHeader>
          <Box>
            <ModalHeader>
              <Text>{modalProps?.header}</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>{modalProps?.body}</ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </Box>
        </Stack>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
