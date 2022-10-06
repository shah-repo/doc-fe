import React from "react";
import { DocumentRevisionFormState, SM, SMProvider, SMTabsHOCProps, SMTabsState } from "../../..";

export const withSMTabs = <T extends SMTabsHOCProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    _tabsState,
    _documentRevisionFormState,
    ...props
  }: T) => {

    _tabsState = SM.useRef(SMTabsState);
    _documentRevisionFormState = SM.useRef(DocumentRevisionFormState);

    return (
      <SMProvider {...{ _tabsState, _documentRevisionFormState }}>
        <Component {...props as T} {...{ _tabsState, _documentRevisionFormState }} />
      </SMProvider>
    );
  };

  Comp.displayName = "withSMTabs";
  return Comp;
};
