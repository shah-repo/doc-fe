import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { ReactComponent as FAQsIcon } from "../../../../../../assets/images/faqs.svg";
import { ReactComponent as HelpIcon } from "../../../../../../assets/images/help.svg";
import { ReactComponent as ReleaseNotesIcon } from "../../../../../../assets/images/release-notes.svg";
import { ReactComponent as SendIcon } from "../../../../../../assets/images/send.svg";
import Text from "../../../../../../ui/components/Text";
import openNewTab from "../../utils/openNewTab";

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
      <ListItemIcon><HelpIcon /></ListItemIcon>
      <ListItemText><Text translation="help.guides" /></ListItemText>
    </MenuItem>
    <MenuItem onClick={openNewTab("//help.dev.enlil.io/release_notes.html")}>
      <ListItemIcon><ReleaseNotesIcon /></ListItemIcon>
      <ListItemText><Text translation="help.release.notes" /></ListItemText>
    </MenuItem>
    <MenuItem onClick={openNewTab("//help.dev.enlil.io/faqs.html")}>
      <ListItemIcon><FAQsIcon /></ListItemIcon>
      <ListItemText><Text translation="help.faqs" /></ListItemText>
    </MenuItem>
    <Divider />
    <MenuItem onClick={openNewTab("//enlil.happyfox.com/new/")}>
      <ListItemIcon><SendIcon /></ListItemIcon>
      <ListItemText><Text translation="help.contact" /></ListItemText>
    </MenuItem>
  </Menu>
);

export default HelpCenterNavigation;
