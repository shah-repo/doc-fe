import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../../ui/components/Text";

const HelpCenterVideoItem: React.FC<{ title: string }> = ({ title }) => (
  <Box>
    <Box>
      {title}
    </Box>
    <Box>
      <Text translation="help.view.full.guide" />
    </Box>
  </Box>
);

export default HelpCenterVideoItem;
