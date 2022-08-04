import { Box, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import { ReactComponent as LinkOutIcon } from "../../../../assets/images/link-out.svg";
import { ReactComponent as SendIcon } from "../../../../assets/images/send.svg";
import Text from "../../../../ui/components/Text";
import useStyles from "./HelpCenterContact.styles";
import openNewTab from "./utils/openNewTab";

const HelpCenterContact: React.FC = () => {
  const classes = useStyles();

  return (
    <Box>
      <List disablePadding classes={{ root: classes.list }}>
        <ListItem button onClick={openNewTab("//enlil.happyfox.com/new/")}>
          <ListItemIcon><SendIcon /></ListItemIcon>
          <ListItemText>
            <Box>
              <Text translation="help.dint.find.what.you.need" />
            </Box>
            <Box>
              <Text translation="help.contact" />
              <LinkOutIcon />
            </Box>
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
};

export default HelpCenterContact;
