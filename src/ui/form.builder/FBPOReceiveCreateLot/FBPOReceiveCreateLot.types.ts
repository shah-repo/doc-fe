import { FBFormProps, FBPOReceiveProps, FBPurchaseOrderItem } from "..";

export type FBPOReceiveCreateLotProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleCreateLot?: () => any;
  handleCancel?: () => any;
  item?: FBPurchaseOrderItem;
};
