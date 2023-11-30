import { translate } from '../../../../../common/intl';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableMDItem } from './types';

export const getExcelColumns = (columns: Array<ColumnDefinition<EditableMDItem>>): Array<ColumnDefinition<EditableMDItem>> => {
  return [...columns].map(col => ({ ...col, title: translate(col.title) }));
};

export const generateDocTitleText = (docId: string, displayRevision: string) => (
  `${docId} • Rev ${displayRevision}`
);
