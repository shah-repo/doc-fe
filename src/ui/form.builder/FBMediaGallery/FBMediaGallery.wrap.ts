import React from "react";
import { FB, FBFilePreviewType, FBMediaGalleryProps, FBMediaProps } from "..";

export const withFBMediaGallery = <T extends FBMediaGalleryProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleDelete,
    removeMedia,
    previewType,
    ...props
  }: T) => {

    const { mediaAlbumState } = FB.useStores();

    handleDelete = (id: string) => {
      removeMedia && removeMedia(id);
      mediaAlbumState?.setActiveMedia(0);
    };

    previewType = (media: FBMediaProps): FBFilePreviewType | undefined =>
      mediaAlbumState?.previewType(media);

    return Component({
      ...(props as T),
      handleDelete,
      previewType,
    });
  };

  return (props: T) => Comp(props);
};
