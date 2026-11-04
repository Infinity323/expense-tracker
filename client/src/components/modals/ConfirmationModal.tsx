import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
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
    <Dialog.Root
      initialFocusEl={() => cancelRef.current}
      open={isOpen}
      placement="center"
      role="alertdialog"
      onOpenChange={(e) => {
        if (!e.open) {
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>{modalProps?.header}</Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body>{modalProps?.body}</Dialog.Body>
            <Dialog.Footer>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette="red" ml={3} onClick={onConfirm}>
                {modalProps?.confirmButton?.label}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ConfirmationModal;
