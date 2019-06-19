export interface PasswordFormValues {
  password: string;
}

export type Transition = "approve" | "reject" | "to_review" | "withdraw" | "pending_submission";