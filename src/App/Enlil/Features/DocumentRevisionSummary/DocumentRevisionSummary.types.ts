import { DocumentRevisionFormProps, SMFormHOCProps, SMTabsHOCProps } from '../../..';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';

export type DocumentRevisionSummaryProps =
& SMFormHOCProps
& SMTabsHOCProps
& Pick<Partial<DocumentRevisionFormProps>,
| 'onScroll'
| '_documentRevisionFormState'
| 'schema'>
& {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  isFB?: boolean;
  isSideBarHidden?: boolean;
};

