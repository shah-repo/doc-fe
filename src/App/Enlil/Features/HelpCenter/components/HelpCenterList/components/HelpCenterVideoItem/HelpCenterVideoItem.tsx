import { Box, ListItemIcon, ListItemText, MenuList } from "@material-ui/core";
import React from "react";
import { ReactComponent as PlayIcon } from "../../../../../../../../assets/images/play.svg";
import Text from "../../../../../../../../ui/components/Text";
import { HelpCenterVideoItemData } from "../../../../HelpCenter.types";
import HelpCenterExternalLink from "../../../HelpCenterExternalLink/HelpCenterExternalLink";
import HelpCenterOutLink from "../../../HelpCenterOutLink/HelpCenterOutLink";

const HelpCenterVideoItem: React.FC<HelpCenterVideoItemData> = ({ title, url, videoId }) => (
  <>
    <MenuList>
      <HelpCenterExternalLink href={url}>
        <ListItemIcon><PlayIcon /></ListItemIcon>
        <ListItemText>
          {title}
          <HelpCenterOutLink>
            <Text translation="help.view.full.guide" />
          </HelpCenterOutLink>
        </ListItemText>
      </HelpCenterExternalLink>
    </MenuList>
    <Box display="flex" justifyContent="center">
      <iframe
        src={`//www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="encrypted-media"
        allowFullScreen
        title="video"
      />
    </Box>
  </>
);

export default HelpCenterVideoItem;
