import { FBMediaAlbumFieldState, FBMediaProps } from "..";
import { FBInputProps } from "../types/common";

export type FBMediaAlbumFieldMode = "media" | "qr";
export type FBMediaStatus = "AVAILABLE" | "USED" | "OBSOLETED";

export type FBMediaAlbumFieldProps =
& Pick<FBInputProps, "name" | "label" | "isTemplate" | "reviseDisabled">
& {
  onFileUploadChange: (event: React.FormEvent<HTMLInputElement>) => any;
  removeMedia?: (mediaId: string) => any;
  setMediaFieldMode?: () => any;
  mediaAlbumFieldState?: FBMediaAlbumFieldState;
  actionsDisabled?: boolean;
  mode?: FBMediaAlbumFieldMode;
  qrValue?: string;
  collection?: FBMediaProps[];
  loading?: boolean;
};

export type FBMediaAlbumFieldConstructor = Pick<FBMediaAlbumFieldProps, "name" | "isTemplate">;
