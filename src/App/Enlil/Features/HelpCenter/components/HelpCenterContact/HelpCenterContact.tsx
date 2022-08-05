import { Box, ListItemIcon, ListItemText, MenuList } from "@material-ui/core";
import React from "react";
import { ReactComponent as SendIcon } from "../../../../../../assets/images/send.svg";
import Text from "../../../../../../ui/components/Text";
import StaticHelpLinks from "../../data/static-links";
import HelpCenterExternalLink from "../HelpCenterExternalLink/HelpCenterExternalLink";
import HelpCenterOutLink from "../HelpCenterOutLink/HelpCenterOutLink";
import useStyles from "./HelpCenterContact.styles";

const HelpCenterContact: React.FC = () => {
  const classes = useStyles();

  return (
    <Box>
      <MenuList disablePadding classes={{ root: classes.list }}>
        <HelpCenterExternalLink href={StaticHelpLinks.Contact}>
          <ListItemIcon><SendIcon /></ListItemIcon>
          <ListItemText>
            <Text translation="help.dint.find.what.you.need" />
            <HelpCenterOutLink>
              <Text translation="help.contact" />
            </HelpCenterOutLink>
          </ListItemText>
        </HelpCenterExternalLink>
      </MenuList>
    </Box>
  );
};

export default HelpCenterContact;
