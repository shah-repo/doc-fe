import { Box } from "@material-ui/core";
import React from "react";
import { SMBoxProps } from "../../..";

const SMBox: React.FunctionComponent<SMBoxProps> = ({
  stretchX,
  stretchY,
  ...props
}) => (
  <Box
    {...props}
    {...stretchX && { minWidth: stretchX, maxWidth: stretchX, width: stretchX }}
    {...stretchY && { minHeight: stretchY, maxHeight: stretchY, height: stretchY }}
  />
);

export default SMBox;
