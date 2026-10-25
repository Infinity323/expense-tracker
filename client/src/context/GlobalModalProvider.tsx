import { useDisclosure } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useState } from "react";
import ConfirmationModal, {
  ConfirmationModalProps,
} from "../components/modals/ConfirmationModal";
import LoadingModal, {
  LoadingModalProps,
} from "../components/modals/LoadingModal";

type GlobalModalType = "loading" | "confirmation";

type GlobalModalProps<T extends GlobalModalType> = T extends "loading"
  ? LoadingModalProps
  : ConfirmationModalProps;

type GlobalModalContextType = {
  openModal: <T extends GlobalModalType>(
    type: T,
    props: GlobalModalProps<T>,
  ) => void;
  closeModal: (type: GlobalModalType) => void;
  props?: LoadingModalProps | ConfirmationModalProps;
};

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(
  undefined,
);

export const useModal = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error("useModal must be used within GlobalModalProvider");
  }
  return context;
};

type GlobalModalProviderProps = {
  children: ReactNode;
};

export const GlobalModalProvider = ({ children }: GlobalModalProviderProps) => {
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
    if (type === "loading") {
      onLoadingOpen();
    } else {
      onConfirmationOpen();
    }
    setProps(props);
  };

  const closeModal = (type: GlobalModalType) => {
    if (type === "loading") {
      onLoadingClose();
    } else {
      onConfirmationClose();
    }
  };

  return (
    <GlobalModalContext.Provider value={{ openModal, closeModal, props }}>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
      />
      <LoadingModal isOpen={isLoadingOpen} onClose={onLoadingClose} />
      {children}
    </GlobalModalContext.Provider>
  );
};
