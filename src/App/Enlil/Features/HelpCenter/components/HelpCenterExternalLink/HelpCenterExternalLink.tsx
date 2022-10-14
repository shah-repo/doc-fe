import { MenuItem } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { envUrl } from "../../utils/envUrl";
import useStyles from "./HelpCenterExternalLink.styles";

interface Props {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const HelpCenterExternalLink: React.FC<Props> = ({ to, children, className }) => {
  const classes = useStyles();

  return (
    <MenuItem
      component={Link}
      to={envUrl(to)}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(classes.root, className)}
    >
      {children}
    </MenuItem>
  );
};

export default HelpCenterExternalLink;
