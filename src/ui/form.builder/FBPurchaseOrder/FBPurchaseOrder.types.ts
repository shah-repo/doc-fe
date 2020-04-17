import { Dictionary } from "lodash";
import { FBPurchaseOrderState } from ".";
import { FBInputProps } from "../types/common";

export type FBPurchaseOrderBasicProps = Pick<FBInputProps, "name" | "disabled" | "label">;

export type FBPurchaseOrderFieldProps =
& FBPurchaseOrderBasicProps
& {
  poState: FBPurchaseOrderState;
};

export type FBPurchaseOrderDialogProps =
& FBPurchaseOrderBasicProps
& {
  isDialogOpen: boolean;
  initialValues?: Dictionary<PurchaseOrderItem>;
  onSubmit: (item: any) => void;
  closeDialog: () => void;
  items?: PurchaseOrderItem[];
};

export type FBPurchaseOrderFormProps =
& FBPurchaseOrderBasicProps
& Pick<FBPurchaseOrderDialogProps, "initialValues" | "onSubmit" | "closeDialog" | "items">
& {
  validateForm?: (values: any) => void;
};

export type FBPurchaseOrderAddItemProps =
& FBPurchaseOrderBasicProps
& Pick<FBPurchaseOrderDialogProps, "onSubmit" | "closeDialog" | "items" | "isDialogOpen">
& {
  openDialog: () => void;
};

export type FBPurchaseOrderTotalProps =
& FBPurchaseOrderBasicProps
& Pick<PurchaseOrder, "shippingCost" | "subTotal" | "tax" | "totalAmount">
& Pick<FBPurchaseOrderState, "setShippingCost">
& Pick<FBInputProps, "disabled">;


export type FBPurchaseOrderTableProps =
& FBPurchaseOrderBasicProps
& Pick<FBPurchaseOrderDialogProps, "onSubmit" | "closeDialog" | "items" | "isDialogOpen" | "initialValues">
& {
  items: PurchaseOrderItem[];
  isDocumentReleased?: boolean;
  handleEdit: (index: number, item: PurchaseOrderItem) => () => void;
  handleDelete (index: number): (e: any) => void;
};

export interface PurchaseOrder {
  shippingCost: string;
  tax: string;
  subTotal: string;
  totalAmount: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  index: number;
  order: string;
  glCode: string;
  units: string;
  partNumber: string;
  date: Date;
  description: string;
  unitPrice: string;
  formattedDate: string;
  totalAmount: string;
  isTraceabilityRequired: boolean;
  capitalEquipment: boolean;
  tax: boolean;
  received?: number;
}
