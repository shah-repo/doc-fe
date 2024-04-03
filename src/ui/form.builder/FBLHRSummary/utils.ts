import { cloneDeep, find, lowerCase } from 'lodash';
import { translate } from '../../../common/intl';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableLHRSummaryItem } from './types';

export const getExcelColumns = (columns: Array<ColumnDefinition<EditableLHRSummaryItem>>): Array<ColumnDefinition<EditableLHRSummaryItem>> => {
  return [...columns].map(col => ({ ...col, title: translate(col.title) }));
};

export const generateDocTitleText = (docId: string, displayRevision: string) => (
  `${docId} • Rev ${displayRevision}`
);

export const updateData = (values: Partial<EditableLHRSummaryItem>, data: EditableLHRSummaryItem[]): EditableLHRSummaryItem[] => {
  return cloneDeep(data).map(dataItem => {
    if (values.id === dataItem.id) {
      return values as EditableLHRSummaryItem;
    }

    return dataItem;
  });
};

export const filterOutOption = (docRev: DocumentRevision, inputValue: string) => {
  const filterValue = lowerCase(inputValue);

  return lowerCase(docRev.name).includes(filterValue)
    || lowerCase(docRev.document.docId).includes(filterValue);
};

export const getLotStatus = (lotId: string, lotDocs: DocumentRevision[]) => {
  const lotDoc = find(lotDocs, { id: lotId });

  return lotDoc?.status;
};
