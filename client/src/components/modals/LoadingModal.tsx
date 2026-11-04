import {
  Center,
  Spinner,
  Text,
  VStack,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { useModal } from "../../context/GlobalModalProvider";
import { ModalProps } from "../../types/modalProps";

export interface LoadingModalProps {
  body: string;
}

const LoadingModal = (props: ModalProps) => {
  const { isOpen, onClose } = props;

  const { props: modalProps } = useModal() as {
    props?: LoadingModalProps;
  };

  return (
    <Dialog.Root
      open={isOpen}
      placement="center"
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
            <Dialog.Header />
            <Dialog.Body>
              <Center>
                <VStack>
                  <Spinner color="teal" size="lg" />
                  <Text fontWeight="semibold">{modalProps?.body}</Text>
                </VStack>
              </Center>
            </Dialog.Body>
            <Dialog.Footer />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default LoadingModal;
