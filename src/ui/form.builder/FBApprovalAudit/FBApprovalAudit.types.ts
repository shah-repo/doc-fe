import { FBApprovalAuditState, FBApprovalProps, FBEmployee, FBInputProps, FBSchemaProps } from "..";

export interface FBAuditData {
  id: string;
  field: string;
  type: string;
  previousValue?: any;
  nextValue: any;
  timestamp: string;
  owner: FBEmployee;
  description?: React.ReactNode;
  ownerName?: string;
  formattedTime?: string;
  schemaItem?: FBSchemaProps;
  groupId?: string;
}

export interface FBApprovalAuditConstructor {
  documentId?: string;
  isOutput?: boolean;
}

export type FBApprovalAuditProps =
& Pick<FBInputProps, "name" | "type" | "index">
& Pick<FBApprovalProps, "approvalNonVersioned">
& {
  approvalAuditState?: FBApprovalAuditState;
  audits?: FBAuditData[];
  loading?: boolean;
};

export enum FBAuditPOCalculation {
  subTotal = "Sub Total",
  tax = "Tax",
  totalAmount = "Total",
  shippingCost = "Shipping Cost",
  currency = "Currency",
}

export enum FBAuditPOItem {
  index = "Item",
  order = "Ordered",
  glCode = "GL Code",
  units = "Units",
  partNumber = "Part Number",
  partNumberTitle = "Part Description",
  description = "Description",
  unitPrice = "Unit Price",
  formattedDate = "Date Required",
  isTraceabilityRequired =  "Is Traceability Required",
  capitalEquipment =  "Capital Equipment",
  tax = "Tax",
  received = "Received",
  receivedList = "Received",
  type = "Type"
}


