import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../../../../../../ui/components/Text";
import { HelpCenterWorkflowItemData } from "../../../../HelpCenter.types";

const HelpCenterWorkflowItem: React.FC<HelpCenterWorkflowItemData> = ({ title }) => (
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
