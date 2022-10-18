import { ListItemIcon, ListItemText, MenuList } from "@material-ui/core";
import React from "react";
import { ReactComponent as PlayIcon } from "../../../../../../../../assets/images/play.svg";
import { HelpCenterHowToItemData } from "../../../../HelpCenter.types";
import HelpCenterExternalLink from "../../../HelpCenterExternalLink/HelpCenterExternalLink";
import useStyles from "./HelpCenterHowToItem.style";

const HelpCenterHowToItem: React.FC<HelpCenterHowToItemData> = ({ title, url }) => {
  const classes = useStyles();

  return (
    <MenuList disablePadding>
      <HelpCenterExternalLink className={classes.link} to={url}>
        <ListItemIcon className={classes.icon}><PlayIcon /></ListItemIcon>
        <ListItemText className={classes.text} disableTypography>
          {title}
        </ListItemText>
      </HelpCenterExternalLink>
    </MenuList>
  );
};

export default HelpCenterHowToItem;
