import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { AlternatePartEditEvent, EditableAlternatePart } from '../treelist/interface';

export interface CustomTemplateProps extends CellTemplateProps<EditableAlternatePart> {
  onClick?: (event: AlternatePartEditEvent) => void
}
