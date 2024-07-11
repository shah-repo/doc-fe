import { GridProps } from '@progress/kendo-react-grid';
import { FormikContextType } from 'formik';
import { EquipmentLocation } from '../../../../../state/ducks/company/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableCompanyLocation } from '../../panels/CompanyLocations/types';

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
