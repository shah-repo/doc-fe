import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Employee } from '../../../../state/ducks/company/types';
import { SelectOption } from '../../forms/fields/Select';

export interface PrintLabelDetailsDialogProps {
  setSelectedOption: React.Dispatch<React.SetStateAction<SelectOption | undefined>>
  openDialog: () => void
  closeDialog: () => void
  onQtyUnitsChange: (event: any, index: number) => void
  onLabelsToPrintChange: (event: any) => void
  onSerialChange: () => void
  onPrintClick: () => void
  onDescriptionChange: (event: any) => void
  isOpen: boolean
  companyEmployees: Employee[]
  selectedOption: SelectOption
  handleDateChange: MaterialUiPickersDate
  selectedDate: Date
  selectedItem: object
  initialValues: object
  labelsToPrint: number
  qtyUnits: Array<String>
  serial: String
  description: String
}
