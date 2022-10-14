import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { HelpCenterVideoItemData } from "../../../../HelpCenter.types";
import useStyles from "./HelpCenterVideoItem.style";

const HelpCenterVideoItem: React.FC<HelpCenterVideoItemData> = ({ videoId }) => {
  const classes = useStyles();

  return (
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
  );
};

export default HelpCenterVideoItem;
