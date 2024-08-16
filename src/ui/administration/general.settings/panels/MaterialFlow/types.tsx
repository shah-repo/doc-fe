import { Group } from '../../../../../state/ducks/auth/types';
import { CompanyLocation } from '../../../../../state/ducks/company/types';
import { MaterialFlowAclRule } from '../../../../../state/ducks/materialFlowAcl/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { LocationField } from '../SystemTransactions/types';

export type GroupOption = Pick<Group, 'id' | 'name'>;

export interface EditableMaterialFlowAclRule extends Omit<MaterialFlowAclRule, LocationField | 'action' | 'groups'>, EditableItem {
  action?: MaterialFlowAclRule['action']
  from?: CompanyLocation
  to?: CompanyLocation
  groups: GroupOption[]
}
