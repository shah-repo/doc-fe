import { EquipmentLocation, EquipmentStatuses } from '../../../../../state/ducks/company/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableEquipmentLocation extends EquipmentLocation, EditableItem {
}

export interface EditableEquipmentStatuses extends EquipmentStatuses, EditableItem {
}
