import { FBApprovalAuditState, FBApprovalProps, FBInputProps, FBSchemaProps } from "..";

export type FBAuditType =
| "STRING_NEW"
| "STRING_EDITED"
| "OBJECT_NEW"
| "OBJECT_EDITED"
| "ARRAY_NEW"
| "ARRAY_EDITED"
| "NUMBER_NEW"
| "NUMBER_EDITED"
| "default";

export interface FBOwner {
  id: string;
  user: FBUser;
}

export interface FBUser {
  id: string;
  email: string;
  name: string;
}

export interface FBAuditData {
  id: string;
  field: string;
  type: string;
  previousValue?: any;
  nextValue: any;
  timestamp: string;
  owner: FBOwner;
  description?: string;
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


