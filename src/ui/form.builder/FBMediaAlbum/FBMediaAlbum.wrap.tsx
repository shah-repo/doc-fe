import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBMediaAlbumProps, FBMediaAlbumState } from ".";
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
    ...props
  }: T) => {
    mediaAlbumState = FB.useRef<FBMediaAlbumState>(FBMediaAlbumState);

    // Handle mode
    onClick = () => {
      const mode =
        mediaAlbumState?.getMode() === "carousel" ? "gallery" : "carousel";
      mediaAlbumState?.setMode(mode);
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
    });
  };

  return (props: T) => Comp(props);
};
