import { FBMediaAlbumFieldState } from "..";
import { FBInputProps } from "../types/common";

export type FBMediaAlbumFieldMode = "mediaMode" | "qr";

export type FBMediaAlbumFieldProps = FBInputProps & {
  mode?: FBMediaAlbumFieldMode;
  mediaAlbumFieldState?: FBMediaAlbumFieldState;
  qrValue?: string;
  onClick?: () => any;
};
