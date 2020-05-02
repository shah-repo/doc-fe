import { FBInputProps } from "..";

export type FBPurchaseOrderProps =
& Pick<FBInputProps, "name" | "label" | "disabled">
& {
  handleAddItem?: () => any;
};
