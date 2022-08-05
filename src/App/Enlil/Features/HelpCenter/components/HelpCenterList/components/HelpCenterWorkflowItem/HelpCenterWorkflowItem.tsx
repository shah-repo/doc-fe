import { ListItemIcon, ListItemText, MenuList } from "@material-ui/core";
import React from "react";
import { ReactComponent as PDFIcon } from "../../../../../../../../assets/images/file-types/pdf-16.svg";
import Text from "../../../../../../../../ui/components/Text";
import { HelpCenterWorkflowItemData } from "../../../../HelpCenter.types";
import HelpCenterExternalLink from "../../../HelpCenterExternalLink/HelpCenterExternalLink";
import HelpCenterOutLink from "../../../HelpCenterOutLink/HelpCenterOutLink";

const HelpCenterWorkflowItem: React.FC<HelpCenterWorkflowItemData> = ({ title, url }) => (
  <MenuList>
    <HelpCenterExternalLink href={url}>
      <ListItemIcon><PDFIcon /></ListItemIcon>
      <ListItemText>
        {title}
        <HelpCenterOutLink>
          <Text translation="help.view.full.guide" />
        </HelpCenterOutLink>
      </ListItemText>
    </HelpCenterExternalLink>
  </MenuList>
);

export default HelpCenterWorkflowItem;
