import { GridProps } from '@progress/kendo-react-grid';
import { FormikContextType } from 'formik';
import { EditableCompanyLocation } from '../../user.management/profile/CompanyLocations/types';
import { ColumnDefinition } from '../KendoDataGrid/KendoDataGrid.types';
import { EquipmentLocation } from '../../../state/ducks/company/types';
import { Mode, MODE_FIELD } from '../KendoDataGrid/constants';

export interface LocationProps {
  formik: FormikContextType<any>
  locationsList: EditableCompanyLocation[]
  schema: Array<ColumnDefinition<EditableCompanyLocation>>
  editedLocation?: EditableCompanyLocation
  addLocation: () => void
  onRowClick?: GridProps['onRowClick']
  isActive?: boolean
}

export interface EditableLocation extends EquipmentLocation {
  [MODE_FIELD]: Mode
}
