import { CompanyLocation, SystemTransactionsRule } from '../../../../../state/ducks/company/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export type LocationField = 'from' | 'to';

export interface EditableSystemTransactionsRule extends Omit<SystemTransactionsRule, LocationField>, EditableItem {
  from?: CompanyLocation
  to?: CompanyLocation
}
