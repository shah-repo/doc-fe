import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import { DialogProps } from './Dialog.types';

export interface AlertDialogProps extends Omit<DialogProps, 'open'> {
  handler: DialogHandler
  title?: Translation
  warning?: boolean
  hideCancelButton?: boolean
}
