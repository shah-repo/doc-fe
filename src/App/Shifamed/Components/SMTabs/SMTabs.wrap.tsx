import React, { useCallback } from "react";
import { SM, SMTabsProps } from "../../..";

export const withSMTabsWrap = <T extends SMTabsProps>(Component: React.FC<T>) => {
  const Comp = (props: T) => {
    const { onChange } = props;
    const { _tabsState } = SM.useStores();

    const handleChange: SMTabsProps["onChange"] = useCallback(
      (event, newValue) => {
        _tabsState?.setActiveTabId(newValue);
        return onChange?.(event, newValue);
      },
      [_tabsState, onChange]
    );

    return (
      <Component
        {...props}
        {...{ _tabsState }}
        onChange={handleChange}
      />
    );
  };

  Comp.displayName = "withSMTabsWrap";

  return Comp;
};
