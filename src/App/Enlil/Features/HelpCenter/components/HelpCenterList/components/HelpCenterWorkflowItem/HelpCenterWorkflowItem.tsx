import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../../ui/components/Text";

const HelpCenterWorkflowItem: React.FC<{ title: string }> = ({ title }) => (
  <Box>
    <Box>
      <Box>
        {title}
      </Box>
      <Box>
        <Text translation="help.view.full.guide" />
      </Box>
    </Box>
  </Box>
);

export default HelpCenterWorkflowItem;
