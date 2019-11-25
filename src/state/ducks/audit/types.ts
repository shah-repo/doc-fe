import { Attachment } from "../attachments";
import { ChangeRequest } from "../changeRequest";
import { Approval, Owner } from "../common";
import { DocumentRevision, Reference } from "../documentRevisions";
import { DocumentType } from "../documentRevisions/documentType";

export interface Audit {
  id: string;
  field: string;
  type: string;
  nextValue:
    | string
    | Owner
    | Attachment
    | Approval
    | Reference
    | DocumentRevision
    | ChangeRequest
    | DocumentType;
  timestamp: string;
  groupId: string;
  owner: Owner;
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
