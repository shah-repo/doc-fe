import { Group } from '../../../../../state/ducks/auth/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export type GroupOption = Pick<Group, 'id' | 'name'>;

export interface LHRBuildTypeSwitchConfigApproval {
  id: string
  from?: string
  to?: string
  approvalGroups: GroupOption[]
}

export interface EditableLHRBuildSwitch extends LHRBuildTypeSwitchConfigApproval, EditableItem {
}
