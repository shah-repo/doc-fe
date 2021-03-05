import { Box, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import React from "react";
import Img from "react-image";
import LazyLoad from "react-lazy-load";
import { FBMediaCarouselProps } from "..";
import Text from "../../components/Text";
import { withFBMediaCarousel } from "./FBMediaCarousel.wrap";

const FBMediaCarousel: React.FunctionComponent<FBMediaCarouselProps> = ({
  onMouseOver,
  onMouseLeave,
  handleNext,
  handleBack,
  handleDelete,
  activeMediaPath,
  toolsVisibility,
  actionsDisabled,
  previewType,
}) => (
  <Box
    position="relative"
    width="100%"
    display="flex"
    alignItems="center"
    height={350}
    justifyContent="center"
    bgcolor="#f6f7f7"
    {...{ onMouseOver, onMouseLeave }}
  >
    {previewType === "video" && (
      <LazyLoad height={350}>
        <video controls={true} width="100%" height="95%" src={activeMediaPath}>
          <Text translation="file.viewer.video.not.supported" />
        </video>
      </LazyLoad>
    )}
    {previewType === "image" && (
      <LazyLoad height={350}>
        <Img
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            position: "relative",
            top: "50%",
            msTransform: "translateY(-50%)",
            WebkitTransform: "translateY(-50%)",
            transform: "translateY(-50%)",
          }}
          src={activeMediaPath}
          loader={
            <Box height="100%" display="flex" alignItems="center">
              <CircularProgress />
            </Box>
          }
        />
      </LazyLoad>
    )}
    {previewType === "pdf" && (
      <LazyLoad height={350}>
        <object width="100%" height="100%" type="application/pdf" data={activeMediaPath}>
          <Text translation="common.file.not.loaded" />
        </object>
      </LazyLoad>
    )}
    {!actionsDisabled && (
      <Box position="absolute" top={4} right={0} visibility={toolsVisibility} color="white">
        <IconButton
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleDelete}
          size="small"
          color="inherit"
        >
          <Tooltip title={<Text message="form.builder.delete" />}>
            <DeleteForeverIcon
              fontSize="default"
              opacity={0.9}
            />
          </Tooltip>
        </IconButton>
      </Box>
    )}
    <Box position="absolute" alignContent="middle" left={10} visibility={toolsVisibility}>
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
    <Box position="absolute" alignContent="middle" right={10} visibility={toolsVisibility}>
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
