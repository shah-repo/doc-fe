import { FBFormProps, FBPOReceiveProps, PurchaseOrderItem } from "..";

export type FBPOReceiveFormProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleAdd?: () => any;
  handleCancel?: () => any;
  item?: PurchaseOrderItem;
};
