import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { ReactComponent as FAQsIcon } from "../../../../../../assets/images/faqs.svg";
import { ReactComponent as HelpIcon } from "../../../../../../assets/images/help.svg";
import { ReactComponent as ReleaseNotesIcon } from "../../../../../../assets/images/release-notes.svg";
import { ReactComponent as SendIcon } from "../../../../../../assets/images/send.svg";
import Text from "../../../../../../ui/components/Text";
import staticLinks from "../../data/static-links";
import HelpCenterExternalLink from "../HelpCenterExternalLink/HelpCenterExternalLink";

interface Props {
  anchorEl: HTMLElement | null;
  haveGuide: boolean;
  handleCloseMenu: () => void;
  handleOpenContent: () => void;
}

interface GuidesItemProps {
  external: boolean;
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

const GuidesLink: React.FC<GuidesItemProps> = ({ external, href, onClick, children }) => (
  external ? (
    <HelpCenterExternalLink href={href}>
      {children}
    </HelpCenterExternalLink>
  ) : (
    <MenuItem onClick={onClick}>
      {children}
    </MenuItem>
  )
);

const HelpCenterNavigation: React.FC<Props> = ({ anchorEl, haveGuide, handleCloseMenu, handleOpenContent }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleCloseMenu}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
  >
    <GuidesLink external={!haveGuide} href={staticLinks.Guides} onClick={handleOpenContent}>
      <ListItemIcon><HelpIcon /></ListItemIcon>
      <ListItemText><Text translation="help.guides" /></ListItemText>
    </GuidesLink>
    <HelpCenterExternalLink href={staticLinks.ReleaseNotes}>
      <ListItemIcon><ReleaseNotesIcon /></ListItemIcon>
      <ListItemText><Text translation="help.release.notes" /></ListItemText>
    </HelpCenterExternalLink>
    <HelpCenterExternalLink href={staticLinks.FAQs}>
      <ListItemIcon><FAQsIcon /></ListItemIcon>
      <ListItemText><Text translation="help.faqs" /></ListItemText>
    </HelpCenterExternalLink>
    <Divider />
    <HelpCenterExternalLink href={staticLinks.Contact}>
      <ListItemIcon><SendIcon /></ListItemIcon>
      <ListItemText><Text translation="help.contact" /></ListItemText>
    </HelpCenterExternalLink>
  </Menu>
);

export default HelpCenterNavigation;
