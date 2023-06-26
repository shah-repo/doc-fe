import { FBApprovalsProps, FBEmployee, FBGroup, FBId, FBInlineApprovalRole, FBInputProps, FBProviderProps } from '..';
import { Approval } from '../../../state/ducks/common/types';

export interface FBInlineApprovalValue {
  approvers?: string[] | FBEmployee[]
  groups?: string[] | FBGroup[]
  roles?: string[] | FBInlineApprovalRole[]
  isApproved?: boolean
}

export type FBInlineApprovalProps =
& Omit<FBInputProps, 'editorConfig'>
& Pick<FBProviderProps, 'inlineApprovalState' | 'dialogState'>
& Pick<FBApprovalsProps, 'approvalTransition'>
& {
  // Please use one method definition and pick it from the type directly to avoid multi changes
  // approvalTransition?: (transition: FBInlineApprovalTransition, id?: string) => any;
  requestAllApprovals?: (id?: string) => any
  onApproveClick?: (approvalId: string) => void
  editorConfig?: FBInlineApprovalValue
  approvals?: FBInlineApprovalBody[]
  currentUser?: string
  isApproved?: boolean
  isPreview?: boolean
  isOutput?: boolean
  shouldShowApprovals?: boolean
  shouldShowRequestAllApprovals?: boolean
};

export type FBInlineApprovalOptions = FBEmployee & {
  listGroup: string
};

type FBInlineApprovalType = 'MASTER' | 'SECTION';
type FBInlineApprovalStatus = 'DRAFT' | 'PENDING' | 'ABANDONED' | 'APPROVED' | 'REJECTED';
export type FBInlineApprovalTransition = 'abandon' | 'pending' | 'approve' | 'reject' | 'pending_by_field';

export enum FBInlineApprovalStatusIdent {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ABANDONED = 'ABANDONED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type FBInlineApprovalBody =
& Omit<Approval, 'status' | 'assigned' | 'type' | 'partOf' | 'fieldId'>
& {
  reviewedAt?: string
  id?: string
  assigned?: FBId
  type: FBInlineApprovalType
  fieldId: string
  partOf: FBId
  status?: FBInlineApprovalStatus
  approver?: FBEmployee
  approverId?: string
  approverName?: string
  approverEmail?: string
  approverGroup?: string[]
  canRequest?: boolean
  signatureGroupName?: string
  poDocId?: string
  poDocRevision?: string
};

export interface FBInlineApprovalTransitionBody {
  password?: string
}

export interface FBRequestApprovalTransitionBody {
  docRev: FBId
}

export interface FBInlineApprovalConstructor {
  approvals?: FBInlineApprovalBody[]
  isOwner?: boolean
}
