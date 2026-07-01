export interface PasswordFormValues {
  password: string
  comment?: string
}
export type Transition =
  | 'approve'
  | 'reject'
  | 'in_review'
  | 'reject_with_password'
  | 'to_review'
  | 'submitted'
  | 'withdrawn'
  | 'closed'
  | 'pending_submission'
  | 'to_review'
  | 'withdraw'
  | 'complete';
