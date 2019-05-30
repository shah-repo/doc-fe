export enum ApprovalStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

export interface User {
  id: string;
  email: string;
}
export interface Approval {
  id: string;
  status: ApprovalStatus;
  approver: User;
  reviewedAt?: string;
}