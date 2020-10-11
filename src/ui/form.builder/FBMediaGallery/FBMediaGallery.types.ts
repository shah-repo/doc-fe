import { FBFilePreviewType, FBMediaAlbumProps, FBMediaProps } from "..";

export type FBMediaGalleryProps =
& Pick<FBMediaAlbumProps, "collection" | "removeMedia" | "actionsDisabled">
& {
  handleDelete?: (id: string) => any;
  previewType?: (media: FBMediaProps) => FBFilePreviewType | undefined;
};
