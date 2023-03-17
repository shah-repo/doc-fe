import { useState } from "react";

const useMenu = () => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchor);

  const openWithAchor = setAnchor;
  const open: React.MouseEventHandler<HTMLElement> = (event) => {
    setAnchor(event.currentTarget);
  };
  const close = () => {
    setAnchor(null);
  };

  return {
    anchor,
    isOpen,
    open,
    openWithAchor,
    close,
  };
};

export default useMenu;
