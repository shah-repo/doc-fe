import { Attachment } from "../attachments";
import { Approval, User } from "../common";
import { CHANGE_REQUEST_SET, CHANGE_REQUEST_LIST, CHANGE_REQUEST_LIST_APPROVERS } from "./constants";

export enum ChangeRequestStatus {
  Draft = "DRAFT",
  InReview = "IN_REVIEW",
  Withdrawn = "WITHDRAWN",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

export interface Justifications {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

export interface Assessment {
  id?: string;
  description?: string;
  attachments: Attachment[];
}

export interface ImplementationPlan {
  id?: string;
  description?: string;
  attachments: Attachment[];
}
export interface ChangeRequest {
  id: string;
  state: ChangeRequestStatus;
  description: string;
  assessment: Assessment;
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

export interface ChangeRequestEditRequestBody {
  description: string;
  assessment: Assessment;
  implementationPlan: ImplementationPlan;
  justifications: Justifications;
  effectiveDate?: Date;
  approvals: Approver[];
  documentRevisions: any[];
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

export type ChangeRequestTransition = "approve" | "reject" | "to_review" | "withdraw";

export interface ChangeRequestTransitionRequestBody {
  password: string;
}

export interface ChangeRequestTransitionResponse {
  id: string;
}

export interface ChangeRequestAvailableApprovers {
  id: string;
  email: string;
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