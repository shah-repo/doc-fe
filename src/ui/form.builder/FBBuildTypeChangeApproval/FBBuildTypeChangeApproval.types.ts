import { FBAutocompleteAsyncProps, FBDialogState, FBFormState, FBInlineApprovalBody, FBInlineApprovalConstructor, FBInlineApprovalTransition, FBInputProps, FBRequiredApprover } from '..';
import { DocumentStatus } from '../../../state/ducks/documents/types';
import FBBuildTypeChangeApprovalState from './FBBuildTypeChangeApproval.state';

export enum FBBuildTypeChangeApprovalStatusEndpoint {
  APPROVE = 'approve',
  REJECT = 'reject',
  PENDING = 'pending',
  ABANDON = 'abandon',
}

export type FBBuildTypeChangeApprovalProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled' | 'value'>
& FBAutocompleteAsyncProps
& {
  onApproveClick?: (approvalId: string) => void
  requestApproval?: (id?: string) => any
  approvals?: FBInlineApprovalBody[]
  approvalsState?: FBBuildTypeChangeApprovalState
  approvalTransition: (transition: FBInlineApprovalTransition, approvalId?: string, password?: string) => void
  docId?: string
  documentStatus: DocumentStatus
  formState?: FBFormState
  groups?: Record<string, FBRequiredApprover>
  isIncluded?: (group: FBRequiredApprover) => boolean
  ownerId?: string
  currentUser?: string
  inlineApprovalExists?: boolean
  dialogState?: FBDialogState
  isAlphaReleased?: boolean
  owners?: Owner[]
  showFieldOwnersWarning?: boolean
  isContributorIncluded?: (id: string) => void
  approvalApprovedGroup?: string[]
};

export interface Owner {
  name: string
  id: string
}

export type FBBuildTypeChangeApprovalConstructor = FBInlineApprovalConstructor & {
  id: string[]
};
