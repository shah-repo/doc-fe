import { FBPOReceiveProps, FBPurchaseOrderItem } from "..";

export type FBPOReceiveTableProps =
& Pick<FBPOReceiveProps, "items" | "name">
& {
  handleEdit?: (index: number, item: FBPurchaseOrderItem) => any;
  disabled?: boolean;
};
