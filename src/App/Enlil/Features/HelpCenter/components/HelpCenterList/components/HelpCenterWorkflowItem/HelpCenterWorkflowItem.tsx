import { ListItemIcon, ListItemText, MenuList } from "@material-ui/core";
import React from "react";
import { ReactComponent as PageIcon } from "../../../../../../../../assets/images/page.svg";
import { HelpCenterWorkflowItemData } from "../../../../HelpCenter.types";
import HelpCenterExternalLink from "../../../HelpCenterExternalLink/HelpCenterExternalLink";
import useStyles from "./HelpCenterWorkflowItem.style";

const HelpCenterWorkflowItem: React.FC<HelpCenterWorkflowItemData> = ({ title, url }) => {
  const classes = useStyles();

  return (
    <MenuList disablePadding>
      <HelpCenterExternalLink className={classes.link} to={url}>
        <ListItemIcon className={classes.icon}><PageIcon /></ListItemIcon>
        <ListItemText className={classes.text} disableTypography>
          {title}
        </ListItemText>
      </HelpCenterExternalLink>
    </MenuList>
  );
};

export default HelpCenterWorkflowItem;
