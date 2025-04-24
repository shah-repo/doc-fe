import { ChangeEvent, ChangeEventHandler, MouseEvent, ReactElement } from 'react';
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

export interface Page {
  skip: number
  pageNumber: number
  take: number
}

export interface SchemaOptions {
  scanId: string
  rowCount: number
  numSelected: number
  handlePopoverClose: () => void
  handlePopoverOpen: (event: MouseEvent<HTMLDivElement>, content: ReactElement) => void
  handleHeaderCheckedChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleRequestSort: (event: ChangeEventHandler, property: string) => void
  onDataItemExpanded?: (dataItem: ISupplierScanResultRev) => void
}

export interface CustomTemplateProps extends CellTemplateProps<ISupplierScanResultRev> {
  handlePopoverOpen?: (event: MouseEvent<HTMLDivElement>, content: ReactElement) => void
  handlePopoverClose?: () => void
}
