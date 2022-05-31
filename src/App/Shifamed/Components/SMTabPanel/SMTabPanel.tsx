import { Observer } from "mobx-react";
import React from "react";
import { SMBox, SMTabPanelProps } from "../../..";
import { withSMTabPanelWrap } from "./SMTabPanel.wrap";

const SMTabPanel: React.FunctionComponent<SMTabPanelProps> = ({
  _tabsState,
  index,
  children,
}) => (
  <Observer>
    {() => (
      <SMBox
        hidden={_tabsState?.value !== index}
        id={`sm-tabpanel-${index}`}
        stretchY="100%"
      >
        {children}
      </SMBox>
    )}
  </Observer>
);

export default withSMTabPanelWrap(SMTabPanel);
