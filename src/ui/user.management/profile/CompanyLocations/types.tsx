import { CompanyLocation } from '../../../../state/ducks/company/types';
import { MODE_FIELD, Mode } from './constants';

export interface Props {
  canUpdateCompany?: boolean
  locations?: CompanyLocation[]
}

export interface EditableCompanyLocation extends CompanyLocation {
  [MODE_FIELD]: Mode
}
