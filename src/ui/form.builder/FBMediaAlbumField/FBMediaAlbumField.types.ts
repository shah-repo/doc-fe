import { FBInputProps, FBMediaAlbumFieldState, FBMediaProps, FBWorkspaceState } from "..";

export type FBMediaAlbumFieldMode = "media" | "qr";

export type FBMediaAlbumFieldProps =
& Pick<FBInputProps,
| "name"
| "label"
| "isTemplate"
| "gutter"
| "reviseDisabled"
| "editorProperties"
> & {
  onFileUploadChange?: (event: React.FormEvent<HTMLInputElement>) => any;
  removeMedia?: (mediaId: string) => any;
  setMediaFieldMode?: () => any;
  mediaAlbumFieldState?: FBMediaAlbumFieldState;
  actionsDisabled?: boolean;
  mode?: FBMediaAlbumFieldMode;
  qrValue?: string;
  collection?: FBMediaProps[];
  loading?: boolean;
};

export type FBMediaAlbumFieldConstructor =
& Pick<FBMediaAlbumFieldProps, "name" | "isTemplate">
& {
  workspaceState?: FBWorkspaceState;
};
