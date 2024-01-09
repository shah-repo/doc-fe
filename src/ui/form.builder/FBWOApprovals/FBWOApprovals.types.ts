import { FBApprovalsState, FBAutocompleteAsyncProps, FBDialogState, FBFormState, FBInlineApprovalBody, FBInputProps, FBRequiredApprover } from '..';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';

export enum FBWOApprovalsStatusEndpoint {
  APPROVE = 'approve',
  REJECT = 'reject',
  PENDING = 'pending',
  ABANDON = 'abandon',
}

export type FBWOApprovalsProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled' | 'value'>
& FBAutocompleteAsyncProps
& {
  onApproveClick?: (approvalId: string) => void
  approvals?: FBInlineApprovalBody[]
  approvalsState?: FBApprovalsState
  approvalTransition: (transition: FBWOApprovalsStatusEndpoint, approvalId?: string, password?: string) => void
  docId?: string
  documentStatus?: DocumentRevisionStatus
  formState?: FBFormState
  groups?: Record<string, FBRequiredApprover>
  ownerId?: string
  currentUser?: string
  dialogState?: FBDialogState
  owners?: Owner[]
};

interface Owner {
  name: string
  id: string
}
