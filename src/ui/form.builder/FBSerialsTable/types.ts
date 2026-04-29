import { SortDescriptor } from '@progress/kendo-data-query';
import { EditableSerialNumber, SerialNumber, SerialNumberUpdateData, SerialNumberUpdatePayload } from '../FBSerials/types';

export type SerialNumberSortDescriptor = SortDescriptor & {
  compare?: (first: EditableSerialNumber, second: EditableSerialNumber) => number
};

export interface FBSerialsTableProps {
  serialNumbers: SerialNumber[]
  isPartSerializationManual?: boolean
  isLoading?: boolean
  toolbarRef?: React.RefObject<HTMLDivElement>
  onAdd?: () => void
  onUpdate?: (id: string, data: SerialNumberUpdateData) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onBulkUpdate?: (payload: SerialNumberUpdatePayload[]) => Promise<void>
  onBulkDelete?: (ids: string[]) => Promise<void>
}
