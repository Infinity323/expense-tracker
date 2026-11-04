import {
  Toaster as ChakraToaster,
  Toast,
  createToaster,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
  max: 3,
});

export function Toaster() {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <Toast.Root>
          {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
          {toast.description && (
            <Toast.Description>{toast.description}</Toast.Description>
          )}
          {toast.closable && <Toast.CloseTrigger />}
        </Toast.Root>
      )}
    </ChakraToaster>
  );
}

type ToastStatus = "error" | "info" | "success" | "warning" | "loading";

export function showToast(options: {
  id?: string;
  title?: string;
  description?: string;
  status?: ToastStatus;
  isClosable?: boolean;
}) {
  const { status, isClosable, ...toastOptions } = options;
  toaster.create({
    ...toastOptions,
    type: status,
    closable: isClosable,
  });
}

export function useToast() {
  return showToast;
}
