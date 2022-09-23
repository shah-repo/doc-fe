import { Box, CircularProgress, ListItemIcon, ListItemText, MenuList } from "@material-ui/core";
import React from "react";
import { ReactComponent as PlayIcon } from "../../../../../../../../assets/images/play.svg";
import Text from "../../../../../../../../ui/components/Text";
import { HelpCenterVideoItemData } from "../../../../HelpCenter.types";
import HelpCenterExternalLink from "../../../HelpCenterExternalLink/HelpCenterExternalLink";
import HelpCenterOutLink from "../../../HelpCenterOutLink/HelpCenterOutLink";
import useStyles from "./HelpCenterVideoItem.style";

const HelpCenterVideoItem: React.FC<HelpCenterVideoItemData> = ({ title, url, videoId }) => {
  const classes = useStyles();

  return (
    <>
      <MenuList disablePadding>
        <HelpCenterExternalLink className={classes.link} href={url}>
          <ListItemIcon className={classes.icon}><PlayIcon /></ListItemIcon>
          <ListItemText className={classes.text} disableTypography>
            {title}
            <HelpCenterOutLink>
              <Text translation="help.view.full.guide" />
            </HelpCenterOutLink>
          </ListItemText>
        </HelpCenterExternalLink>
      </MenuList>
      <Box className={classes.video}>
        <Box className={classes.progress}>
          <CircularProgress size={20} />
        </Box>
        <iframe
          className={classes.player}
          src={`//www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          width="280"
          allow="encrypted-media"
          allowFullScreen
          title="video"
        />
      </Box>
    </>
  );
};

export default HelpCenterVideoItem;
