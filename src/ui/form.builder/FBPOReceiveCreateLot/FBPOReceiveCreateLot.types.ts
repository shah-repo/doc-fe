import { FBFormProps, FBPOReceiveProps, FBPurchaseOrderItem } from "..";

export type FBPOReceiveCreateLotProps =
& Pick<FBPOReceiveProps, "name">
& Pick<FBFormProps, "children">
& {
  handleCreateLot?: () => void;
  handleCancel?: () => void;
  item?: FBPurchaseOrderItem;
};
