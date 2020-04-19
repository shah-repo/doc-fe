import { FBMediaAlbumFieldProps } from "..";
import { FBInputProps } from "../types/common";

export type FBMediaQRMode = "qr" | "placeholder" | "preupload";

export type FBMediaQRProps =
& Pick<FBInputProps, "isTemplate">
& Pick<FBMediaAlbumFieldProps, "setMediaFieldMode" | "loading">
& {
  qrValue: string;
  mode?: FBMediaQRMode;
};
