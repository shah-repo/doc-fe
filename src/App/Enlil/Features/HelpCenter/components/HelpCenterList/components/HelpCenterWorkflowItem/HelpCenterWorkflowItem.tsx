import { ListItemIcon, ListItemText, MenuList } from "@material-ui/core";
import React from "react";
import { ReactComponent as PDFIcon } from "../../../../../../../../assets/images/file-types/pdf-20.svg";
import { HelpCenterWorkflowItemData } from "../../../../HelpCenter.types";
import HelpCenterExternalLink from "../../../HelpCenterExternalLink/HelpCenterExternalLink";
import useStyles from "./HelpCenterWorkflowItem.style";

const HelpCenterWorkflowItem: React.FC<HelpCenterWorkflowItemData> = ({ title, url }) => {
  const classes = useStyles();

  return (
    <MenuList disablePadding>
      <HelpCenterExternalLink className={classes.link} to={url}>
        <ListItemIcon className={classes.icon}><PDFIcon /></ListItemIcon>
        <ListItemText className={classes.text} disableTypography>
          {title}
        </ListItemText>
      </HelpCenterExternalLink>
    </MenuList>
  );
};

export default HelpCenterWorkflowItem;
