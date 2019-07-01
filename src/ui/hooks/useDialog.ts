import { useState } from "react";

export interface DialogHandler {
  isOpen: boolean;
  open: () => any;
  close: () => any;
}

const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
  };
};

export type Dialog = ReturnType<typeof useDialog>;

export default useDialog;
