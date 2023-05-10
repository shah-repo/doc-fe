import { DocumentRevisionFormProps, SMProviderProps } from '../../../../..';

export type DocumentRevisionHeaderProps =
& Pick<DocumentRevisionFormProps, 'bannerPortal' | 'shouldShowUpgrade'>
& Pick<SMProviderProps, '_documentRevisionFormState'>
& {
  documentRevisionId?: string
  setDoNotPrompt?: (value: boolean) => void
};
