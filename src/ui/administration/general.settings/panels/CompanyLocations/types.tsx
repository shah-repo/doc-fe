import { CompanyLocation } from '../../../../../state/ducks/company/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableCompanyLocation extends CompanyLocation, EditableItem {
}
