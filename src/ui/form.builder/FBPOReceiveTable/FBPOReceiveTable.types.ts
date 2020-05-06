import { Dictionary } from "lodash";
import { FBPOReceiveProps, PurchaseOrderItem } from "..";

export type FBPOReceiveTableProps =
& Pick<FBPOReceiveProps, "items" | "name">
& {
  handleEdit?: (index: number, item: PurchaseOrderItem) => any;
  disabled?: boolean;
  receivedItems?: Dictionary<number>;
};
