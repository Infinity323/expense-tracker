import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useModal } from "../../context/GlobalModalProvider";
import { ModalProps } from "../../types/modalProps";

export interface ConfirmationModalProps {
  header: string;
  body: string;
  confirmButton: {
    label: string;
    callback: () => void;
  };
}

const ConfirmationModal = (props: ModalProps) => {
  const { isOpen, onClose } = props;

  const cancelRef = useRef();

  const { props: modalProps } = useModal() as {
    props?: ConfirmationModalProps;
  };

  const onConfirm = () => {
    onClose();
    modalProps?.confirmButton.callback();
  };

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{modalProps?.header}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{modalProps?.body}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" ml={3} onClick={onConfirm}>
            {modalProps?.confirmButton?.label}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
