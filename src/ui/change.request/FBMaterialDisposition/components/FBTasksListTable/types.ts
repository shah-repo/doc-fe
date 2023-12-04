import { Attachment } from '../../../../../state/ducks/attachments/types';
import { ChangeRequestStatus } from '../../../../../state/ducks/changeRequest/types';
import { User } from '../../../../../state/ducks/common/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EmployeeResponse extends User{
  employeeId: string
  comment: string
  status: string
  attachments: Attachment[]
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
  partOfId: string
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
  employeeStatusUpdates: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
  employeeEvidenceUpdates: (dataItem: TasksListItem, employeeId: string, attachmentIds: Attachment[]) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableTLItem> {
  onClick?: (e: TLItemEditEvent) => void
  isDisabled?: boolean
  currentState?: ChangeRequestStatus
  employeeStatusUpdates?: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
  employeeEvidenceUpdates?: (dataItem: TasksListItem, employeeId: string, attachmentIds: Attachment[]) => void
}
