import { isNil } from 'lodash';
import Config from '../../../../../config';
import { changeRequestPreviewPath } from '../../../../change.request/utils/paths';
import { documentPreviewPath } from '../../../../document.revision/utils/paths';
import { BOM, EditableBOM } from '../../interface';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD, SELECTED_PART_KEY_SEPARATOR, SUB_ITEMS_FIELD } from './constants';

export const isAddOnly = (dataItem: EditableBOM): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

// ts-unused-exports:disable-next-line
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

export const hasSameParent = (arr1: number[], arr2: number[]): boolean => {
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

export const getExcelColumns = (columns) => {
  return [...columns].map(col => {
    if (['arId', 'hasChanges'].includes(col.field)) {
      return { ...col, field: 'changeRequestDetails.crId' };
    } else if (col.field === 'customDocId') {
      return { ...col, field: 'docId' };
    } else if (col.field === 'hasPrimaryAttachment') {
      return { ...col, field: 'primaryAttachmentDetails.name', width: '240px' };
    } else if (col.field === 'hasAttachments') {
      return { ...col, field: 'attachmentsCount', width: '100px' };
    } else if (col.field === 'vendors') {
      return { ...col, field: 'vendorsCount' };
    } else if (col.field === 'alternatePartsList') {
      return { ...col, field: 'alternatePartsCount', width: '130px' };
    }
    return col;
  });
};

const getChildPartId = (part) => {
  return part?.id.split(SELECTED_PART_KEY_SEPARATOR)[0];
};

const getDocLink = (part) => {
  return `${Config.FrontendUrl}${documentPreviewPath(getChildPartId(part), part?.documentId)}`;
};

const getCrDocLink = (arId) => {
  return `${Config.FrontendUrl}${changeRequestPreviewPath(arId)}`;
};

export const getHyperLinkForIdCell = (part, value) => {
  return `=HYPERLINK("${getDocLink(part)}", "${value ?? '-'}")`;
};

export const getHyperLinkForArIdCell = (arId, value) => {
  return `=HYPERLINK("${getCrDocLink(arId)}", "${value ?? '-'}")`;
};
