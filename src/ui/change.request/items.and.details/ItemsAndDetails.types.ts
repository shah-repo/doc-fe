import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import { DOC_TYPE_GROUP } from '../../../state/ducks/documentRevisions/documentType/types';
import { AsyncActionPayload } from '../../../state/types';
import { FBWorkspaceMode } from '../../form.builder';

export interface FBDocumentRevisionResponse {
  createdAt: string
  updatedAt: string
  displayRevision: string
  id: string
  name: string
  document: {
    docId: string
    id: string
    documentType: {
      group: DOC_TYPE_GROUP
      id: string
    }
  }
}

interface WhereUsed {
  name: string
  parentDocId: string
  depth: number
  revision: string
  status: string
}

export interface FBDocumentRevisionsValue {
  id: string
  autoUpdate: boolean
  proposedDocumentRevision: {
    id: string
  }
  justificationOfChange: string
  descriptionOfChange: string
  revisionFormTo?: string
  whereUsedView?: WhereUsed[]
}

export interface ApprovalRequestGridItem {
  revision: string
  id: string
  docRevId: string
  documentId: string
  autoUpdate: boolean
  justificationOfChange: string
  descriptionOfChange: string
  titleText: string
  displayRevision: string
  isPart: boolean
  revisionFormTo?: string
  whereUsedView?: WhereUsed[]
}

export interface ItemsAndDetailsWrapperProps {
  currentDocRevId?: string
  changeRequest?: ChangeRequest
  autosave?: boolean
  mode: FBWorkspaceMode
  asyncState?: AsyncActionPayload
  initialValues?: Record<string, any>
}
