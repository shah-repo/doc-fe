import { isEmpty } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { SM, SMTabsProps } from '../../..';

export const withSMTabsWrap = <T extends SMTabsProps>(Component: React.FC<T>) => {
  const Comp = (props: T) => {
    const { tabs, onChange } = props;
    const { _tabsState } = SM.useStores();
    const location = useLocation();
    const history = useHistory();
    // Set initial tab id.
    useEffect(
      () => {
        if (isEmpty(tabs) || _tabsState?.activeTabId) {
          return;
        }

        _tabsState?.setActiveTabId(tabs[0].tabId);
        if(location?.state?.toTabId) {
          setTimeout(() => {
            handleChange?.({} as React.SyntheticEvent, location?.state?.toTabId);
            history.replace(location.pathname, {});
          }, 100);
        }
      },
      [_tabsState, tabs],
    );

    const handleChange: SMTabsProps['onChange'] = useCallback(
      (event, newValue) => {
        _tabsState?.setActiveTabId(newValue);
        return onChange?.(event, newValue);
      },
      [_tabsState, onChange],
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
