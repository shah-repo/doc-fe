import { Box } from "@material-ui/core";
import React from "react";
import { ReactComponent as LinkOutIcon } from "../../../../../../assets/images/link-out.svg";
import useStyles from "./HelpCenterOutLink.styles";

interface Props {
  children: React.ReactNode;
}

const HelpCenterOutLink: React.FC<Props> = ({ children }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {children}
      <LinkOutIcon className={classes.icon} />
    </Box>
  );
};

export default HelpCenterOutLink;
