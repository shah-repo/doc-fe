import React, { useRef, useState } from "react";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import SidebarPresenter from "./Sidebar.presenter";
import { Sidebar } from "./types";

interface SidebarContainerProps {
  sidebarList: Sidebar[];
  sidebar: boolean;
  openSidebar: (value: boolean) => void;
}

export const SidebarContainer: React.FunctionComponent<
SidebarContainerProps
> = ({
  sidebarList,
  sidebar,
  openSidebar,
}) => {
  const [indexNumber, setIndex] = useState(0);
  useScrollIntoView();
  const inputRef = useRef(null);

  const changeSize = () => {
    openSidebar(!sidebar);
    if (sidebar) {
      setIndex(0);
    }
    if (inputRef && !sidebar) {
      const input = inputRef.current as any;
      input.focus();
      input.click();
    }
  };
  const handleMenuIconClick = (index: number) => {
    if (!sidebar) {
      openSidebar(!sidebar);
      setIndex(index);
      return;
    }
    setIndex(index);
  };

  return (
    <SidebarPresenter
      {...{
        sidebar,
        changeSize,
        indexNumber,
        sidebarList,
        inputRef,
        setIndex,
        handleMenuIconClick,
      }}
    />
  );
};

export default SidebarContainer;
