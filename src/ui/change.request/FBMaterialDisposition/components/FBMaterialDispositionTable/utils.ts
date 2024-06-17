import { cloneDeep, find, first, isEmpty, keys } from 'lodash';
import { translate } from '../../../../../common/intl';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { DROPDOWN_FIELDS, EMPTY_DROPDOWN_PLACEHOLDER } from './constants';
import { CopiedItems, EditableMDItem } from './types';

export const getExcelColumns = (columns: Array<ColumnDefinition<EditableMDItem>>): Array<ColumnDefinition<EditableMDItem>> => {
  return [...columns].map(col => ({ ...col, title: translate(col.title) }));
};

export const isEditMode = (dataItem: EditableMDItem): boolean => [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

export const getMDItemList = (mdItemList: EditableMDItem[]): EditableMDItem[] => {
  return [...mdItemList].map(mdItem => {
    const { userEnteredItemId } = mdItem;
    const isUserEnteredItemId = !isEmpty(userEnteredItemId);
    return { ...mdItem, ...isUserEnteredItemId && { partDocId: userEnteredItemId } };
  });
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

export const updateData = (values: Partial<EditableMDItem>, data: EditableMDItem[]): EditableMDItem[] => {
  return cloneDeep(data).map(dataItem => {
    if (values.id === dataItem.id) {
      return values as EditableMDItem;
    }

    return dataItem;
  });
};

export const updateDataWithCopiedValue = (selectedRowIds: string[],
  copiedItems: CopiedItems,
  data: EditableMDItem[]): EditableMDItem[] => {
  const copiedDataItem = find(data, { id: first(keys(copiedItems)) });
  const copiedDataItemField = copiedItems?.[copiedDataItem?.id ?? ''] ?? '';
  const copiedDataItemValue = copiedItems?.value;

  return data.map(dataItem => {
    if (selectedRowIds.includes(dataItem.id) && !isEmpty(copiedDataItemValue)) {
      dataItem[copiedDataItemField] = copiedDataItemValue;
    }

    return dataItem;
  });
};
