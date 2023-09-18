import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Employee } from '../../../../state/ducks/company/types';
import { SelectOption } from '../../forms/fields/Select';

export interface PrintLabelDetailsDialogProps {
  setSelectedOption: React.Dispatch<React.SetStateAction<SelectOption | undefined>>
  onNumberOfLabelChange: (value: string) => void
  openDialog: () => void
  closeDialog: () => void
  onQtyUnitsChange: (event: any, index: number) => void
  onSerialChange: () => void
  onPrintClick: () => void
  onDescriptionChange: (event: any) => void
  isOpen: boolean
  companyEmployees: Employee[]
  selectedOption: SelectOption
  selectedNumberOfLabel: SelectOption
  handleDateChange: MaterialUiPickersDate
  selectedDate: Date
  selectedItem: object
  initialValues: object
  qtyUnits: Array<String>
  serial: String
  description: String
}
