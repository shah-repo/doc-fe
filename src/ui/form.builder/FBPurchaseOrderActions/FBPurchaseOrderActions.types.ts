import { ButtonProps } from '@material-ui/core';
import { FBProviderProps } from '..';
import { DialogHandler } from '../../hooks/useDialog';

export type FBPurchaseOrderActionsProps =
& Pick<FBProviderProps, 'purchaseOrderState'>
& {
  onAddClick?: ButtonProps['onClick']
  onCancelClick?: ButtonProps['onClick']
  dialog?: DialogHandler
  onAlertNotificationCancel?: (e: React.MouseEvent<HTMLElement>) => void
  onAlertNotificationConfirm?: () => void
  isEdit?: boolean
};
