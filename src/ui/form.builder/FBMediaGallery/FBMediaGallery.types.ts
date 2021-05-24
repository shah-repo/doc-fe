import { FBAttachment, FBFilePreviewType, FBMediaAlbumProps } from "..";

export type FBMediaGalleryProps =
& Pick<FBMediaAlbumProps, "collection" | "removeMedia" | "actionsDisabled" | "autosave">
& {
  handleDelete?: (id: string) => any;
  previewType?: (media: FBAttachment) => FBFilePreviewType | undefined;
};
