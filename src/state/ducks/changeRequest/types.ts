import { CHANGE_REQUEST_AUDIT_SET, CHANGE_REQUEST_LIST, CHANGE_REQUEST_LIST_APPROVERS, CHANGE_REQUEST_SET } from ".";
import { FBTaskItem } from "../../../ui/form.builder";
import { Attachment } from "../attachments";
import { AuditActionPayload } from "../audit";
import { Approval, Id, Owner, User } from "../common";
import { FBDocumentRevisionProps } from "../documentRevisions";

export enum ChangeRequestStatus {
  Draft = "DRAFT",
  InReview = "IN_REVIEW",
  Implementation = "IMPLEMENTATION",
  Approved = "APPROVED",
  Closed = "CLOSED",
  Voided = "VOIDED",
}

export enum ImplementationPlanTaskStatus {
  Pending = "PENDING",
  Done = "DONE",
}

interface Justifications {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

interface Assessment {
  design: AssessmentItem;
  process: AssessmentItem;
  regulatory: AssessmentItem;
}

interface AssessmentItem {
  id?: string;
  reasoning?: string | null;
  attachments?: Attachment[] | null;
}

export interface ImplementationPlanTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  assigned?: Owner;
  createdAt: string;
  closeDate: Date;
  status: string;
  updatedAt: string;
  closingNote: string | null;
}

export interface ImplementationPlan {
  id: string;
  tasks: ImplementationPlanTask[];
  attachments: Attachment[];
}
// This needs to be properly cleaned up
export interface ChangeRequest {
  createdAt: string;
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
  owner: Owner;
  documentRevisions: any[];
  closedAt: Date;
  formInput?: Record<string, any>;
  formDocument?: FBDocumentRevisionProps;
  tasks?: FBTaskItem[];
}

export interface ChangeRequestEditRequestBody {
  title?: string;
  description?: string;
  formInput?: Record<string, any>;
  formDocument?: FBDocumentRevisionProps;
  documentType?: Id;
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
  password?: string;
  effectiveDate?: string;
}

export interface ChangeRequestTransitionResponse {
  id: string;
}

export interface ChangeRequestAvailableApprovers {
  id: string;
  user: User;
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

export interface ChangeRequestAuditSetAction {
  type: typeof CHANGE_REQUEST_AUDIT_SET;
  payload: AuditActionPayload;
}

export type allIdsState = string[];
