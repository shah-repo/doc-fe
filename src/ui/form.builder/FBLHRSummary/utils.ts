import { cloneDeep, lowerCase } from 'lodash';
import { translate } from '../../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../../common/utils/date';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { FB } from '../helpers';
import { EditableLHRSummaryItem } from './types';

export const getExcelColumns = (columns: Array<ColumnDefinition<EditableLHRSummaryItem>>): Array<ColumnDefinition<EditableLHRSummaryItem>> => {
  return [...columns].filter(col => col.show).map(col => {
    switch (col.field) {
      case 'mpiId':
        return { ...col, field: 'stepOrMPI', title: translate(col.title) };
      case 'plannedId':
        return { ...col, field: 'plannedDocId', title: translate(col.title) };
      case 'actualId':
        return { ...col, field: 'actualDocId', title: translate(col.title) };
      case 'lotOrEquipment':
        return { ...col, field: 'lotOrEqDocId', title: translate(col.title) };
      default:
        return { ...col, title: translate(col.title) };
    }
  });
};

export const getExcelData = (
  LHRSummaryItemList: EditableLHRSummaryItem[],
  availableUsers: OptionType[],
): Array<ColumnDefinition<EditableLHRSummaryItem>> =>
  LHRSummaryItemList.map(item => {
    const { step, stepOrMpiDocId } = item;

    const modifiedItem = {
      ...item,
      stepOrMPI: `${step}/${stepOrMpiDocId}`,
      expiryDate: getFormattedDateString(item.expiryDate ?? '', MomentFormats.MonthDateYearTwoDigit),
      calDueDate: getFormattedDateString(item.calDueDate ?? '', MomentFormats.MonthDateYearTwoDigit),
      pmDueDate: getFormattedDateString(item.pmDueDate ?? '', MomentFormats.MonthDateYearTwoDigit),
      createdAt: getFormattedDateString(item.createdAt ?? '', MomentFormats.MonthDateYearTwoDigit),
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
