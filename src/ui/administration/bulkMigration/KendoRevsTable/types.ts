import { ChangeEvent, ChangeEventHandler, MouseEvent, ReactElement } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { ISupplierScanResultRev } from '../interface';

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
