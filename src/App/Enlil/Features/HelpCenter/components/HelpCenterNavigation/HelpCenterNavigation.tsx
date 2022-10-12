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
  external: boolean;
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const GuidesLink: React.FC<GuidesItemProps> = React.forwardRef(
  ({ external, href, onClick, children, className }, ref) => (
    external ? (
      <HelpCenterExternalLink href={href} className={className}>
        {children}
      </HelpCenterExternalLink>
    ) : (
      <MenuItem onClick={onClick} innerRef={ref} className={className}>
        {children}
      </MenuItem>
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
      data-cy="help-center.navigation"
    >
      <GuidesLink external={!hasGuide} href={staticLinks.Guides} onClick={handleOpenContent}>
        <ListItemIcon><HelpIcon /></ListItemIcon>
        <ListItemText data-cy="help-center.content-opener"><Text translation="help.guides" /></ListItemText>
      </GuidesLink>
      <HelpCenterExternalLink href={staticLinks.ReleaseNotes}>
        <ListItemIcon><ReleaseNotesIcon /></ListItemIcon>
        <ListItemText data-cy="help-center.external-link"><Text translation="help.release.notes" /></ListItemText>
      </HelpCenterExternalLink>
      <HelpCenterExternalLink href={staticLinks.FAQs}>
        <ListItemIcon><FAQsIcon /></ListItemIcon>
        <ListItemText data-cy="help-center.external-link"><Text translation="help.faqs" /></ListItemText>
      </HelpCenterExternalLink>
      <Divider variant="middle" component="li" />
      <HelpCenterExternalLink href={staticLinks.Contact}>
        <ListItemIcon><SendIcon /></ListItemIcon>
        <ListItemText data-cy="help-center.external-link"><Text translation="help.contact" /></ListItemText>
      </HelpCenterExternalLink>
    </Menu>
  );
};

export default HelpCenterNavigation;
