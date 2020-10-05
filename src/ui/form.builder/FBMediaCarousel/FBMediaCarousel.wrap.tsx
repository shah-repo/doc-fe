import { isEmpty, isEqual, isUndefined, size } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBMediaCarouselProps, FBMediaCarouselState, FBMediaProps } from "..";

export const withFBMediaCarousel = <T extends FBMediaCarouselProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    collection = [],
    mediaCarouselState,
    activeMediaPath = "",
    removeMedia,
    toolsVisibility,
    onMouseOver,
    onMouseLeave,
    handleDelete,
    handleNext,
    handleBack,
    activeStep,
    ...props
  }: T) => {
    mediaCarouselState = FB.useRef<FBMediaCarouselState>(FBMediaCarouselState);
    const { mediaAlbumState } = FB.useStores();

    React.useEffect(() => {
      if (isUndefined(mediaAlbumState?.activeMedia)) {
        mediaAlbumState?.setActiveMedia(0);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    handleNext = () => {
      if (isUndefined(mediaAlbumState)) {
        return;
      }
      let nextStep = (mediaAlbumState?.activeMedia || 0) + 1;
      isEqual(nextStep, size(collection)) && (nextStep = 0);
      mediaAlbumState?.setActiveMedia(nextStep);
    };

    handleBack = () => {
      if (isUndefined(mediaAlbumState)) {
        return;
      }
      let prevStep = (mediaAlbumState?.activeMedia || size(collection)) - 1;
      prevStep < 0 && (prevStep = size(collection) - 1);
      mediaAlbumState?.setActiveMedia(prevStep);
    };

    handleDelete = () => {
      const activeMedia = mediaAlbumState?.activeMedia;
      if (isUndefined(activeMedia)) {
        return;
      }
      const media: FBMediaProps | undefined = collection[activeMedia];
      if (isUndefined(media)) {
        return;
      }
      removeMedia && removeMedia(media.id);
      mediaAlbumState?.setActiveMedia(0);
    };

    onMouseOver = () => !isEmpty(activeMediaPath) && mediaCarouselState?.setToolsVisible(true);
    onMouseLeave = () => mediaCarouselState?.setToolsVisible(false);

    useObserver(() => {
      activeStep = mediaAlbumState?.activeMedia || 0;
      activeMediaPath = collection[activeStep]?.s3link;
      toolsVisibility = mediaCarouselState?.toolsVisibility || "hidden";
    });

    return Component({
      ...(props as T),
      onMouseOver,
      onMouseLeave,
      activeMediaPath,
      toolsVisibility,
      collection,
      activeStep,
      handleNext,
      handleBack,
      handleDelete,
    });
  };

  return (props: T) => Comp(props);
};
