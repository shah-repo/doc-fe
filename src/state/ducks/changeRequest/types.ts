import { Attachment } from "../attachments";
import { Approval, Id, User } from "../common";
import { DocumentRevision } from "../documentRevisions";
import {
  CHANGE_REQUEST_AUDIT_SET,
  CHANGE_REQUEST_LIST,
  CHANGE_REQUEST_LIST_APPROVERS,
  CHANGE_REQUEST_SET,
} from "./constants";

export enum ChangeRequestStatus {
  Draft = "DRAFT",
  InReview = "IN_REVIEW",
  Implementation = "IMPLEMENTATION",
  Approved = "APPROVED",
  Closed = "CLOSED",
}

export enum ImplementationPlanTaskStatus {
  Pending = "PENDING",
  Done = "DONE"
}

export interface Justifications {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

export enum AssessmentType {
  design = "design",
  process = "process",
  regulatory = "regulatory",
}

export interface Assessment {
  description?: string;
  design: AssessmentItem;
  process: AssessmentItem;
  regulatory: AssessmentItem;
}

export interface AssessmentItem {
  reasoning?: string | null;
  attachments?: Attachment[] | null;
}

export interface ImplementationPlanTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  assigned?: User;
  createdAt: string;
  status: string;
  updatedAt: string;
  closingNote: string | null;
}

export interface ImplementationPlan {
  id: string;
  tasks: ImplementationPlanTask[];
  attachments: Attachment[];
}

export interface ChangeRequest {
  id: string;
  crId: string;
  ordinalNumber: number;
  title: string;
  description: string;
  state: ChangeRequestStatus;
  assessments: Assessment;
  implementationPlan: ImplementationPlan;
  justifications: Justifications;
  effectiveDate: Date;
  approvals: Approval[];
  owner: User;
  documentRevisions: any[];
}

export interface Approver {
  email: string;
}

export interface DocumentRevisionRequestBody {
  id: string;
}

export interface EditRequestBodyAttachment {
  id: string;
}

export interface EditRequestBodyNestedObject {
  description?: string;
  attachments: EditRequestBodyAttachment[];
}

export interface ImplementationPlanTaskRequest {
  id?: string;
  title: string;
  description: string;
  dueDate?: string;
  assigned?: Id;
  status: string;
}

export interface ImplementationPlanRequest {
  tasks: ImplementationPlanTaskRequest[];
  attachments: EditRequestBodyAttachment[];
}

export interface ChangeRequestEditRequestBody {
  title: string;
  description: string;
  assessments: Assessment;
  implementationPlan: ImplementationPlanRequest;
  justifications: EditRequestBodyNestedObject;
  effectiveDate?: string;
  approvals: Approver[];
  documentRevisions: DocumentRevisionRequestBody[];
}

export interface ChangeRequestSetAction {
  type: typeof CHANGE_REQUEST_SET;
  payload: ChangeRequest;
}

export interface ChangeRequestListAction {
  type: typeof CHANGE_REQUEST_LIST;
  payload: ChangeRequest[];
}

export interface ChangeRequestsByIdState {
  [key: string]: ChangeRequest;
}

export type ChangeRequestsAllIdsState = string[];

export type ChangeRequestTransition =
  "approve" | "reject" | "to_review" | "withdrawn" | "submitted" | "in_review" | "closed";

export interface ChangeRequestTransitionRequestBody {
  password: string;
}

export interface ChangeRequestTransitionResponse {
  id: string;
}

export interface ChangeRequestAvailableApprovers {
  id: string;
  email: string;
  name: string;
}

export interface ChangeRequestAvailableApproversResponse {
  optionalApprovers: ChangeRequestAvailableApprovers[];
}

export interface ChangeRequestsApproversByIdState {
  [key: string]: ChangeRequestAvailableApprovers;
}

export type ChangeRequestsApproversAllIdsState = string[];

export interface ChangeRequestListApproversAction {
  type: typeof CHANGE_REQUEST_LIST_APPROVERS;
  payload: ChangeRequestAvailableApprovers[];
}

export interface Audit {
  field: string;
  type: string;
  nextValue: string | User | Attachment | Approval | DocumentRevision;
  timestamp: string;
  groupId: string;
  owner: User;
}

export interface AuditActionPayload {
  id: string;
  audit: Audit[];
}

export interface ChangeRequestAuditSetAction {
  type: typeof CHANGE_REQUEST_AUDIT_SET;
  payload: AuditActionPayload;
}

export interface AuditByCRIdState {
  [key: string]: Audit[];
}

export type allIdsState = string[];
