import { Attachment } from '../../../state/ducks/attachments/types';
import { ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { Employee } from '../../../state/ducks/company/types';
import { DocumentRevision, DocumentRevisionDocument } from '../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  statuses: string[]
  primaryOwners: Employee[]
  trainees: Trainee[]
  isActive: boolean
  isInEditMode: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: () => void
  isDisabled: boolean
  records: DocumentRevisionOption[]
  currentState?: ChangeRequestStatus
  onRowClick?: (e: TraineeEditEvent) => void
  onPrimaryChange?: (id: string) => void
  employeeEvidenceUpdates: (dataItem: Trainee, employeeId: string, attachmentIds: Attachment[]) => void
}

type Document = Pick<DocumentRevisionDocument, 'id' | 'docId'>;

export type DocumentRevisionOption =
& Pick<DocumentRevision, 'id' | 'docId' | 'name' | 'status' | 'displayRevision'>
& {
  document: Document
};

export type TraineeListProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  trainees: Trainee[]
  documentOptions: DocumentRevisionOption[]
  updateTrainee: (item: Trainee) => void
  deleteTrainee: (item: Trainee) => void
};

export interface Trainee {
  id: string
  userId: string
  docId: string
  date: string
  attachments: any
  comments?: string
}

export interface EditableTrainee extends Trainee {
  [MODE_FIELD]: Mode
}

export interface TraineeEditEvent {
  dataItem: EditableTrainee
}

export interface CustomTemplateProps extends CellTemplateProps<EditableTrainee> {}
