import { isNil } from 'lodash';
import { ADD_FIELD, MODE_FIELD } from '../../constants';
import { BOM, EditableBOM } from '../../interface';
import { CELL_EMPTY_VALUE, SELECTED_PART_KEY_SEPARATOR, SUB_ITEMS_FIELD } from './constants';

export const isAddOnly = (dataItem: EditableBOM): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditOnly = (dataItem: EditableBOM): boolean => {
  return dataItem[MODE_FIELD] ?? false;
};

export const isEditBOM = (dataItem: EditableBOM): boolean => {
  return (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const enableFieldAfterPartSelection = (dataItem: EditableBOM, docId: string): boolean => {
  return isAddOnly(dataItem) ? !isNil(docId) : true;
};

export const getCellValue = (dataItem: EditableBOM, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
};

export const isOfSameParent = (arr1: number[], arr2: number[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length - 1; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

export const processBOMData = (bomTreeRelations: BOM[], parentRevDetails: BOM): EditableBOM[] => {
  const bomList: BOM[] = bomTreeRelations.concat(parentRevDetails);

  const hashTable = {};
  bomList.forEach((aData: BOM) => {
    hashTable[aData.id] = { ...aData, childNodes: [] };
  });

  const dataTree: EditableBOM[] = [];
  bomList.forEach((aData: BOM) => {
    if (aData.parentNodeRevId) {
      hashTable[aData.parentNodeRevId].childNodes.push(
        {
          ...hashTable[aData.id],
          ...{
            id: `${aData.id}${SELECTED_PART_KEY_SEPARATOR}${aData.parentNodeRevId}${SELECTED_PART_KEY_SEPARATOR}${aData.depth}`,
            parentNodeRevId: aData.parentNodeRevId,
            parentNodeDocumentId: hashTable[aData.parentNodeRevId].documentId,
            isParentOwner: hashTable[aData.parentNodeRevId].isOwner,
          },
        },
      );
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });

  return dataTree;
};

export const updateDataAtLevels = (data?: BOM[], levels?: number[], newValue?: EditableBOM, isUpdate?: boolean): BOM[] | undefined => {
  if (!data) { return; }
  if (levels?.length === 0 && newValue) {
    if (isUpdate) {
      data.push(newValue);
    } else {
      const index = data.length - 1;
      if (index > -1) {
        data.splice(index, 1);
      }
    }
    return;
  }
  if (!levels) { return; }
  const currentLevel = levels[0];
  if (currentLevel >= data.length) {
    return data;
  }
  const updatedData = data.map((item, index) => {
    if (index === currentLevel) {
      updateDataAtLevels(item ? item[SUB_ITEMS_FIELD] : item, levels?.slice(1), newValue, isUpdate);
    }
    return item;
  });
  return updatedData;
};
