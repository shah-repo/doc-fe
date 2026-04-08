import React from 'react';
import { FBAutocompleteAsyncProps, FBDialogState, FBInlineApprovalTransition } from '..';
import { DocumentStatus } from '../../../state/ducks/documents/types';
import { LHRBuild } from '../../administration/general.settings/panels/LHRBuild/types';
import { ApprovalValidationError } from '../FBBuildTypeChangeApproval/FBBuildTypeChangeApproval.types';

export type FBBuildTypeProps = FBAutocompleteAsyncProps & {
  selectedValue?: LHRBuild
  defaultValue?: LHRBuild
  prevValue?: LHRBuild
  options?: LHRBuild[]
  isDialogOpen?: boolean
  isApprovalDialogOpen?: boolean
  onChange?: (event: React.ChangeEvent<{}>, inputValue: string) => void
  onDialogActionClick?: (action: 'cancel' | 'confirm') => void
  onApprovalDialogActionClick?: (action: 'cancel' | 'confirm') => void
  refresh?: boolean
  isDisabled?: boolean
  documentStatus: DocumentStatus
  approvalTransition: (transition: FBInlineApprovalTransition, approvalId?: string, password?: string) => void
  showApprovalButtons?: boolean
  onApprovalAction?: (action: 'accept' | 'reject') => void
  dialogState?: FBDialogState
  allowedBuildTypeChange?: string[]
  lhrBuildTypeSwitchConfigApproval?: Array<{ from: string, to: string }>
  submitApproversRef?: React.MutableRefObject<(() => void) | null>
  validateApproversRef?: React.MutableRefObject<(() => ApprovalValidationError | null) | null>
};
