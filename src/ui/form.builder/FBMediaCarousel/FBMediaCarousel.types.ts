import { BoxProps, MobileStepperProps } from "@material-ui/core";
import { FBFilePreviewType, FBMediaAlbumProps, FBMediaCarouselState, FBVisibilityType } from "..";

export type FBMediaCarouselProps =
& Pick<MobileStepperProps, "activeStep">
& Pick<BoxProps, "onMouseOver" | "onMouseLeave">
& Pick<FBMediaAlbumProps, "collection" | "removeMedia" | "actionsDisabled" | "autosave">
& {
  handleNext?: () => any;
  handleBack?: () => any;
  handleDelete?: () => any;
  mediaCarouselState?: FBMediaCarouselState;
  activeMediaPath?: string;
  toolsVisibility?: FBVisibilityType;
  previewType?: FBFilePreviewType;
};
