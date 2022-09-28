import React from "react";
import { SM, SMTabsProps } from "../../..";

export const withSMTabsWrap = <T extends SMTabsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    // MARK: @config
    const { _tabsState } = SM.useStores();

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <Component
        {...props}
        {...{ _tabsState }}
      />
    );
  };

  Comp.displayName = "withSMTabsWrap";
  return Comp;
};
