import { FBPOReceiveProps } from "..";
import { PurchaseOrderItem } from "../FBPurchaseOrder_/FBPurchaseOrder.types";

export type FBPOReceiveTableProps =
& Pick<FBPOReceiveProps, "items" | "name">
& {
  handleEdit?: (index: number, item: PurchaseOrderItem) => any;
  disabled?: boolean;
};
