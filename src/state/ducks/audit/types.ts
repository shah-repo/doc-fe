import { FBSchemaProps } from "../../../ui/form.builder";
import { Attachment } from "../attachments/types";
import { Group, User } from "../auth/types";
import { ChangeRequest } from "../changeRequest/types";
import { Approval, Owner } from "../common/types";
import { DocumentType } from "../documentRevisions/documentType/types";
import { DocumentRevision, Reference } from "../documentRevisions/types";

type AuditTypes = "ARRAY_NEW" | "ARRAY_DELETED" | "STRING_EDITED";
export interface Audit {
  groupKey?: number | undefined;
  index?: number | undefined;
  id: string;
  field: string;
  type: AuditTypes;
  approvalStatus?: string;
  nextValue:
  | string
  | User
  | Owner
  | Attachment
  | Approval
  | Reference
  | DocumentRevision
  | ChangeRequest
  | DocumentType
  | Group;
  previousValue?: Audit["nextValue"];
  timestamp: string;
  groupId: string;
  owner: Owner;
  ownerUser?: Owner;
  ownerThirdParty?: Owner;
  fbSchemaItem?: FBSchemaProps;
}

export interface AuditActionPayload {
  id: string;
  audit: Audit[];
}

export interface AuditGroupType {
  [key: string]: Audit[];
}

export interface AuditByCRIdState {
  [key: string]: AuditGroupType;
}
