import { MenuItem } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import transformUrlWithEnv from "../../utils/transformUrlWithEnv";

interface Props {
  href: string;
  children: React.ReactNode;
}

const HelpCenterExternalLink: React.FC<Props> = ({ href, children }) => (
  <MenuItem
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    component={Link}
    to={transformUrlWithEnv(href)}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </MenuItem>
);

export default HelpCenterExternalLink;
