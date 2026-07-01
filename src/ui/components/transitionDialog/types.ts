export interface PasswordFormValues {
  password: string
}

export type Transition = 'approve' | 'reject' | 'reject_with_password' | 'in_review' | 'to_review' | 'submitted' | 'withdrawn' | 'closed' | 'pending_submission' | 'to_review' | 'withdraw' | 'complete';

export enum TransitionIdent {
  ABANDON = 'abandon',
  PENDING = 'pending',
  APPROVE = 'approve',
  REJECT = 'reject',
  CLOSED = 'closed',
  PENDING_BY_FIELD = 'pending_by_field',
  REJECT_WITH_PASSWORD = 'reject_with_password',
}
