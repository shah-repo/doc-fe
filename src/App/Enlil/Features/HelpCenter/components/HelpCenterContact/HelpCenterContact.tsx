import { Box, ListItemIcon, ListItemText, MenuList } from "@material-ui/core";
import React from "react";
import { ReactComponent as LinkOutIcon } from "../../../../../../assets/images/link-out.svg";
import { ReactComponent as SendIcon } from "../../../../../../assets/images/send.svg";
import Text from "../../../../../../ui/components/Text";
import HelpCenterExternalLink from "../HelpCenterExternalLink/HelpCenterExternalLink";
import useStyles from "./HelpCenterContact.styles";

const HelpCenterContact: React.FC = () => {
  const classes = useStyles();

  return (
    <Box>
      <MenuList disablePadding classes={{ root: classes.list }}>
        <HelpCenterExternalLink href="//enlil.happyfox.com/new/">
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
        </HelpCenterExternalLink>
      </MenuList>
    </Box>
  );
};

export default HelpCenterContact;
