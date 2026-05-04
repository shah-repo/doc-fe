import { SortDescriptor } from '@progress/kendo-data-query';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableSerialNumber, SerialNumberUpdateData, SerialNumberUpdatePayload } from '../FBSerials/types';

export type SerialNumberSortDescriptor = SortDescriptor & {
  compare?: (first: EditableSerialNumber, second: EditableSerialNumber) => number
};

export interface TableCellProps extends Omit<CellTemplateProps<EditableSerialNumber>, 'onChange'> {
  isTableDisabled?: boolean
}

export interface FBSerialsTableProps {
  serialNumbers: EditableSerialNumber[]
  isDisabled?: boolean
  isPartSerializationManual?: boolean
  isLoading?: boolean
  toolbarRef?: React.RefObject<HTMLDivElement>
  onAdd?: () => void
  onUpdate?: (id: string, data: SerialNumberUpdateData) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onBulkUpdate?: (payload: SerialNumberUpdatePayload[]) => Promise<void>
  onBulkDelete?: (ids: string[]) => Promise<void>
}
