import React, { useRef, useState } from "react";
import SidebarPresenter from "./Sidebar.presenter";
import { Sidebar } from "./types";

interface SidebarContainerProps {
  sidebarList: Sidebar[];
  isDrawerOpen: boolean;
  setOpen: (value: boolean) => void;
}

export const SidebarContainer: React.FunctionComponent<
  SidebarContainerProps
> = ({
  sidebarList,
  isDrawerOpen,
  setOpen,
}) => {
    const [indexNumber, setIndex] = useState(0);
    const inputRef = useRef(null);

    const onDrawerToggle = () => {
      setOpen(!isDrawerOpen);
      if (isDrawerOpen) {
        setIndex(0);
      }
      if (inputRef && !isDrawerOpen) {
        const input = inputRef.current as any;
        input.focus();
        input.click();
      }
    };
    const handleMenuIconClick = (index: number) => {
      if (!isDrawerOpen) {
        setOpen(!isDrawerOpen);
        setIndex(index);
        return;
      }
      setIndex(index);
    };

    return (
      <SidebarPresenter
        {...{
          isDrawerOpen,
          indexNumber,
          sidebarList,
          inputRef,
          setIndex,
          handleMenuIconClick,
          onDrawerToggle,
        }}
      />
    );
  };

export default SidebarContainer;
