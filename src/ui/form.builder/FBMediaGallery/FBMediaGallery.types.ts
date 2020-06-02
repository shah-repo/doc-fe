import { FBMediaAlbumProps } from "..";

export type FBMediaGalleryProps =
& Pick<FBMediaAlbumProps, "collection" | "removeMedia" | "actionsDisabled">
& {
  handleDelete?: (id: string) => any;
};
