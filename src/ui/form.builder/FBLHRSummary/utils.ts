import { cloneDeep, lowerCase } from 'lodash';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { FB } from '../helpers';
import { DocType } from './constants';
import { EditableLHRSummaryItem } from './types';

export const getExcelColumns = (columns: Array<ColumnDefinition<EditableLHRSummaryItem>>): Array<ColumnDefinition<EditableLHRSummaryItem>> => {
  return [...columns].filter(col => col.show).map(col => {
    switch (col.field) {
      case 'mpiId':
        return { ...col, field: 'stepOrMPI' };
      case 'lotOrEquipment':
        return { ...col, field: 'lotOrEqDocId' };
      default:
        return col;
    }
  });
};

const getDocId = (uuId: string, docsList: DocumentRevision[]): string => {
  return FB.isUUID(uuId)
    ? docsList.find((doc) => doc.id === uuId)?.document?.docId ?? uuId
    : uuId;
};

export const getExcelData = (
  LHRSummaryItemList: EditableLHRSummaryItem[],
  mpiDocuments: DocumentRevision[],
  partDocs: DocumentRevision[],
  equipmentDocs: DocumentRevision[],
  availableUsers: OptionType[],
): Array<ColumnDefinition<EditableLHRSummaryItem>> =>
  LHRSummaryItemList.map(item => {
    const [step, mpiId] = item.stepOrMPI?.split('/') ?? [];
    const mpiDoc = mpiDocuments.find(doc => doc.id === mpiId);
    const isMaterial = item.type === DocType.material;

    const updateId = (id: string, docs: DocumentRevision[]) => FB.isUUID(id) ? getDocId(id, docs) : id;

    const modifiedItem = {
      ...item,
      stepOrMPI: mpiDoc ? `${step}/${mpiDoc.document.docId}` : item.stepOrMPI,
      plannedId: updateId(item.plannedId, isMaterial ? partDocs : equipmentDocs),
      actualId: updateId(item.actualId, isMaterial ? partDocs : equipmentDocs),
      enteredBy: FB.isUUID(item.enteredBy)
        ? availableUsers.find(user => user.value === item.enteredBy)?.label ?? item.enteredBy
        : item.enteredBy,
    };

    return modifiedItem;
  });

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
