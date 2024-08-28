import { ZebraPrintSettings } from '../../../../../state/ducks/company/types';
import { EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditablePrinter extends EditableItem, ZebraPrintSettings {
  active: boolean
  _id: string
}
