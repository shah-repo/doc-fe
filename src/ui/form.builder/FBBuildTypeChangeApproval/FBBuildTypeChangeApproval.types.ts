import { FBApprovalsProps, FBBuildTypeChangeApprovalRole, FBEmployee, FBGroup, FBId, FBInputProps, FBProviderProps } from '..';
import { Approval } from '../../../state/ducks/common/types';

export interface FBBuildTypeChangeApprovalValue {
  approvers?: string[] | FBEmployee[]
  groups?: string[] | FBGroup[]
  roles?: string[] | FBBuildTypeChangeApprovalRole[]
  isApproved?: boolean
}

export type FBBuildTypeChangeApprovalProps =
& Omit<FBInputProps, 'editorConfig'>
& Pick<FBProviderProps, 'buildTypeChangeApprovalState' | 'dialogState'>
& Pick<FBApprovalsProps, 'approvalTransition'>
& {
  // Please use one method definition and pick it from the type directly to avoid multi changes
  // approvalTransition?: (transition: FBBuildTypeChangeApprovalTransition, id?: string) => any;
  requestAllApprovals?: (id?: string) => any
  onApproveClick?: (approvalId: string) => void
  editorConfig?: FBBuildTypeChangeApprovalValue
  approvals?: FBBuildTypeChangeApprovalBody[]
  currentUser?: string
  isApproved?: boolean
  isPreview?: boolean
  isOutput?: boolean
  shouldShowApprovals?: boolean
  shouldShowRequestAllApprovals?: boolean
};

export type FBBuildTypeChangeApprovalOptions = FBEmployee & {
  listGroup: string
};

type FBBuildTypeChangeApprovalType = 'MASTER' | 'SECTION';
type FBBuildTypeChangeApprovalStatus = 'DRAFT' | 'PENDING' | 'ABANDONED' | 'APPROVED' | 'REJECTED';
export type FBBuildTypeChangeApprovalTransition = 'abandon' | 'pending' | 'approve' | 'reject' | 'pending_by_field';

export enum FBBuildTypeChangeApprovalStatusIdent {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ABANDONED = 'ABANDONED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export type FBBuildTypeChangeApprovalBody =
& Omit<Approval, 'status' | 'assigned' | 'type' | 'partOf' | 'fieldId'>
& {
  reviewedAt?: string
  id?: string
  assigned?: FBId
  type: FBBuildTypeChangeApprovalType
  fieldId: string
  partOf: FBId
  status?: FBBuildTypeChangeApprovalStatus
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

export interface FBBuildTypeChangeApprovalTransitionBody {
  password?: string
}

export interface FBRequestApprovalTransitionBody {
  docRev: FBId
}

export interface FBBuildTypeChangeApprovalConstructor {
  approvals?: FBBuildTypeChangeApprovalBody[]
  isOwner?: boolean
}
