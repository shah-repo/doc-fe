import { ActiveDropdown } from '../../components/common/kendo.column.templates/ActiveDropdown';
import { CustomGridCellProps } from '../../components/common/kendo/types';
import { CheckboxCell } from './column.templates/Checkbox';
import { FieldsConfig } from './column.templates/FieldsConfig';
import { IntegerNumberCell } from './column.templates/IntegerNumberCell';
import { Schema } from './column.templates/Schema';
import { EditDropdownCellFormatter } from './filter.template/CommonCellDropdownFilterTemplate';

export enum DTMCellTemplates {
  DROPDOWN_FILTER_CELL = 'DropdownFilterCellTemplate',
  ACTIVE_CELL='ActiveDropdown',
  CHECKBOX_CELL='CheckboxCell',
  REVISION_STAGE='EditDropdownCellFormatter',
  SCHEMA='Schema',
  FIELDS_CONFIG='FieldsConfig',
  INTEGER_NUMBER_CELL='IntegerNumberCell',
}
interface CellTemplateProps {
  ActiveDropdown: (props: CustomGridCellProps) => JSX.Element | null
  CheckboxCell: (props: CustomGridCellProps) => JSX.Element | null
  EditDropdownCellFormatter: (props: CustomGridCellProps) => JSX.Element | null
  Schema: (props: CustomGridCellProps) => JSX.Element | null
  FieldsConfig: (props: CustomGridCellProps) => JSX.Element | null
  IntegerNumberCell: (props: CustomGridCellProps) => JSX.Element | null
}
export const DTMCellTemplateMapping: CellTemplateProps = {
  ActiveDropdown,
  CheckboxCell,
  EditDropdownCellFormatter,
  Schema,
  FieldsConfig,
  IntegerNumberCell,
};
