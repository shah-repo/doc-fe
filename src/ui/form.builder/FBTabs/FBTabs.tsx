import { Box, Tabs } from "@material-ui/core";
import React from "react";
import { FBTabsProps } from ".";
import { withFBTabs } from "./FBTabs.wrap";

const FBTabs: React.FunctionComponent<FBTabsProps> = ({
  value = 0,
  onChange,
  tabs,
  content,
}) => (
  <Box>
    <Box
      flexGrow={1}
      border={1}
      bgcolor="#f1f1f1"
      borderColor="#c1c1c1"
      mb={5}
    >
      <Tabs
        {...{ value, onChange }}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {tabs}
      </Tabs>
    </Box>
    {content}
  </Box>
);

export default withFBTabs(FBTabs);
