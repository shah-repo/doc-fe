import React, { useEffect, useCallback } from 'react';
import { isEmpty } from 'lodash';
import { SM, SMTabsProps } from '../../..';

export const withSMTabsWrap = <T extends SMTabsProps>(Component: React.FC<T>) => {
  const Comp = (props: T) => {
    const { tabs, onChange } = props;
    const { _tabsState } = SM.useStores();

    // Set initial tab id.
    useEffect(
      () => {
        if (isEmpty(tabs) || _tabsState?.activeTabId) {
          return;
        }

        _tabsState?.setActiveTabId(tabs[0].tabId);
      },
      [_tabsState, tabs]
    );

    const handleChange: SMTabsProps['onChange'] = useCallback(
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

  Comp.displayName = 'withSMTabsWrap';

  return Comp;
};
