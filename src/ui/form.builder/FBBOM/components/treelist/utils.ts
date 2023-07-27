import { isNil } from 'lodash';
import { ADD_FIELD, MODE_FIELD } from '../../constants';
import { BOM, EditableBOM } from '../../interface';
import { CELL_EMPTY_VALUE, SUB_ITEMS_FIELD } from './constants';

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

export const processBOMData = (bomTreeRelations: BOM[], parentRevDetails: BOM): BOM[] => {
  const bomList: BOM[] = bomTreeRelations.concat(parentRevDetails);

  const hashTable = {};
  bomList.forEach((aData: BOM) => {
    hashTable[aData.id] = { ...aData, childNodes: [] };
  });

  const dataTree: any[] = [];
  bomList.forEach((aData: BOM) => {
    if (aData.parentNodeRevId) {
      hashTable[aData.parentNodeRevId].childNodes.push(
        { ...hashTable[aData.id], ...{ parentNodeRevId: aData.parentNodeRevId, parentNodeDocumentId: hashTable[aData.parentNodeRevId].documentId } },
      );
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });

  return dataTree;
};

// Function to update data at a specific level based on the levels array
export const updateDataAtLevels = (data?: BOM[], levels?: number[], newValue?: EditableBOM): BOM[] | undefined => {
  if (!data) { return; }
  if (levels?.length === 0 && newValue) {
    // Reached the desired level, update the data
    data.push(newValue);
    return;
  }
  if (!levels) { return; }

  const currentLevel = levels[0];
  if (currentLevel >= data.length) {
    // Invalid level index
    return data;
  }

  // Update the data at the current level using recursion for deeper levels
  const updatedData = data.map((item, index) => {
    if (index === currentLevel) {
      updateDataAtLevels(item ? item[SUB_ITEMS_FIELD] : item, levels?.slice(1), newValue);
    }
    return item;
  });

  return updatedData;
};

// Function to update data at a specific level based on the levels array
export const removeDataAtLevels = (data?: BOM[], levels?: number[], newValue?: EditableBOM): BOM[] | undefined => {
  if (!data) { return; }
  if (levels?.length === 0 && newValue) {
    // Reached the desired level, update the data
    const index = data.length - 1; // data.indexOf(newValue);
    if (index > -1) {
      data.splice(index, 1);
    }
    return;
  }
  if (!levels) { return; }

  const currentLevel = levels[0];
  if (currentLevel >= data.length) {
    // Invalid level index
    return data;
  }

  // Update the data at the current level using recursion for deeper levels
  const updatedData = data.map((item, index) => {
    if (index === currentLevel) {
      removeDataAtLevels(item ? item[SUB_ITEMS_FIELD] : item, levels?.slice(1), newValue);
    }
    return item;
  });

  return updatedData;
};
