import { Box, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import React from "react";
import Text from "../../../../ui/components/Text";

const HelpCenterPopular: React.FC = () => (
  <Box>
    <Text translation="help.popular.resources" />
    <List>
      <ListItem>
        <ListItemIcon><AssignmentTurnedInIcon fontSize="small" /></ListItemIcon>
        <ListItemText><Text translation="help.release.notes" /></ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><AssignmentTurnedInIcon fontSize="small" /></ListItemIcon>
        <ListItemText><Text translation="help.faqs" /></ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><AssignmentTurnedInIcon fontSize="small" /></ListItemIcon>
        <ListItemText><Text translation="help.view.all.guides" /></ListItemText>
      </ListItem>
    </List>
  </Box>
);

export default HelpCenterPopular;
