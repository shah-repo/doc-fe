import { EquipmentLocation } from '../../../../../state/ducks/company/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableEquipmentLocation extends EquipmentLocation, EditableItem {
}
