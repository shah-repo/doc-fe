import { Box, ListItemIcon, ListItemText, MenuList, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as FAQsIcon } from "../../../../../../assets/images/faqs.svg";
import { ReactComponent as GuidesIcon } from "../../../../../../assets/images/help-guide.svg";
import { ReactComponent as ReleaseNotesIcon } from "../../../../../../assets/images/release-notes.svg";
import Text from "../../../../../../ui/components/Text";
import StaticHelpLinks from "../../data/static-links";
import HelpCenterExtarnalLink from "../HelpCenterExternalLink/HelpCenterExternalLink";
import useStyles from "./HelpCenterPopular.styles";

const HelpCenterPopular: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h6"><Text translation="help.popular.resources" /></Typography>
      <MenuList dense disablePadding classes={{ root: classes.list }}>
        <HelpCenterExtarnalLink href={StaticHelpLinks.ReleaseNotes}>
          <ListItemIcon><ReleaseNotesIcon /></ListItemIcon>
          <ListItemText><Text translation="help.release.notes" /></ListItemText>
        </HelpCenterExtarnalLink>
        <HelpCenterExtarnalLink href={StaticHelpLinks.FAQs}>
          <ListItemIcon><FAQsIcon /></ListItemIcon>
          <ListItemText><Text translation="help.faqs" /></ListItemText>
        </HelpCenterExtarnalLink>
        <HelpCenterExtarnalLink href={StaticHelpLinks.Guides}>
          <ListItemIcon><GuidesIcon /></ListItemIcon>
          <ListItemText><Text translation="help.view.all.guides" /></ListItemText>
        </HelpCenterExtarnalLink>
      </MenuList>
    </Box>
  );
};

export default HelpCenterPopular;
