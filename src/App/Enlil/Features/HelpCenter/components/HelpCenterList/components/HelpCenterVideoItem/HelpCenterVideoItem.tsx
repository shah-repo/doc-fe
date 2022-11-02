import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { HelpCenterVideoItemData } from "../../../../HelpCenter.types";
import useStyles from "./HelpCenterVideoItem.style";

const getYoutubeId = (url: string) => {
  const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = regExp.exec(url);
  return (match && match[1].length === 11) ? match[1] : false;
};

const HelpCenterVideoItem: React.FC<HelpCenterVideoItemData> = ({ url }) => {
  const classes = useStyles();

  const videoId = getYoutubeId(url);

  return (
    <Box className={classes.video} data-cy="help-center.video-item">
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
        data-cy="help-center.video-item-embed"
      />
    </Box>
  );
};

export default HelpCenterVideoItem;
