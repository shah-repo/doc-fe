import { Attachment } from '../../../state/ducks/attachments/types';
import { Employee } from '../../../state/ducks/company/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import FBAutocompleteAsyncState from '../FBAutocompleteAsync/FBAutocompleteAsync.state';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  employees: Employee[]
  documentOptions: DocumentOption[]
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: () => void
  onRowClick?: (e: TraineeEditEvent) => void
}

export type DocumentOption = Pick<DocumentRevision, 'id' | 'docId' | 'name' | 'displayRevision'> & { documentRevisions: DocumentRevision[] };

export type TraineeListProps =
& Pick<FBInputProps, 'name' | 'type' | 'label' | 'disabled'>
& {
  trainees: Trainee[]
  documentOptions: DocumentOption[]
  documentOptionsAsync: FBAutocompleteAsyncState
  updateTrainee: (item: Trainee) => void
  deleteTrainee: (item: Trainee) => void
};

export interface TraineeAttachment extends Attachment {}

export interface Trainee {
  id: string
  employee: {
    id: string
    name: string
  }
  trainingDocument: {
    docId: string
    documentId: string
    docRevId: string
  }
  trainingCompletionDate: string
  attachments: TraineeAttachment[]
  comments?: string
  createdAt: string
}

export interface EditableTrainee extends Trainee {
  [MODE_FIELD]: Mode
}

export interface TraineeEditEvent {
  dataItem: EditableTrainee
}

export interface CustomTemplateProps extends CellTemplateProps<EditableTrainee> {}
