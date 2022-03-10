import React, { useRef, useState } from "react";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import SidebarPresenter from "./Sidebar.presenter.new";
import { Sidebar } from "./types.new";

interface SidebarContainerProps {
  sidebarList: Sidebar[];
  isDrawerOpen?: boolean;
  setOpen?: (value: boolean) => void;
}

interface HandleMenuClickContextProps {
  handleMenuIconClick: (index) => void;
  indexOfMigrationTab: number;
  showMigration: boolean;
}

export let HandleMenuClickContext = React.createContext<HandleMenuClickContextProps | undefined>(
  undefined
);

const SidebarContainer: React.FunctionComponent<
  SidebarContainerProps
> = ({
  sidebarList,
  isDrawerOpen = true,
  setOpen,
}) => {
  const [indexNumber, setIndex] = useState(0);
  const inputRef = useRef(null);
  const showMigration = sidebarList
    .map((e) => e.details.shouldShow && e.type)
    .indexOf("formMigration");
  const indexOfMigrationTab = sidebarList
    .map((e) => e.type)
    .indexOf("formMigration");
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

  HandleMenuClickContext = React.createContext<HandleMenuClickContextProps | undefined>({
    handleMenuIconClick,
    indexOfMigrationTab,
    showMigration: showMigration !== -1,
  });

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
