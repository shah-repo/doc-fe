import { CompanyLocation } from '../../../../../state/ducks/company/types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';

export interface EditableCompanyLocation extends CompanyLocation {
  [MODE_FIELD]: Mode
}
