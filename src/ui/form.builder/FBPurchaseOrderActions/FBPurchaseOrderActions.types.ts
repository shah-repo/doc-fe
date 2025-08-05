import { ButtonProps } from '@material-ui/core';
import { FBProviderProps } from '..';
import { ApprovalFailureResponse } from '../../documentRevision/forms/presenters/SubmitForApproval';
import { DialogHandler } from '../../hooks/useDialog';

export type FBPurchaseOrderActionsProps =
& Pick<FBProviderProps, 'purchaseOrderState'>
& {
  onAddClick?: ButtonProps['onClick']
  onCancelClick?: ButtonProps['onClick']
  dialog?: DialogHandler
  poLineAlertDialog?: DialogHandler
  poLineItemValidationErrorResponse?: ApprovalFailureResponse
  confirmPOLineAlert?: () => void
  onAlertNotificationCancel?: (e: React.MouseEvent<HTMLElement>) => void
  onAlertNotificationConfirm?: () => void
  isEdit?: boolean
};
