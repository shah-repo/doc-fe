import { Observer } from "mobx-react";
import React from "react";
import { SMBox, SMTabPanelProps } from "../../..";
import { withSMTabPanelWrap } from "./SMTabPanel.wrap";
import styles from "./styles";

const SMTabPanel: React.FunctionComponent<SMTabPanelProps> = ({
  _tabsState,
  index,
  children,
  panelProps,
}) => {
  const classes = styles();

  return (
    <Observer>
      {() => (
        <SMBox style={{ height: "340px" }}
          hidden={_tabsState?.value !== index}
          id={`sm-tabpanel-${index}`}
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
