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
import React, { useRef } from "react";
import { ModalProps } from "../../types/modalProps";
import { useModal } from "../../context/GlobalModalProvider";

export interface ConfirmationModalProps {
  header: string;
  body: string;
  confirmButton: {
    label: string;
    callback: () => void;
  };
}

const ConfirmationModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose } = props;

  const cancelRef = useRef();

  const { props: modalProps } = useModal() as {
    props?: ConfirmationModalProps;
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
          <Button colorScheme="red" ml={3}>
            {modalProps?.confirmButton?.label}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
