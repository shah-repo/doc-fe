import { ChangeRequestStatus } from '../../../../../state/ducks/changeRequest/types';
import { User } from '../../../../../state/ducks/common/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EmployeeResponse extends User{
  employeeId: string
  comment: string
  status: string
  attachmentId: string
  updatedAt: string
}
export interface TasksListItem {
  taskId: string
  number: string
  instruction: string
  employeeResponse: EmployeeResponse[]
}

export interface TasksListEditRequestBody {
  employeeIds: string[]
  instruction: string
  partOf: string
}

export interface EditableTLItem extends TasksListItem {
  [MODE_FIELD]: Mode
}

export interface TLItemEditEvent {
  dataItem: EditableTLItem
}

export interface SchemaOptions {
  actionsClass: string
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  isDisabled: boolean
  currentState?: ChangeRequestStatus
  onRowClick?: (e: TLItemEditEvent) => void
  employeeCommentUpdates: (taskId: string, employeeResponse: EmployeeResponse[]) => void
  employeeStatusUpdates: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
  employeeEvidenceUpdates: (dataItem: TasksListItem, employeeId: string, attachmentId: string) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableTLItem> {
  onClick?: (e: TLItemEditEvent) => void
  isDisabled?: boolean
  currentState?: ChangeRequestStatus
  employeeCommentUpdates?: (taskId: string, employeeResponse: EmployeeResponse[]) => void
  employeeStatusUpdates?: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
  employeeEvidenceUpdates?: (dataItem: TasksListItem, employeeId: string, attachmentId: string) => void
}
