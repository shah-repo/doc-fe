import { FBFormProps, FBPOReceiveProps, FBPurchaseOrderItem } from "..";

export type FBPOReceiveFormProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleReceive?: () => any;
  handleCancel?: () => any;
  item?: FBPurchaseOrderItem;
};
