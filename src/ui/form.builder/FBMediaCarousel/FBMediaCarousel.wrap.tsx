import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBMediaCarouselProps, FBMediaCarouselState } from ".";
import { FB } from "..";

export const withFBMediaCarousel = <T extends FBMediaCarouselProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    collection = [],
    mediaCarouselState,
    activeMediaPath = "",
    handleNext,
    handleBack,
    activeStep,
    ...props
  }: T) => {
    mediaCarouselState = FB.useRef<FBMediaCarouselState>(FBMediaCarouselState);
    const { mediaAlbumState } = FB.useStores();

    React.useEffect(() => {
      mediaAlbumState?.setActiveMedia(0);
    }, []);

    handleNext = () => {
      if (_.isUndefined(mediaAlbumState)) {
        return;
      }
      let nextStep = mediaAlbumState?.activeMedia + 1;
      _.isEqual(nextStep, _.size(collection)) && (nextStep = 0);
      mediaAlbumState?.setActiveMedia(nextStep);
    };

    handleBack = () => {
      if (_.isUndefined(mediaAlbumState)) {
        return;
      }
      let prevStep = mediaAlbumState?.activeStep - 1;
      prevStep < 0 && (prevStep = _.size(collection) - 1);
      mediaAlbumState?.setActiveMedia(prevStep);
    };

    useObserver(() => {
      activeStep = mediaAlbumState?.activeMedia || 0;
      activeMediaPath = _.get(collection[activeStep!], "path", "");
    });

    return Component({
      ...(props as T),
      collection,
      activeStep,
      activeMediaPath,
      handleNext,
      handleBack
    });
  };

  return (props: T) => Comp(props);
};
