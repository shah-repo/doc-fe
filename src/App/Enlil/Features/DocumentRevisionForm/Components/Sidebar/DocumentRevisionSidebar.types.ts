import { IntlShape } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { DocumentRevisionFormProps, DocumentRevisionFormStateProps, SMProviderProps } from '../../../../..';
import { TabInfo } from '../../../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, FBDocumentRevisionProps } from '../../../../../../state/ducks/documentRevisions/types';

export type DocumentRevisionSidebarProps =
& RouteComponentProps
& Pick<SMProviderProps, '_documentRevisionFormState' | '_documentRevisionSidebarState'>
& Pick<DocumentRevisionFormProps, 'documentRevisions'>
& Pick<Partial<DocumentRevisionFormStateProps>, 'documentTypeId' | 'documentId' | 'docId'>
& {
  intl?: IntlShape
  docRevsWithoutCanceled?: DocumentRevision[]
  documentRevisionId?: string
  isInlineApproval?: boolean
  isRecord?: boolean
  selectedDocument?: DocumentRevision
  canAccess?: boolean
  showFormMigration?: boolean
  formDocument?: FBDocumentRevisionProps
  tabConfig: TabInfo[]
  isNewOutput?: boolean
  title?: string
  canEdit?: boolean
  isSliderView?: boolean
};

export interface DocumentRevisionSidebarStateProps {
  setOpen: () => void
  setTitle: (title: string) => void
  open: boolean
  title: string
}
