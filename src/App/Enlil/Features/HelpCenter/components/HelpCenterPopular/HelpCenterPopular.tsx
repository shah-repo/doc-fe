import { Box, ListItemIcon, ListItemText, MenuList, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as FAQsIcon } from "../../../../../../assets/images/faqs.svg";
import { ReactComponent as GuidesIcon } from "../../../../../../assets/images/help-guide.svg";
import { ReactComponent as ReleaseNotesIcon } from "../../../../../../assets/images/release-notes.svg";
import Text from "../../../../../../ui/components/Text";
import staticLinks from "../../data/static-links";
import HelpCenterExternalLink from "../HelpCenterExternalLink/HelpCenterExternalLink";
import useStyles from "./HelpCenterPopular.styles";

const HelpCenterPopular: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h4"><Text translation="help.popular.resources" /></Typography>
      <MenuList className={classes.list} dense disablePadding>
        <HelpCenterExternalLink className={classes.link} to={staticLinks.ReleaseNotes}>
          <ListItemIcon><ReleaseNotesIcon /></ListItemIcon>
          <ListItemText><Text translation="help.release.notes" /></ListItemText>
        </HelpCenterExternalLink>
        <HelpCenterExternalLink className={classes.link} to={staticLinks.FAQs}>
          <ListItemIcon><FAQsIcon /></ListItemIcon>
          <ListItemText><Text translation="help.faqs" /></ListItemText>
        </HelpCenterExternalLink>
        <HelpCenterExternalLink className={classes.link} to={staticLinks.Guides}>
          <ListItemIcon><GuidesIcon /></ListItemIcon>
          <ListItemText><Text translation="help.view.all.guides" /></ListItemText>
        </HelpCenterExternalLink>
      </MenuList>
    </Box>
  );
};

export default HelpCenterPopular;
