import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { SMTabPanelProps } from "../../..";
import { withSMTabPanelWrap } from "./SMTabPanel.wrap";

const SMTabPanel: React.FunctionComponent<SMTabPanelProps> = ({
  _tabsState,
  index,
  children,
}) =>  (
  <Observer>
    {() => (
      <Box
        p={3}
        hidden={_tabsState?.value !== index}
        id={`sm-tabpanel-${index}`}
      >
        {children}
      </Box>
    )}
  </Observer>
);

export default withSMTabPanelWrap(SMTabPanel);
