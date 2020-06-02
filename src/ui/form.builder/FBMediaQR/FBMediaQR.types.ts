import { FBInputProps, FBMediaAlbumFieldProps } from "..";

export type FBMediaQRMode = "qr" | "placeholder" | "preupload";

export type FBMediaQRProps =
& Pick<FBInputProps, "isTemplate">
& Pick<FBMediaAlbumFieldProps, "setMediaFieldMode" | "loading">
& {
  qrValue: string;
  mode?: FBMediaQRMode;
};
