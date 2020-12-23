import { FBSchemaProps } from "../../../ui/form.builder";
import { Attachment } from "../attachments";
import { Group, User } from "../auth/types";
import { ChangeRequest } from "../changeRequest";
import { Approval, Owner } from "../common";
import { DocumentRevision, Reference } from "../documentRevisions";
import { DocumentType } from "../documentRevisions/documentType";

type AuditTypes = "ARRAY_NEW" | "ARRAY_DELETED";
export interface Audit {
  groupKey?: number | undefined;
  index?: number | undefined;
  id: string;
  field: string;
  type: AuditTypes;
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
