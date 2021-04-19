import { FBAttachment, FBInputProps, FBMediaAlbumFieldState } from "..";

export type FBMediaAlbumFieldMode = "media" | "qr";

export type FBMediaAlbumFieldProps =
& Pick<FBInputProps,
| "name"
| "label"
| "isTemplate"
| "gutter"
| "reviseDisabled"
| "editorProperties"
| "autosave"
| "type"
| "index"
| "editorConfig"
> & {
  onFileUploadChange?: (event: React.FormEvent<HTMLInputElement>) => any;
  removeMedia?: (mediaId: string) => any;
  setMediaFieldMode?: () => any;
  mediaAlbumFieldState?: FBMediaAlbumFieldState;
  actionsDisabled?: boolean;
  mode?: FBMediaAlbumFieldMode;
  qrValue?: FBMediaAlbumFieldQR;
  collection?: FBAttachment[];
  loading?: boolean;
};

export interface FBMediaAlbumFieldQR {
  companyId: string;
  documentRevisionId: string;
  fieldName: string;
}
