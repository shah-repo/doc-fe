import { FBInputProps, FBMediaAlbumFieldProps } from "..";

type FBMediaQRMode = "qr" | "placeholder" | "preupload";

export type FBMediaQRProps =
& Pick<FBInputProps, "isTemplate">
& Pick<FBMediaAlbumFieldProps, "setMediaFieldMode" | "loading" | "qrValue">
& {
  mode?: FBMediaQRMode;
};
