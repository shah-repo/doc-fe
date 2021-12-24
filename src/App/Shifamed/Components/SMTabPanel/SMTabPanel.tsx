import { Box, Typography } from "@material-ui/core";
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
      <div
        role="tabpanel"
        hidden={_tabsState?.value !== index}
        id={`sm-tabpanel-${index}`}
      >
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      </div>
    )}
  </Observer>
);

export default withSMTabPanelWrap(SMTabPanel);
