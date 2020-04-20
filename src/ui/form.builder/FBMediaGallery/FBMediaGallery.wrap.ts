import React from "react";
import { FBMediaGalleryProps } from ".";
import { FB } from "..";

export const withFBMediaGallery = <T extends FBMediaGalleryProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleDelete,
    removeMedia,
    ...props
  }: T) => {

    const { mediaAlbumState } = FB.useStores();

    handleDelete = (id: string) => {
      removeMedia && removeMedia(id);
      mediaAlbumState?.setActiveMedia(0);
    };

    return Component({
      ...(props as T),
      handleDelete,
    });
  };

  return (props: T) => Comp(props);
};
