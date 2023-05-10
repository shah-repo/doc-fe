import { FBCurrency, FBInputProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem, FBPurchaseOrderProps } from "..";
import { DialogHandler } from "../../hooks/useDialog";

export type FBPurchaseOrderTableProps =
& Pick<FBInputProps, "name" | "disabled">
& Pick<FBPurchaseOrderProps, "handleItem" | "handleLot" | "disabled" | "mode">
& {
  handleShippingCostChange?: (ev: React.ChangeEvent<any>) => any;
  handleTaxChange?: (ev: React.ChangeEvent<any>) => void;
  handleTaxRateChange?: (ev: React.ChangeEvent<any>) => void;
  handleCurrencyChange?: (ev, value) => void;
  handleDelete?: (index: number) => (e: any) => void;
  reCalculateValueOnBlur?: () => void;
  onAlertNotificationCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  onAlertNotificationConfirm?: () => void;
  onAddLineItemClick?: () => void;
  classes?: Record<"root" | "table" | "button" | "list" | "sum", string>;
  items?: FBPurchaseOrderItem[];
  calculation?: FBPurchaseOrderCalculation;
  loading?: boolean;
  isReceivable?: boolean;
  isPOAddAction?: boolean;
  dialog?: DialogHandler;
};

export type FBPurchaseOrderTableDetailsProps =
& Pick<FBPurchaseOrderTableProps,
| "handleDelete"
| "handleItem"
| "classes"
| "items"
| "mode"
| "loading"
| "calculation"
| "isReceivable"
>;

export type FBPurchaseOrderTableSumProps =
& Pick<FBPurchaseOrderTableProps,  "handleItem" | "handleLot" | "classes" | "items" | "calculation" | "mode" |
"isReceivable">;

export type FBPurchaseOrderTableTotalProps = Pick<FBPurchaseOrderTableProps,
| "handleShippingCostChange"
| "handleTaxChange"
| "handleTaxRateChange"
| "handleCurrencyChange"
| "reCalculateValueOnBlur"
| "calculation"
| "disabled"
| "name"
>;

export enum FBPurchaseOrderDetailsProduct {
  index = "form.builder.item",
  partNumberDocId = "form.builder.field.part.number",
  supplierPartNumber = "form.builder.field.supplier.part.number",
  description = "form.builder.field.description",
  order = "form.builder.field.ordered",
  received = "form.builder.field.received",
  units = "form.builder.field.units",
  formattedDate = "form.builder.field.date.required",
  unitPrice = "form.builder.field.unit.price",
  lots = "form.builder.field.lots",
}

export enum FBPurchaseOrderDetailsService {
  index = "form.builder.item",
  serviceId = "form.builder.field.service.id",
  supplierPartNumber = "form.builder.field.supplier.part.number",
  description = "form.builder.field.description",
  order = "form.builder.field.ordered",
  received = "form.builder.field.received",
  units = "form.builder.field.units",
  formattedDate = "form.builder.field.date.required",
  unitPrice = "form.builder.field.unit.price",
  lots = "form.builder.field.lots",
}

export interface FBCurrencyOption {
  text: string;
  value: FBCurrency;
}
