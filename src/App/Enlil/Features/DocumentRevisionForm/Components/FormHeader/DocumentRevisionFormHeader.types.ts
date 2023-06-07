import { SMProviderProps } from '../../../../..';
import { DocumentCloneType } from '../../../../../../ui/documentRevision/Clone.container';

export type DocumentRevisionFormHeaderProps =
& Pick<SMProviderProps, '_documentRevisionFormState'>
& {
  isDisabledInput?: boolean
  type?: DocumentCloneType
  documentTypeId?: string
};
