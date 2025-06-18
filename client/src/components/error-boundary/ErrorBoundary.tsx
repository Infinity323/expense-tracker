import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorModal = ({ error, resetErrorBoundary }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Something went wrong.</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{error}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              resetErrorBoundary();
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  const { children } = props;

  const log = (error: Error) => console.error(error);

  return (
    <ReactErrorBoundary FallbackComponent={ErrorModal} onError={log}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
