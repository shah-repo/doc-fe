import { ApprovalRoles } from '../../../../../state/ducks/company/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableApprovalRoles extends ApprovalRoles, EditableItem {
}
