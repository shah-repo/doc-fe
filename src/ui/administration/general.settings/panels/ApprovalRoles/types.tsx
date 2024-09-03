import { ApprovalRole } from '../../../../../state/ducks/company/types';
import { ColumnDefinition, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export interface EditableApprovalRoles extends ApprovalRole, EditableItem {}

interface SchemaOptions {
  onChange: () => void
  onConfirm: () => void
  onDiscard: () => void
}

export type SchemaBuilder = (options: SchemaOptions) => Array<ColumnDefinition<EditableApprovalRoles>>;
