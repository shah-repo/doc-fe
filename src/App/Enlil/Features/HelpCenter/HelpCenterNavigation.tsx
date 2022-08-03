import { Divider, Link, ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import React from "react";
import Text from "../../../../ui/components/Text";

interface Props {
  anchorEl: HTMLElement | null;
  handleCloseMenu: () => void;
  handleOpenContent: () => void;
}

const HelpCenterNavigation: React.FC<Props> = ({ anchorEl, handleCloseMenu, handleOpenContent }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleCloseMenu}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
  >
    <MenuItem onClick={handleOpenContent}>
      <ListItemIcon><HelpOutlineIcon fontSize="small" /></ListItemIcon>
      <ListItemText><Text translation="help.guides" /></ListItemText>
    </MenuItem>
    <MenuItem>
      <Link href="//help.dev.enlil.io/release_notes.html" target="_blank" rel="noopener noreferrer">
        <ListItemIcon><AssignmentTurnedInIcon fontSize="small" /></ListItemIcon>
        <ListItemText><Text translation="help.release.notes" /></ListItemText>
      </Link>
    </MenuItem>
    <MenuItem>
      <Link href="//help.dev.enlil.io/faqs.html" target="_blank" rel="noopener noreferrer">
        <ListItemIcon><AssignmentTurnedInIcon fontSize="small" /></ListItemIcon>
        <ListItemText><Text translation="help.faqs" /></ListItemText>
      </Link>
    </MenuItem>
    <Divider />
    <MenuItem>
      <Link href="//enlil.happyfox.com/new/" target="_blank" rel="noopener noreferrer">
        <ListItemIcon><LiveHelpIcon fontSize="small" /></ListItemIcon>
        <ListItemText><Text translation="help.contact" /></ListItemText>
      </Link>
    </MenuItem>
  </Menu>
);

export default HelpCenterNavigation;
