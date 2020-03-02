import { Box, IconButton } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import React from "react";
import { FBMediaCarouselProps } from ".";
import { withFBMediaCarousel } from "./FBMediaCarousel.wrap";

const FBMediaCarousel: React.FunctionComponent<FBMediaCarouselProps> = ({
  activeMediaPath,
  handleNext,
  handleBack
}) => (
  <Box position="relative" width="100%" display="flex" alignItems="center">
    <img
      style={{ objectFit: "cover", width: "100%", maxHeight: "350px" }}
      src={activeMediaPath}
    />
    <Box position="absolute" alignContent="middle" left={10}>
      <IconButton
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={handleBack}
        size="small"
      >
        <KeyboardArrowLeftIcon
          opacity={0.9}
          style={{ color: "white", fontSize: 45 }}
        />
      </IconButton>
    </Box>
    <Box position="absolute" alignContent="middle" right={10}>
      <IconButton
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={handleNext}
        size="small"
      >
        <KeyboardArrowRightIcon
          opacity={0.9}
          style={{ color: "white", fontSize: 45 }}
        />
      </IconButton>
    </Box>
  </Box>
);

export default withFBMediaCarousel(FBMediaCarousel);
