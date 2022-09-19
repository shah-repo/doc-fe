import { MenuItem } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import transformUrlWithEnv from "../../utils/transformUrlWithEnv";
import useStyles from "./HelpCenterExternalLink.styles";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const HelpCenterExternalLink: React.FC<Props> = ({ href, children, className }) => {
  const classes = useStyles();

  return (
    <MenuItem
      component={Link}
      to={transformUrlWithEnv(href)}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(classes.root, className)}
    >
      {children}
    </MenuItem>
  );
};

export default HelpCenterExternalLink;
