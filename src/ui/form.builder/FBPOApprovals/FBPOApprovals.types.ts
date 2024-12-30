import { FBApprovalsStatusEndpoint, FBAutocompleteAsyncProps, FBDialogState, FBInlineApprovalBody, FBInlineApprovalConstructor, FBInputProps, FBPOApprovalsState, FBRequiredApprover, Owner } from '..';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { IApprovalErrorResponse } from '../../documentRevision/forms/presenters/SubmitForApproval';
import { Dialog } from '../../hooks/useDialog';

export type FBPOApprovalsProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled' | 'value'>
& FBAutocompleteAsyncProps
& {
  approvalTransition: (transition: FBApprovalsStatusEndpoint, approvalId?: string, password?: string) => void
  isIncluded?: (group: FBRequiredApprover) => void
  onApproveClick?: (approvalId: string) => void
  approvals?: FBInlineApprovalBody[]
  poApprovalsState?: FBPOApprovalsState
  docId?: string
  groups?: Record<string, FBRequiredApprover>
  checkedGroups?: any[]
  owners?: Owner[]
  currentUser?: string
  documentStatus?: DocumentRevisionStatus
  dialogState?: FBDialogState
  disableChipDelete?: boolean
  errorResponse?: IApprovalErrorResponse
  supplierStatusDialog?: Dialog
};

export type FBPOApprovalsConstructor = FBInlineApprovalConstructor & {
  id?: string[]
};

export interface FBPOInlineApprovalUpdateBody {
  signatureGroupName: string
}
