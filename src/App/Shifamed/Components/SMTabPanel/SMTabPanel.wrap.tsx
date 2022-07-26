import React from "react";
import { SM, SMTabPanelProps } from "../../..";

export const withSMTabPanelWrap = <T extends SMTabPanelProps>(
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

  Comp.displayName = "withSMTabPanelWrap";
  return Comp;
};
