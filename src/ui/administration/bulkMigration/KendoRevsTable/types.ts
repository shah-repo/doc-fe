import { ChangeEvent } from 'react';
import { Attachment } from '../../../../state/ducks/attachments/types';
import { User } from '../../../../state/ducks/common/types';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { ISupplierScanResultRev } from '../interface';

export interface EmployeeResponse extends User{
  employeeId: string
  comment: string
  status: string
  attachments: Attachment[]
  updatedAt: string
}

export interface TasksListEditRequestBody {
  employeeIds: string[]
  instruction: string
  partOfId: string
}

// export interface EditableDocumentItem extends ISupplierScanResultRev {
//   [MODE_FIELD]: Mode
// }

// export interface TLItemEditEvent {
//   dataItem: EditableDocumentItem
// }

export interface SchemaOptions {
  isDisabled: boolean
  isClosed: boolean
  rowCount: number
  numSelected: number
  handleHeaderCheckedChange: (event: ChangeEvent<HTMLInputElement>) => void
  // employeeStatusUpdates: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
  // employeeEvidenceUpdates: (dataItem: ISupplierScanResultRev, employeeId: string, attachmentIds: Attachment[]) => void
}

export interface CustomTemplateProps extends CellTemplateProps<ISupplierScanResultRev> {
  isDisabled?: boolean
  isClosed?: boolean
  // employeeStatusUpdates?: (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => void
  // employeeEvidenceUpdates?: (dataItem: ISupplierScanResultRev, employeeId: string, attachmentIds: Attachment[]) => void
}
