export enum ApprovalStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

export interface Owner {
  id: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Approval {
  id: string;
  status: ApprovalStatus;
  approver: Owner;
  reviewedAt?: string;
  active: boolean;
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
