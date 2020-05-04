import { FBDialogState, FBInputProps, FBPurchaseOrderState } from "..";

export type FBPurchaseOrderProps =
& Pick<FBInputProps, "name" | "label" | "disabled" | "gutter">
& {
  handleItem?: (item?: FBPurchaseOrderItem) => any;
  purchaseOrderState?: FBPurchaseOrderState;
  dialogState?: FBDialogState;
};

export interface FBPurchaseOrderItem {
  id: string;
  index: number;
  order: string;
  glCode: string;
  units: string;
  partNumber: string;
  partNumberDocId: string;
  partNumberTitle: string;
  date: Date;
  description: string;
  unitPrice: string;
  formattedDate: string;
  totalAmount: string;
  isTraceabilityRequired: boolean;
  capitalEquipment: boolean;
  tax: boolean;
  received?: number;
  receivedList?: any[];
}

export interface FBPurchaseOrderCalculation {
  subTotal: string;
  tax: string;
  totalAmount: string;
  shippingCost: string;
}

export type FBPurchaseOrderValue =
& FBPurchaseOrderCalculation
& {
  items?: FBPurchaseOrderItem[];
};
