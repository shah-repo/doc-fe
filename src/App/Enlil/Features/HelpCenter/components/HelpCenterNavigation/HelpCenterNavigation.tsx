import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { ReactComponent as FAQsIcon } from "../../../../../../assets/images/faqs.svg";
import { ReactComponent as HelpIcon } from "../../../../../../assets/images/help.svg";
import { ReactComponent as ReleaseNotesIcon } from "../../../../../../assets/images/release-notes.svg";
import { ReactComponent as SendIcon } from "../../../../../../assets/images/send.svg";
import Text from "../../../../../../ui/components/Text";
import staticLinks from "../../data/static-links";
import HelpCenterExternalLink from "../HelpCenterExternalLink/HelpCenterExternalLink";
import useStyles from "./HelpCenterNavigation.styles";

interface Props {
  anchorEl: HTMLElement | null;
  hasGuide: boolean;
  handleCloseMenu: () => void;
  handleOpenContent: () => void;
}

interface GuidesItemProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GuidesLink: React.FC<GuidesItemProps> = React.forwardRef(
  ({ to, children, className, onClick }, ref) => (
    onClick ? (
      <MenuItem onClick={onClick} innerRef={ref} className={className}>
        {children}
      </MenuItem>
    ) : (
      <HelpCenterExternalLink to={to} className={className}>
        {children}
      </HelpCenterExternalLink>
    )
  )
);
GuidesLink.displayName = "GuidesLink";

const HelpCenterNavigation: React.FC<Props> = ({ anchorEl, hasGuide, handleCloseMenu, handleOpenContent }) => {
  const classes = useStyles();

  return (
    <Menu
      classes={{
        paper: classes.paper,
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <GuidesLink to={staticLinks.Guides} onClick={hasGuide ? handleOpenContent : undefined}>
        <ListItemIcon><HelpIcon /></ListItemIcon>
        <ListItemText><Text translation="help.guides" /></ListItemText>
      </GuidesLink>
      <HelpCenterExternalLink to={staticLinks.ReleaseNotes}>
        <ListItemIcon><ReleaseNotesIcon /></ListItemIcon>
        <ListItemText><Text translation="help.release.notes" /></ListItemText>
      </HelpCenterExternalLink>
      <HelpCenterExternalLink to={staticLinks.FAQs}>
        <ListItemIcon><FAQsIcon /></ListItemIcon>
        <ListItemText><Text translation="help.faqs" /></ListItemText>
      </HelpCenterExternalLink>
      <Divider variant="middle" component="li" />
      <HelpCenterExternalLink to={staticLinks.Contact}>
        <ListItemIcon><SendIcon /></ListItemIcon>
        <ListItemText><Text translation="help.contact" /></ListItemText>
      </HelpCenterExternalLink>
    </Menu>
  );
};

export default HelpCenterNavigation;
