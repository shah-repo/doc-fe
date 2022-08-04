import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as FAQsIcon } from "../../../../assets/images/faqs.svg";
import { ReactComponent as GuidesIcon } from "../../../../assets/images/help-guide.svg";
import { ReactComponent as ReleaseNotesIcon } from "../../../../assets/images/release-notes.svg";
import Text from "../../../../ui/components/Text";
import useStyles from "./HelpCenterPopular.styles";

const HelpCenterPopular: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h6"><Text translation="help.popular.resources" /></Typography>
      <List dense disablePadding classes={{ root: classes.list }}>
        <ListItem button>
          <ListItemIcon><ReleaseNotesIcon /></ListItemIcon>
          <ListItemText><Text translation="help.release.notes" /></ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemIcon><FAQsIcon /></ListItemIcon>
          <ListItemText><Text translation="help.faqs" /></ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemIcon><GuidesIcon /></ListItemIcon>
          <ListItemText><Text translation="help.view.all.guides" /></ListItemText>
        </ListItem>
      </List>
    </Box>
  );
};

export default HelpCenterPopular;
