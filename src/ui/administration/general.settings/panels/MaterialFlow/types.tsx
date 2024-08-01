import { Group } from '../../../../../state/ducks/auth/types';
import { CompanyLocation } from '../../../../../state/ducks/company/types';
import { MaterialFlowAclRule } from '../../../../../state/ducks/materialFlowAcl/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export type GroupOption = Pick<Group, 'id' | 'name'>;

export interface EditableMaterialFlowAclRule extends Omit<MaterialFlowAclRule, 'action' | 'from' | 'to' | 'groups'>, EditableItem {
  action?: MaterialFlowAclRule['action']
  from?: CompanyLocation
  to?: CompanyLocation
  groups?: GroupOption[]
}
