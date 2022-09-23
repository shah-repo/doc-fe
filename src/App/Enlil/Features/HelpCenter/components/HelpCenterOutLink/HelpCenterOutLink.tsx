import { Box } from "@material-ui/core";
import React from "react";
import { ReactComponent as LinkOutIcon } from "../../../../../../assets/images/link-out.svg";
import useStyles from "./HelpCenterOutLink.styles";

const HelpCenterOutLink: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {children}
      <LinkOutIcon className={classes.icon} />
    </Box>
  );
};

export default HelpCenterOutLink;
