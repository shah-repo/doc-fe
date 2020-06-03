import { FBApprovalAuditState, FBInputProps, FBSchemaProps } from "..";

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

export type FBApprovalAuditProps = Pick<FBInputProps, "name" | "type" | "index"> & {
  approvalAuditState?: FBApprovalAuditState;
  audits?: FBAuditData[];
  loading?: boolean;
};


