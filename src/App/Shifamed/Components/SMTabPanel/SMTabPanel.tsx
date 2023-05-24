import { debounce } from 'lodash';
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
  isPreview,
  panelProps,
}) => {
  const classes = useStyles();
  const active = _tabsState?.isTabActive(tabId);

  const handleResize: AutoSizerProps['onResize'] = useCallback(
    debounce(
      (size) => {
        _tabsState?.setContentSize(size);
      },
      300,
    ),
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
          <AutoSizer disableHeight={isPreview} onResize={handleResize}>
            {(size) => (
              <SMBox {...size}>
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
