import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Employee, LabelTemplatesProps } from '../../../../state/ducks/company/types';
import { DocumentRevision, Reference } from '../../../../state/ducks/documentRevisions/types';
import { SelectOption } from '../../forms/fields/Select';

interface InitialValuesProps {
  partId: string
  revision: string
  lotId: string
}

export interface ResponseData {
  referenceTo: Reference[]
  documentId: string
  id: string
}

export interface PrintLabelDetailsDialogProps {
  onNumberOfLabelChange?: (value: number) => void
  openDialog?: () => void
  closeDialog: () => void
  onQtyUnitsChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => void
  onSerialChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onPrintClick?: () => void
  onDescriptionChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onActorChange?: (event: React.ChangeEvent<{}>, value: SelectOption) => void
  onPrinterChange?: (event: React.ChangeEvent<{}>, value: SelectOption) => void
  onLabelTypeChange?: (event: React.ChangeEvent<{}>, value: SelectOption) => void
  onFieldCheck?: () => void
  isOpen: boolean
  companyEmployees?: Employee[]
  selectedOption?: SelectOption
  selectedNumberOfLabel?: number
  handleDateChange?: (date: MaterialUiPickersDate) => void
  selectedDate?: Date
  selectedItem?: DocumentRevision
  initialValues?: InitialValuesProps
  qtyUnits?: string[]
  serial?: string
  description?: string
  selectedParams?: string[]
  labelTypeData?: LabelTemplatesProps[]
  printerSerial?: string
  labelTemplate?: string
  showError?: boolean
}
