import { MobileStepperProps } from "@material-ui/core";
import { FBMediaAlbumProps } from "../FBMediaAlbum";
import FBMediaCarouselState from "./FBMediaCarousel.state";

export type FBMediaCarouselProps = Pick<MobileStepperProps, "activeStep"> &
  Pick<FBMediaAlbumProps, "collection"> & {
    mediaCarouselState?: FBMediaCarouselState;
    activeMediaPath?: string;
    handleNext?: () => any;
    handleBack?: () => any;
  };
