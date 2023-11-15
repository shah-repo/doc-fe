import cx from 'classnames';
import { Observer } from 'mobx-react';
import React from 'react';
import { SMBox, SMTabPanelProps } from '../../..';
import { TabTypeOptions } from '../../../../state/ducks/documentRevisions/documentType/types';
import useStyles from './SMTabPanel.styles';
import { withSMTabPanelWrap } from './SMTabPanel.wrap';

const SMTabPanel: React.FunctionComponent<SMTabPanelProps> = ({
  _tabsState,
  tabId,
  tabIndex,
  children,
  panelProps,
  isCreateUrl,
}) => {
  const classes = useStyles({ isCreateUrl });
  const active = _tabsState?.isTabActive(tabId);

  if (!active) {
    return null;
  }
  const isBOMTabActive = _tabsState?.activeTabId === TabTypeOptions.BOM.toLowerCase();

  return (
    <Observer>
      {() => (
        <SMBox
          id={`sm-tabpanel-${tabIndex ?? tabId}`}
          className={cx({ [classes.bomTabContent]: isBOMTabActive, [classes.content]: !isBOMTabActive }) }
          {...panelProps}
        >
          {children}
        </SMBox>
      )}
    </Observer>
  );
};

export default withSMTabPanelWrap(SMTabPanel);
