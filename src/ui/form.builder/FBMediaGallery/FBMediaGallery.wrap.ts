import React from "react";
import { FB, FBAttachment, FBFilePreviewType, FBMediaGalleryProps } from "..";

export const withFBMediaGallery = <T extends FBMediaGalleryProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleDelete,
    removeMedia,
    previewType,
    autosave,
    ...props
  }: T) => {

    const { mediaAlbumState, workspaceState, formState } = FB.useStores();

    handleDelete = (id: string) => {
      removeMedia && removeMedia(id);
      mediaAlbumState?.setActiveMedia(0);
      if (!workspaceState?.autosave) { return; }
      workspaceState?.saveDocRev(formState?.getValues());
    };

    previewType = (media: FBAttachment): FBFilePreviewType | undefined =>
      mediaAlbumState?.previewType(media);

    return Component({
      ...(props as T),
      handleDelete,
      previewType,
      autosave,
    });
  };

  return (props: T) => Comp(props);
};
