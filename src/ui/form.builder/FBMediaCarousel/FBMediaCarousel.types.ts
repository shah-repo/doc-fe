import { BoxProps, MobileStepperProps } from "@material-ui/core";
import { FBVisibilityType } from "..";
import { FBMediaAlbumProps } from "../FBMediaAlbum";
import FBMediaCarouselState from "./FBMediaCarousel.state";

export type FBMediaCarouselProps =
& Pick<MobileStepperProps, "activeStep">
& Pick<BoxProps, "onMouseOver" | "onMouseLeave">
& Pick<FBMediaAlbumProps, "collection" | "removeMedia" | "actionsDisabled">
& {
  handleNext?: () => any;
  handleBack?: () => any;
  handleDelete?: () => any;
  mediaCarouselState?: FBMediaCarouselState;
  activeMediaPath?: string;
  toolsVisibility?: FBVisibilityType;
};
