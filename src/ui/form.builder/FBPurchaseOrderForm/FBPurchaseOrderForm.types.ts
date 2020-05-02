import { FBFormProps, FBInputProps } from "..";

export type FBPurchaseOrderFormProps =
& Pick<FBFormProps, "children">
& {
  handlePartTitle?: FBInputProps["onChange"];
};
