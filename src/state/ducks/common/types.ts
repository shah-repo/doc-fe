
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
  active: boolean;
}

export interface Id {
  id: string;
}

export interface DataProps<T> {
  dataProp: T;
}
