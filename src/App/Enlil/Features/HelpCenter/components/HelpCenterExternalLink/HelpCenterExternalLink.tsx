import { MenuItem } from "@material-ui/core";
import cx from "classnames";
import { template } from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import useStyles from "./HelpCenterExternalLink.styles";

const getCurrentEnvName = (whitelist = ["dev", "demo", "prod", "prod2"], position = 2) => {
  const hostParts = window?.location?.host.split(".").reverse();
  const env = hostParts[position];
  return whitelist.includes(env) ? env : "";
};

export const envUrl = (url: string) => {
  const envName = getCurrentEnvName();
  const env = envName ? `${envName}.` : "";
  return template(url, { interpolate: /\{(.+?)\}/g })({ env });
};

interface Props {
  to: string;
  children: React.ReactNode;
  component?: React.ElementType;
  className?: string;
}

const HelpCenterExternalLink: React.FC<Props> = ({ to, component, children, className }) => {
  const classes = useStyles();

  const LinkItem = component ?? MenuItem;

  return (
    <LinkItem
      component={!component ? Link : undefined}
      to={envUrl(to)}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(classes.root, className)}
    >
      {children}
    </LinkItem>
  );
};

export default HelpCenterExternalLink;
