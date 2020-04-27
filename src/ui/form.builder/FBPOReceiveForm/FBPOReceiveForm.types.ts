import { FBFormProps, FBPOReceiveProps } from "..";

export type FBPOReceiveFormProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleAdd?: () => any;
  handleCancel?: () => any;
};
