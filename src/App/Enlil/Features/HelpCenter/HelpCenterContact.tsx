import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../../../ui/components/Text";

const HelpCenterContact: React.FC = () => (
  <Box>
    <Box>
      <Text translation="help.dint.find.what.you.need" />
    </Box>
    <Box>
      <Button color="primary">
        <Text translation="help.contact" />
      </Button>
    </Box>
  </Box>
);

export default HelpCenterContact;
