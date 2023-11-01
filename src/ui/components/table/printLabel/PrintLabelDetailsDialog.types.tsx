import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Employee } from '../../../../state/ducks/company/types';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { SelectOption } from '../../forms/fields/Select';

export interface PrintLabelDetailsDialogProps {
  onNumberOfLabelChange: (value: Number) => void
  openDialog: () => void
  closeDialog: () => void
  onQtyUnitsChange: (event: React.ChangeEventHandler<HTMLInputElement>, index: number) => void
  onSerialChange: (event: React.ChangeEventHandler<HTMLInputElement>) => void
  onPrintClick: () => void
  onDescriptionChange: (event: React.ChangeEventHandler<HTMLInputElement>) => void
  onActorChange: (event: React.ChangeEvent<{}>, value: SelectOption) => void
  isOpen: boolean
  companyEmployees: Employee[]
  selectedOption: SelectOption
  selectedNumberOfLabel: Number
  handleDateChange: MaterialUiPickersDate
  selectedDate: Date
  selectedItem: DocumentRevision
  initialValues: object
  qtyUnits: Array<String>
  serial: String
  description: String
}
