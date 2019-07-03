export type Event = React.ChangeEvent<HTMLInputElement>;

export enum ApprovalStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

export interface User {
  id: string;
  email: string;
  name: string;
}
export interface Approval {
  id: string;
  status: ApprovalStatus;
  approver: User;
  reviewedAt?: string;
}

export interface Id {
  id: string;
}

