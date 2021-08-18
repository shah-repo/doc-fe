import { FBDialogState, FBInputProps, FBPurchaseOrderState } from "..";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";

type FBPurchaseOrderMode = "preview" | "form";
export type FBPurchaseOrderProps =
& Pick<FBInputProps, "name" | "label" | "disabled" | "gutter" | "defaultValue" | "autosave">
& {
  handleItem?: (item?: FBPurchaseOrderItem) => any;
  handleReceiveAll: (items?: FBPurchaseOrderItem[]) => any;
  handleLot?: (e?: React.MouseEvent<HTMLButtonElement>, item?: FBPurchaseOrderItem) => void;
  purchaseOrderState?: FBPurchaseOrderState;
  dialogState?: FBDialogState;
  mode?: FBPurchaseOrderMode;
};

type FBPurchaseOrderItemType = "product" | "service";

export interface FBPurchaseOrderItem {
  id: string;
  index: number;
  order: string;
  glCode: string;
  units: string;
  partNumber: string;
  partNumberDocId: string;
  partNumberTitle: string;
  supplierPartNumber: string;
  date: Date;
  description: string;
  unitPrice: string;
  formattedDate: string;
  totalAmount: string;
  lots?: string;
  isTraceabilityRequired: boolean;
  capitalEquipment: boolean;
  tax: boolean;
  serviceId?: string;
  received?: number;
  receivedList?: any[];
  type: FBPurchaseOrderItemType;
  status?: DocumentRevisionStatus;
}

export interface FBPurchaseOrderCalculation {
  subTotal: string;
  tax: string;
  totalAmount: string;
  shippingCost: string;
  currency: FBCurrency;
  exchangeRate: number;
  totalInUSD: string;
  dateOfExchangeRate: string;
}

export type FBPurchaseOrderValue = FBPurchaseOrderCalculation
& {
  items?: FBPurchaseOrderItem[];
};

export type FBPurchaseOrderConstructor = FBPurchaseOrderValue & {
  documentId?: string;
};

export type FBCurrency = "USD" | "EUR" | "GBP";
