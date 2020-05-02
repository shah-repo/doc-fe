import { FBFormProps, FBPOReceiveProps } from "..";
import { PurchaseOrderItem } from "../FBPurchaseOrder_/FBPurchaseOrder.types";

export type FBPOReceiveFormProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleReceive?: () => any;
  handleCancel?: () => any;
  item?: PurchaseOrderItem;
};
