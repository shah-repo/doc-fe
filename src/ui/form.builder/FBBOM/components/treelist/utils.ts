import { isNil } from 'lodash';
import { ADD_FIELD, MODE_FIELD } from '../../constants';
import { BOM, EditableBOM } from '../../interface';
import { CELL_EMPTY_VALUE } from './constants';

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

export const bomTreeRelationsObj = [
  {
    hasAttachments: false,
    hasPrimaryAttachment: false,
    attachmentNames: [],
    primaryAttachmentDetails: {},
    id: '52d73a18-61b4-4350-a263-76a2ecfc5a5d',
    version: 1,
    revision: 1,
    name: 'PCA, PS Data Logger',
    status: 'DRAFT',
    documentId: 'd811dbdb-106a-4ef7-ac60-c8ed6f3b614b',
    docId: 'SA-00091',
    parentNodeRevId: 'b50e1fcf-af55-44db-ba4f-32e12aa5a6a8',
    depth: 1,
    quantity: 10,
    markAsDeleted: false,
    unit: null,
    comment: 'sample',
    refDesignator: null,
    order: 0,
  },
  {
    hasAttachments: false,
    hasPrimaryAttachment: false,
    attachmentNames: [],
    primaryAttachmentDetails: {},
    id: 'a50b53b4-220f-4275-a89c-2250b20b02c9',
    version: 1,
    revision: 1,
    name: 'Modem',
    status: 'DRAFT',
    documentId: 'c50347f8-d9fd-4e58-b0a5-f31c3c9c29a5',
    docId: 'FG-00012',
    parentNodeRevId: 'b50e1fcf-af55-44db-ba4f-32e12aa5a6a8',
    depth: 1,
    quantity: 23,
    markAsDeleted: false,
    unit: '1',
    comment: 'sample',
    refDesignator: 'Ref',
    order: 1,
  },
  {
    hasAttachments: true,
    hasPrimaryAttachment: false,
    attachmentNames: [
      'CS-00043.03 Pressure Sensor',
      'CS-00043.03 FAB Drawing Pressure Sensor',
    ],
    primaryAttachmentDetails: {},
    changeRequestDetails: {
      id: '2fb11b27-77a5-4d11-9f3c-ceec5b6349b4',
      title: 'Releasing CS-00083, PCB, Pressure Sensor',
      crId: 'AR00072',
    },
    id: 'a0215ed0-d03f-48f0-859c-0033630a4a5a',
    version: 3,
    revision: 3,
    name: 'PCB, Pressure Sensor',
    status: 'RELEASED',
    documentId: 'ed5cba81-0f21-41ee-9e2a-5a54a950a429',
    docId: 'CS-00083',
    availableRevisions: {
      isReleased: false,
      name: 'PCB, Pressure Sensor',
      revision: 1,
      status: 'DEPRECATED',
      changeRequestDetails: {
        id: '88c26a4f-5465-46fb-8805-5ef8abb816bd',
        title: 'Releasing CS-00083, PCB, Pressure Sensor',
        crId: 'AR00069',
      },
    },
    parentNodeRevId: 'b50e1fcf-af55-44db-ba4f-32e12aa5a6a8',
    depth: 1,
    quantity: 23,
    markAsDeleted: false,
    unit: null,
    comment: null,
    refDesignator: null,
    order: 2,
  },
];

export const parentDetailsObj = {
  hasAttachments: false,
  hasPrimaryAttachment: false,
  attachmentNames: [],
  primaryAttachmentDetails: {},
  id: 'b50e1fcf-af55-44db-ba4f-32e12aa5a6a8',
  version: 1,
  revision: 1,
  name: 'Home Use Bed Charger',
  status: 'DRAFT',
  documentId: '964a7e16-f627-4860-8caa-1c607a3e1296',
  docId: 'FG-00009',
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
      hashTable[aData.parentNodeRevId].childNodes.push(hashTable[aData.id]);
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });

  return dataTree;
};
