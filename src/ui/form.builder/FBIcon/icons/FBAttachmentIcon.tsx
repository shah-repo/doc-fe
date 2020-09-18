import { Box } from "@material-ui/core";
import { upperCase } from "lodash";
import React from "react";
import { FBIcon, FBIconProps } from "..";

const FBAttachmentIcon: React.FunctionComponent<Omit<FBIconProps, "icon">> = ({
  text,
  ...props
}) => (
  <FBIcon {...props} icon="Attachment">
    <Box
      fontFamily="Monospace"
      fontSize="button.fontSize"
      fontWeight="bold"
      textAlign="center"
      color="white"
      mt={-3.6}
    >
      {upperCase(text)}
    </Box>
  </FBIcon>
);

export default FBAttachmentIcon;
