import { Observer } from "mobx-react";
import React from "react";
import { SMBox, SMTabPanelProps } from "../../..";
import useStyles from "./SMTabPanel.styles";
import { withSMTabPanelWrap } from "./SMTabPanel.wrap";

const SMTabPanel: React.FunctionComponent<SMTabPanelProps> = ({
  _tabsState,
  tabId,
  children,
  panelProps,
}) => {
  const classes = useStyles();

  return (
    <Observer>
      {() => (
        <SMBox
          hidden={_tabsState?.activeTabId !== tabId}
          id={`sm-tabpanel-${tabId}`}
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
