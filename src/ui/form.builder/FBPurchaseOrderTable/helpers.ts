import { FBPurchaseOrderItem, FBPurchaseOrderItemType, FBPurchaseOrderValue } from "../FBPurchaseOrder/FBPurchaseOrder.types";
import { FBPurchaseOrderDetailsProduct, FBPurchaseOrderDetailsService } from "./FBPurchaseOrderTable.types";

export const FBPurchaseOrderCollection = {
  product: FBPurchaseOrderDetailsProduct,
  service: FBPurchaseOrderDetailsService,
};

export const checkServiceOrProductPartExists = (poItems: FBPurchaseOrderValue) => poItems?.items?.some((item) =>
  item.type === FBPurchaseOrderItemType.SERVICE
  || (item.type === FBPurchaseOrderItemType.PRODUCT && item.partNumberDocId)
);

export const formatCost = (val: number, fixedDecimal?: number): string => {
  if (val === 0) {
    return val.toFixed(2);
  }
  return val.toFixed(fixedDecimal || 2);
};

export const getPOLineItemsTotalAndForTaxAmount = (poLineItems: FBPurchaseOrderItem[]) => poLineItems?.reduce(
  (agg, item: FBPurchaseOrderItem) => {
    const orderCost = parseFloat(item.unitPrice || "0") * parseFloat(item.order || "0");
    agg.subTotal += orderCost;
    agg.forTax += item.tax ? orderCost : 0;
    return agg;
  }, { subTotal: 0, forTax: 0 });
