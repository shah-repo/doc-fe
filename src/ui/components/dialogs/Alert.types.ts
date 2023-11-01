import { DialogHandler } from '../../hooks/useDialog';
import { DialogProps } from './Dialog.types';

export interface AlertDialogProps extends Omit<DialogProps, 'open'> {
  handler: DialogHandler
}
