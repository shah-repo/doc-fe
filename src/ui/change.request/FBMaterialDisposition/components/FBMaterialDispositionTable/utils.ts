import { translate } from '../../../../../common/intl';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { DROPDOWN_FIELDS, EMPTY_DROPDOWN_PLACEHOLDER } from './constants';
import { EditableMDItem } from './types';

export const getExcelColumns = (columns: Array<ColumnDefinition<EditableMDItem>>): Array<ColumnDefinition<EditableMDItem>> => {
  return [...columns].map(col => ({ ...col, title: translate(col.title) }));
};

export const generateDocTitleText = (docId: string, displayRevision: string) => (
  `${docId} • Rev ${displayRevision}`
);

export const hasConflictingSelections = (values: Partial<EditableMDItem>): boolean => {
  const count = DROPDOWN_FIELDS.reduce((count, fieldName) => {
    if (values[fieldName] !== EMPTY_DROPDOWN_PLACEHOLDER) {
      return count + 1;
    }
    return count;
  }, 0);
  return count > 1;
};
