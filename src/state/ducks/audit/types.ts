import { Attachment } from "../attachments";
import { ChangeRequest } from "../changeRequest";
import { Approval, User } from "../common";
import { DocumentRevision, Reference } from "../documentRevisions";

export interface Audit {
  field: string;
  type: string;
  nextValue: string | User | Attachment | Approval | Reference | DocumentRevision | ChangeRequest;
  timestamp: string;
  groupId: string;
  owner: User;
}

export interface AuditActionPayload {
  id: string;
  audit: Audit[];
}

export interface AuditGroupType { [key: string]: Audit[]; }

export interface AuditByCRIdState {
  [key: string]: AuditGroupType;
}
