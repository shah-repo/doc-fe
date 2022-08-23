import { ChangeRequest } from "../changeRequest/types";
import { Employee } from "../company/types";
import { DocumentRevision } from "../documentRevisions/types";

export enum ApprovalStatus {
  Draft = "DRAFT",
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Abandoned = "ABANDONED",
}

export enum STATUS_FILTER_TEXT {
  OPEN = "Open",
  WIP = "WIP",
  DRAFT = "Draft",
  IN_REVIEW = "In Review",
  RELEASED = "Released",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  PENDING = "Pending",
  CLOSED = "Closed",
  VOID = "Void",
  VOIDED = "Voided",
  IMPLEMENTATION = "Implementation",
  PENDING_CHANGE = "Pending Change",
  PENDING_APPROVAL = "Pending Approval",
  OBSOLETE = "Obsolete",
  CURRENT = "Current",
  CANCELED = "Canceled",
  ARCHIVE = "Archive",
  LAST_SIGNED = "Last Signed",
  SUPERSEDED = "Superseded",
  ACCEPTED = "Accepted"
}

export interface Owner {
  id: string;
  user: User;
}

export interface User {
  avatar: string | null;
  id: string;
  email: string;
  name: string;
  confirmed?: boolean;
  locked?: boolean;
  initialColor: string;
}

export interface Approval {
  updatedAt: string;
  id: string;
  status: ApprovalStatus;
  type: "MASTER" | "SECTION";
  fieldId?: string;
  approver: Owner;
  approverId?: string;
  approverName?: string;
  approverEmail?: string;
  approverGroups?: string[];
  documentRevision?: DocumentRevision;
  changeRequest?: ChangeRequest;
  reviewedAt?: string;
  assignedAt?: string;
  assigned: Partial<Employee>;
  partOf?: Partial<DocumentRevision> | Partial<ChangeRequest>;
}

export interface Id {
  id: string;
}

export interface DataProps<T> {
  dataProp: T;
}

export type RenderSize = "sm" | "md" | "lg";

export enum TypographySize {
  sm = "subtitle1",
  md = "h6",
  mdw = "h5",
  lg = "h4",
}

export enum TypographyColor {
  primary = "textPrimary",
  secondary = "textSecondary",
}

export interface TypographyProps {
  size: keyof typeof TypographySize;
  color: keyof typeof TypographyColor;
  variant: string;
}

export type Nullable<T> = T | null;
