import React from "react";
import { SM, SMProvider, SMTabsHOCProps, SMTabsState } from "../../..";

export const withSMTabs = <T extends SMTabsHOCProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    _tabsState,
    ...props
  }: T) => {

    _tabsState = SM.useRef(SMTabsState);

    return (
      <SMProvider {...{ _tabsState }}>
        <Component {...props as T} {...{ _tabsState }} />
      </SMProvider>
    );
  };

  Comp.displayName = "withSMTabs";
  return Comp;
};
