import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBMediaAlbumProps, FBMediaAlbumState } from "..";

export const withFBMediaAlbum = <T extends FBMediaAlbumProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    setMediaMode,
    mediaAlbumState,
    collection = [],
    title = "",
    mode,
    ...props
  }: T) => {

    mediaAlbumState = FB.useRef<FBMediaAlbumState>(FBMediaAlbumState);

    // Handle mode
    setMediaMode = () => {
      const mode = mediaAlbumState?.mode === "carousel" ? "gallery" : "carousel";
      mediaAlbumState?.setMode(mode);
    };

    useObserver(() => {
      mode = mediaAlbumState?.mode;
      title = (mode === "carousel")
        ? collection[mediaAlbumState?.activeMedia || 0]?.name
        : "";
    });

    return Component({
      ...(props as T),
      setMediaMode,
      mediaAlbumState,
      collection,
      title,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
