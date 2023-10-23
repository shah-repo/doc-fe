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
  onRowClick?: (e: TLItemEditEvent) => void
  employeeCommentUpdates: (taskId: string, employeeResponse: EmployeeResponse[]) => void
  employeeStatusUpdates: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableTLItem> {
  onClick?: (e: TLItemEditEvent) => void
  employeeCommentUpdates?: (taskId: string, employeeResponse: EmployeeResponse[]) => void
  employeeStatusUpdates?: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
}
