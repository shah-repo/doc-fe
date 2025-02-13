import { ApprovalRole } from '../../../../../state/ducks/company/types';
import { Mode } from '../../../../components/KendoDataGrid/constants';
import { ColumnDefinition, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableApprovalRole extends ApprovalRole, EditableItem {}

interface SchemaOptions {
  onChange: (e: { dataItem: EditableApprovalRole }) => void
  onConfirm: () => void
  onDiscard: () => void
  mode?: Mode
}

export type SchemaBuilder = (options: SchemaOptions) => Array<ColumnDefinition<EditableApprovalRole>>;
