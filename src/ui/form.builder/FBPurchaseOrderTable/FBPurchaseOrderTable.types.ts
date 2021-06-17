import { FBCurrency, FBInputProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem, FBPurchaseOrderProps } from "..";

export type FBPurchaseOrderTableProps =
& Pick<FBInputProps, "name" | "disabled">
& Pick<FBPurchaseOrderProps, "handleItem" | "disabled" | "mode">
& {
  handleShippingCost?: (ev: React.ChangeEvent<any>) => any;
  handleCurrencyChange?: (ev, value) => void;
  handleDelete?: (index: number) => (e: any) => void;
  handleLot?: (item?: FBPurchaseOrderItem) => any;
  classes?: Record<"root" | "table", string>;
  items?: FBPurchaseOrderItem[];
  calculation?: FBPurchaseOrderCalculation;
  loading?: boolean;
};

export type FBPurchaseOrderTableDetailsProps =
& Pick<FBPurchaseOrderTableProps,
| "handleDelete"
| "handleItem"
| "handleLot"
| "classes"
| "items"
| "mode"
| "loading"
| "calculation"
>;

export type FBPurchaseOrderTableSumProps =
& Pick<FBPurchaseOrderTableProps,  "handleItem" | "handleLot" | "classes" | "items" | "calculation" | "mode">;

export type FBPurchaseOrderTableTotalProps =
& Pick<FBPurchaseOrderTableProps,  "handleShippingCost" | "handleCurrencyChange" | "calculation" | "disabled" | "name">;

export enum FBPurchaseOrderDetailsProduct {
  index = "form.builder.item",
  partNumberDocId = "form.builder.field.part.number",
  supplierPartNumber = "form.builder.field.supplier.part.number",
  description = "form.builder.field.description",
  order = "form.builder.field.ordered",
  received = "form.builder.field.received",
  units = "form.builder.field.units",
  formattedDate = "form.builder.field.date.required",
  unitPrice = "form.builder.field.unit.price"
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
  unitPrice = "form.builder.field.unit.price"
}

export interface FBCurrencyOption {
  text: string;
  value: FBCurrency;
}
