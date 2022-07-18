import { Observer } from "mobx-react";
import React from "react";
import { SMBox, SMTabPanelProps } from "../../..";
import { withSMTabPanelWrap } from "./SMTabPanel.wrap";
import styles from "./styles";

const SMTabPanel: React.FunctionComponent<SMTabPanelProps> = ({
  _tabsState,
  index,
  children,
}) => {
  const classes = styles();

  return (
    <Observer>
      {() => (
        <SMBox
          hidden={_tabsState?.value !== index}
          id={`sm-tabpanel-${index}`}
          className={classes.content}
          stretchY="100%"
        >
          {children}
        </SMBox>
      )}
    </Observer>
  );
};

export default withSMTabPanelWrap(SMTabPanel);
