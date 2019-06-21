export interface PasswordFormValues {
  password: string;
}

export type Transition = "approve" | "reject" | "in_review" | "to_review" | "submitted" | "withdrawn" | "closed";