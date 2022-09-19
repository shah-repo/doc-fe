import { MenuItem } from "@material-ui/core";
import cx from "classnames";
import { template } from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import useStyles from "./HelpCenterExternalLink.styles";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const getCurrentEnvName = (whitelist = ["dev", "demo", "prod", "prod2"], position = 2) => {
  const hostParts = window?.location?.host.split(".").reverse();
  const env = hostParts[position];
  return whitelist.includes(env) ? env : "";
};

const transformUrlWithEnv = (url: string) => {
  const envName = getCurrentEnvName();
  const env = envName ? `${envName}.` : "";
  return template(url, { interpolate: /\{(.+?)\}/g })({ env });
};

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
