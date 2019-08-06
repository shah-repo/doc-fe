import { Box } from "@material-ui/core";
import { InsertDriveFile } from "@material-ui/icons";
import React from "react";
import { styles } from "./utils/styles";
import { AttachmentIconProps } from "./utils/types";

export const AttachmentIcon: React.FunctionComponent<AttachmentIconProps> = ({
  extension,
  size,
}) => {

  const classes = styles({ size: size || "md" });

  return (
    <Box className={classes.root}>
      <InsertDriveFile className={classes.fileIcon} />
      <Box className={classes.ribbonWrapper}>
        <Box className={`${classes.ribbonFront} ${classes.ribbonFrontSize}`}>
          {extension && extension.toUpperCase()}
        </Box>
        <Box className={`${classes.ribbonEdgeTopleft} ${classes.ribbonEdgeTopleftBorder}`} />
        <Box className={`${classes.ribbonEdgeTopright} ${classes.ribbonEdgeToprightBorder}`} />
      </Box>
    </Box>
  );
};

export default AttachmentIcon;
