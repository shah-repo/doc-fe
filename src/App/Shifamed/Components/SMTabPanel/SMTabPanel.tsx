import { Observer } from 'mobx-react';
import React from 'react';
import { SMBox, SMTabPanelProps } from '../../..';
import useStyles from './SMTabPanel.styles';
import { withSMTabPanelWrap } from './SMTabPanel.wrap';

const SMTabPanel: React.FunctionComponent<SMTabPanelProps> = ({
  _tabsState,
  tabId,
  tabIndex,
  children,
  panelProps,
}) => {
  const classes = useStyles();
  const active = _tabsState?.isTabActive(tabId);

  if (!active) {
    return null;
  }

  return (
    <Observer>
      {() => (
        <SMBox
          id={`sm-tabpanel-${tabIndex ?? tabId}`}
          className={classes.content}
          {...panelProps}
        >
          {children}
        </SMBox>
      )}
    </Observer>
  );
};

export default withSMTabPanelWrap(SMTabPanel);
