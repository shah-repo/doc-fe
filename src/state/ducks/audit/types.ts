import { FBSchemaProps } from "../../../ui/form.builder";
import { Attachment } from "../attachments/types";
import { Group, User } from "../auth/types";
import { ChangeRequest } from "../changeRequest/types";
import { Approval, Owner } from "../common/types";
import { DocumentType } from "../documentRevisions/documentType/types";
import { DocumentRevision, Reference, SmartReference } from "../documentRevisions/types";

type AuditTypes =
    "ARRAY_NEW"
    |"ARRAY_DELETED"
    | "STRING_NEW"
    | "STRING_EDITED"
    | "NUMBER_EDITED"
    | "NUMBER_NEW"
    | "OBJECT_DELETED"
    | "STRING_DELETED"
    | "NUMBER_DELETED"
    | "OBJECT_NEW"
    | "BOOLEAN_NEW"
    | "BOOLEAN_EDITED";
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
  reference?: SmartReference;
  timestamp: string;
  groupId: string;
  owner: Owner;
  ownerUser?: Owner;
  ownerThirdParty?: Owner;
  fbSchemaItem?: FBSchemaProps;
  relatedEntity?: DocumentRevision;
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
