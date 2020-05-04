import { FBInputProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem } from "..";
import { FBPurchaseOrderProps } from "../FBPurchaseOrder/FBPurchaseOrder.types";

export type FBPurchaseOrderTableProps =
& Pick<FBInputProps, "name" | "disabled">
& Pick<FBPurchaseOrderProps, "handleItem">
& {
  handleShippingCost?: (ev: React.ChangeEvent<any>) => any;
  classes?: Record<"table" | "tableDetails", string>;
  items?: FBPurchaseOrderItem[];
  calculation?: FBPurchaseOrderCalculation;
};

export enum FBPurchaseOrderDetailsHead {
  index = "form.builder.item",
  description = "form.builder.field.supplier.part.number",
  order = "form.builder.field.ordered",
  received = "form.builder.field.received",
  units = "form.builder.field.units",
  partNumberDocId = "form.builder.field.part.number",
  formattedDate = "form.builder.field.date.required",
  unitPrice = "form.builder.field.unit.price"
}
