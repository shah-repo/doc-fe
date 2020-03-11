import { FBInputProps } from "../types/common";

export type FBMediaQRMode = "qr" | "placeholder" | "preupload";

export type FBMediaQRProps = Pick<FBInputProps, "isTemplate"> & {
  qrValue: string;
  disabled?: boolean;
  handleClose?: () => any;
  mode?: FBMediaQRMode;
};
