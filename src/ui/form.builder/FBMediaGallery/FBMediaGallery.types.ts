import { FBAttachment, FBFilePreviewType, FBMediaAlbumProps } from "..";

export type FBMediaGalleryProps =
& Pick<FBMediaAlbumProps, "collection" | "removeMedia" | "actionsDisabled">
& {
  handleDelete?: (id: string) => any;
  previewType?: (media: FBAttachment) => FBFilePreviewType | undefined;
};
