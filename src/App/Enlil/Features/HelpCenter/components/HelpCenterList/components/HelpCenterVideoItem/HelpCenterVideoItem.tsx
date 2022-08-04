import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../../../../../../ui/components/Text";
import { HelpCenterVideoItemData } from "../../../../HelpCenter.types";

const HelpCenterVideoItem: React.FC<HelpCenterVideoItemData> = ({ title }) => (
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
