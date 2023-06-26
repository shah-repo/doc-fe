import React, { useEffect, useRef, useState } from 'react';
import FBStore from '../../form.builder/FBStore/FBStore';
import { useScrollIntoView } from '../../hooks/useScrollIntoView';
import { SIDE_BAR_TAB_INDEX } from './constants';
import SidebarPresenter from './Sidebar.presenter.new';
import { Sidebar } from './types.new';

interface SidebarContainerProps {
  sidebarList: Sidebar[]
  isDrawerOpen?: boolean
  setOpen?: (value: boolean) => void
  setTab?: (value: number) => void
}

const SidebarContainer: React.FunctionComponent<
  SidebarContainerProps
> = ({
  sidebarList,
  isDrawerOpen = true,
  setOpen,
  setTab,
}) => {
  const [indexNumber, setIndex] = useState(0);
  useEffect(() => {
    const selectedTab = sidebarList[indexNumber].type;
    FBStore.setSelectedTab(selectedTab);
  }, [indexNumber, sidebarList]);

  useEffect(() => {
    const index = localStorage.getItem(SIDE_BAR_TAB_INDEX);
    if (index) {
      setIndex(Number(index));
    }
  }, []);

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
    setTab?.(index);
    localStorage.setItem(SIDE_BAR_TAB_INDEX, String(index));
  };

  return (
    <SidebarPresenter
      {...{
        isDrawerOpen,
        indexNumber,
        sidebarList,
        inputRef,
        handleMenuIconClick,
        onDrawerToggle,
      }}
    />
  );
};

export default SidebarContainer;
