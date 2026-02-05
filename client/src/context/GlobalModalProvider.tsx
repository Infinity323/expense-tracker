import { useDisclosure } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useState } from "react";
import AlertModal, { AlertModalProps } from "../components/modals/AlertModal";
import ConfirmationModal, {
  ConfirmationModalProps,
} from "../components/modals/ConfirmationModal";
import LoadingModal, {
  LoadingModalProps,
} from "../components/modals/LoadingModal";

type GlobalModalType = "alert" | "loading" | "confirmation";

type GlobalModalProps<T extends GlobalModalType> = T extends "alert"
  ? AlertModalProps
  : T extends "loading"
    ? LoadingModalProps
    : T extends "confirmation"
      ? ConfirmationModalProps
      : never;

type GlobalModalContextType = {
  openModal: <T extends GlobalModalType>(
    type: T,
    props: GlobalModalProps<T>,
  ) => void;
  closeModal: (type: GlobalModalType) => void;
  props: any;
};

const GlobalModalContext = createContext<GlobalModalContextType>(undefined);

export const useModal = () => useContext(GlobalModalContext);

type GlobalModalProviderProps = {
  children: ReactNode;
};

export const GlobalModalProvider = ({ children }: GlobalModalProviderProps) => {
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();
  const [props, setProps] = useState<any>();

  const openModal = <T extends GlobalModalType>(
    type: T,
    props: GlobalModalProps<T>,
  ) => {
    if (type === "alert") {
      onAlertOpen();
    } else if (type === "loading") {
      onLoadingOpen();
    } else if (type === "confirmation") {
      onConfirmationOpen();
    }
    setProps(props);
  };

  const closeModal = (type: GlobalModalType) => {
    if (type === "alert") {
      onAlertOpen();
    } else if (type === "loading") {
      onLoadingClose();
    } else if (type === "confirmation") {
      onConfirmationOpen();
    }
  };

  return (
    <GlobalModalContext.Provider value={{ openModal, closeModal, props }}>
      <AlertModal isOpen={isAlertOpen} onClose={onAlertClose} />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
      />
      <LoadingModal isOpen={isLoadingOpen} onClose={onLoadingClose} />
      {children}
    </GlobalModalContext.Provider>
  );
};
