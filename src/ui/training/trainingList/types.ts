import { Attachment } from '../../../state/ducks/attachments/types';
import { ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { Employee } from '../../../state/ducks/company/types';
import { DocumentRevision, DocumentRevisionDocument } from '../../../state/ducks/documentRevisions/types';
import { EmployeeResponse } from '../../change.request/FBMaterialDisposition/components/FBTasksListTable/types';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../../form.builder/FBInput/FBInput.types';
import { BUILD_FIELD, DATE_FIELD, EMPLOYEE_FIELD, REFERENCE_FIELD } from './constants';

export interface SchemaOptions {
  statuses: string[]
  primaryOwners: Employee[]
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

export enum TrainingType {
  Self = 'self',
  ClassRoom='classRoom',
  Job='job',
}

export enum Currency {
  USD = 'USD',
}

type Document = Pick<DocumentRevisionDocument, 'id' | 'docId'>;

export type DocumentRevisionOption =
& Pick<DocumentRevision, 'id' | 'docId' | 'name' | 'status' | 'displayRevision'>
& {
  document: Document
};

export type TrainingListTableProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  parentDocumentRevision: DocumentRevision
  trainees: Trainee[]
  statuses: string[]
  records: DocumentRevisionOption[]
  updateTrainee: (item: Trainee) => void
  deleteTrainee: (item: Trainee) => void
  setPrimaryTrainee: (id: string) => void
};

export type UseOptionsHook = (trainingList: Trainee[]) => {
  statuses: string[]
};

export interface Trainee {
  id: string
  name: string
  trainee: Trainee
  trainingType: TrainingType
  status?: string
  reference?: { id: string, docId: string }
  date: string
  comments?: string
}

export interface EditableTrainee extends Trainee {
  [MODE_FIELD]: Mode
  [EMPLOYEE_FIELD]: string
  [BUILD_FIELD]: string
  [REFERENCE_FIELD]: string
  [DATE_FIELD]: string
}

export interface TraineeEditEvent {
  dataItem: EditableTrainee
}

type TraineeOptionDocument = Pick<DocumentRevisionDocument, 'id' | 'docId' >;

export type TraineeOption =
& Pick<DocumentRevision, 'id' | 'docId' | 'name' | 'displayStatus' | 'displayRevision'>
& {
  document: TraineeOptionDocument
  isUnselectable?: boolean
};

export interface CustomTemplateProps extends CellTemplateProps<EditableTrainee> {
  onClick?: (e: TraineeEditEvent) => void
  isDisabled?: boolean
  currentState?: ChangeRequestStatus
  employeeStatusUpdates?: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
  employeeEvidenceUpdates?: (dataItem: Trainee, employeeId: string, attachmentIds: Attachment[]) => void
}
