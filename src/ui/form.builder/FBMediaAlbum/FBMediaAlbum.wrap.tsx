import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBMediaAlbumProps, FBMediaAlbumState, FBMediaProps } from ".";
import { FB } from "..";

export const withFBMediaAlbum = <T extends FBMediaAlbumProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mediaAlbumState,
    collection = [],
    title = "",
    onClick,
    mode,
    remove,
    ...props
  }: T) => {
    mediaAlbumState = FB.useRef<FBMediaAlbumState>(FBMediaAlbumState);

    // Handle mode
    onClick = () => {
      const mode =
        mediaAlbumState?.getMode() === "carousel" ? "gallery" : "carousel";
      mediaAlbumState?.setMode(mode);
    };

    remove = () => {
      const activeMedia = mediaAlbumState?.activeMedia;
      if (_.isUndefined(activeMedia)) {
        return;
      }
      const media: FBMediaProps | undefined = collection[activeMedia];
      if (_.isUndefined(media)) {
        return;
      }
      props.removeMedia && props.removeMedia(media.id);
    };

    useObserver(() => {
      if (mediaAlbumState && mediaAlbumState.activeMedia) {
        title = _.get(collection[mediaAlbumState.activeMedia], "name", "");
      }
      mode = mediaAlbumState?.mode;
    });

    return Component({
      ...(props as T),
      mediaAlbumState,
      collection,
      title,
      mode,
      onClick,
      remove,
    });
  };

  return (props: T) => Comp(props);
};
