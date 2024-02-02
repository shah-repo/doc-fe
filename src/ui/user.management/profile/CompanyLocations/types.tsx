import { CompanyLocation } from '../../../../state/ducks/company/types';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';

export interface Props {
  isActive?: boolean
  locations?: CompanyLocation[]
}

export interface EditableCompanyLocation extends CompanyLocation {
  [MODE_FIELD]: Mode
}
