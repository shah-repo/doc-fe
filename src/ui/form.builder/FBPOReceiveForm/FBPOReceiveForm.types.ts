import { FBFormProps, FBPOReceiveProps, PurchaseOrderItem } from "..";

export type FBPOReceiveFormProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleReceive?: () => any;
  handleCancel?: () => any;
  item?: PurchaseOrderItem;
};
