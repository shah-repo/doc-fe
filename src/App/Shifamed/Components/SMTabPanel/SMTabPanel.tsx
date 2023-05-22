import { Observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { AutoSizer, AutoSizerProps } from 'react-virtualized';
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

  const handleResize: AutoSizerProps['onResize'] = useCallback(
    (size) => {
      _tabsState?.setContentSize(size);
    },
    [_tabsState],
  );

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
          <AutoSizer onResize={handleResize}>
            {({ width, height }) => (
              <SMBox width={width} height={height}>
                {children}
              </SMBox>
            )}
          </AutoSizer>
        </SMBox>
      )}
    </Observer>
  );
};

export default withSMTabPanelWrap(SMTabPanel);
