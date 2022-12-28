import { FBPurchaseOrderItemType, FBPurchaseOrderValue } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import { FBPurchaseOrderDetailsProduct, FBPurchaseOrderDetailsService } from "./FBPurchaseOrderTable.types";

export const FBPurchaseOrderCollection = {
  product: FBPurchaseOrderDetailsProduct,
  service: FBPurchaseOrderDetailsService,
};

export const checkServiceOrProductPartExists = (poItems: FBPurchaseOrderValue) => poItems?.items?.some((item) =>
  item.type === FBPurchaseOrderItemType.SERVICE
  || (item.type === FBPurchaseOrderItemType.PRODUCT && item.partNumberDocId)
);
