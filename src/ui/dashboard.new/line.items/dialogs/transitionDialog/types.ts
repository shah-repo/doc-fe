export interface PasswordFormValues {
  password: string
}
export type Transition =
  | 'approve'
  | 'reject'
  | 'in_review'
  | 'to_review'
  | 'submitted'
  | 'withdrawn'
  | 'closed'
  | 'pending_submission'
  | 'to_review'
  | 'withdraw'
  | 'complete';

export const APPROVE = 'approve';
export const REJECT_WITH_PASSWORD = 'reject_with_password';
export const ACCEPT = 'accept';
const REJECT = 'reject';

export type ApprovalAction = typeof ACCEPT | typeof REJECT;
