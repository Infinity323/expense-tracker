import { useEffect } from "react";
import { useModal } from "../context/GlobalModalProvider";

export const useLoadingModal = ({
  isLoading,
  body,
}: {
  isLoading: boolean;
  body?: string;
}) => {
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (isLoading) openModal("loading", { body: body || "Loading..." });
    else closeModal("loading");
  }, [isLoading, openModal, closeModal, body]);
};
