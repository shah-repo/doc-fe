import React from 'react';
import { SM, SMTabPanelProps } from '../../..';

export const withSMTabPanelWrap = <T extends SMTabPanelProps>(Component: React.FunctionComponent<T>) => {
  const Comp = (props: T) => {
    const { _tabsState } = SM.useStores();

    return (
      <Component
        {...props}
        {...{ _tabsState }}
      />
    );
  };

  Comp.displayName = 'withSMTabPanelWrap';

  return Comp;
};
