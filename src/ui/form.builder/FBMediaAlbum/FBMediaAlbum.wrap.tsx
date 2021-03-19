import { isEmpty } from "lodash";
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
    hiddenContainer,
    actionsDisabled,
    title = "",
    mode,
    ...props
  }: T) => {

    mediaAlbumState = FB.useRef<FBMediaAlbumState>(FBMediaAlbumState);
    const { mode: workspaceMode } = FB.useStores().workspaceState || {};

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
      hiddenContainer = Boolean(
        (workspaceMode === "preview" || workspaceMode === "formPreview" || actionsDisabled) &&
        isEmpty(collection)
      );
    });

    return Component({
      ...(props as T),
      setMediaMode,
      mediaAlbumState,
      workspaceMode,
      hiddenContainer,
      actionsDisabled,
      collection,
      title,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
