import React, { useEffect, useRef, useState } from "react";
import FBStore from "../../form.builder/FBStore/FBStore";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import SidebarPresenter from "./Sidebar.presenter.new";
import { Sidebar } from "./types.new";

interface SidebarContainerProps {
  sidebarList: Sidebar[];
  isDrawerOpen?: boolean;
  setOpen?: (value: boolean) => void;
}

const SidebarContainer: React.FunctionComponent<
  SidebarContainerProps
> = ({
  sidebarList,
  isDrawerOpen = true,
  setOpen,
}) => {
  const [indexNumber, setIndex] = useState(0);
  useEffect(() => {
    const selectedTab = sidebarList[indexNumber].type;
    FBStore.setSelectedTab(selectedTab);
  }, [indexNumber, sidebarList]);
  const inputRef = useRef(null);
  useScrollIntoView();
  const onDrawerToggle = () => {
    setOpen?.(!isDrawerOpen);
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
      setOpen?.(!isDrawerOpen);
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
