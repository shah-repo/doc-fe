import moment from 'moment';
import { translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import { LotStatus } from '../../../state/ducks/documentRevisions/types';
import { getLotStatusLabel } from '../../components/common/header/HeaderLotStatus';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FB } from '../helpers';
import { EMPTY_PLACEHOLDER, TYPE_OPTIONS } from './constants';
import { DetailsObj, EditableLHRSummaryItem, NullableString } from './types';

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
    const lotStatus = item.lotStatus ? getLotStatusLabel(item.lotStatus as LotStatus) : EMPTY_PLACEHOLDER;
    const modifiedItem = {
      ...item,
      type: getTypeOptionLabelByValue(item.type),
      customMpiId: getDisplayStepAndMpiValue(item.step, item?.stepOrMpiDetails),
      plannedDocId: getDisplayDocumentByDetailsObj(item?.plannedDetails),
      actualDocId: getDisplayDocumentByDetailsObj(item?.actualDetails),
      lotOrEqDocId: getDisplayDocumentByDetailsObj(item?.lotOrEquipmentDetails),
      issue: getDisplayDocumentByDetailsObj(item?.issueDetails),
      lotStatus,
      enteredBy: FB.isUUID(item.enteredBy)
        ? availableUsers.find(user => user.value === item.enteredBy)?.label ?? item.enteredBy
        : item.enteredBy,
    };

    return modifiedItem;
  });

export const getDisplayDocumentByDetailsObj = (object?: DetailsObj): string => {
  const { docId, displayRevision, documentId, value } = object ?? {};
  return documentId && value
    ? getDisplayDocument(docId, displayRevision)
    : value ?? EMPTY_PLACEHOLDER;
};

export const getDisplayDocument = (docId?: string, displayRevision?: string): string => {
  return `${docId ?? ''} - ${displayRevision ?? ''}`;
};

export const setFieldValuesForOriginalAndPrefixed = (
  setFieldValue: (fieldName: string, value: NullableString) => void,
  fieldName: string,
  value: NullableString,
): void => {
  setFieldValue(fieldName, value);
  setFieldValue(addCustomPrefix(fieldName), value);
};

const addCustomPrefix = (fieldName: string): string =>
    `custom${fieldName[0].toUpperCase()}${fieldName.slice(1)}`;

const formatDate = (date, format) => {
  return moment(date).format(format);
};

export const processData = (
  data: EditableLHRSummaryItem[],
  availableUsers: OptionType[],
): EditableLHRSummaryItem[] => {
  return data?.map(item => {
    const modifiedItem = {
      ...item,
      customMpiId: getDisplayDocumentByDetailsObj(item?.stepOrMpiDetails),
      customPlannedId: getDisplayDocumentByDetailsObj(item?.plannedDetails),
      customActualDocId: getDisplayDocumentByDetailsObj(item?.actualDetails),
      customLotOrEquipment: getDisplayDocumentByDetailsObj(item?.lotOrEquipmentDetails),
      customIssue: getDisplayDocumentByDetailsObj(item?.issueDetails),
      customCalDueDate: item?.calDueDate && formatDate(item?.calDueDate, MomentFormats.MonthDateYearTwoDigit),
      customPmDueDate: item?.pmDueDate && formatDate(item?.pmDueDate, MomentFormats.MonthDateYearTwoDigit),
      customExpiryDate: item?.expiryDate && formatDate(item?.expiryDate, MomentFormats.MonthDateYearTwoDigit),
      customRecordCreationDate: item?.recordCreationDate && formatDate(item?.recordCreationDate, MomentFormats.MonthDateYearTwoDigit),
      customEnteredBy: FB.isUUID(item.enteredBy)
        ? availableUsers.find(user => user.value === item.enteredBy)?.label ?? item.enteredBy
        : item.enteredBy,
    };

    return modifiedItem;
  });
};

export const getTypeOptionLabelByValue = (value: string): string | undefined => {
  return TYPE_OPTIONS.find((option) => option.value === value)?.label;
};

const getDisplayStepAndMpiValue = (step?: string, stepOrMpiDetails?: DetailsObj): string => {
  const customMpiIdValue = getDisplayDocumentByDetailsObj(stepOrMpiDetails);
  return !step ? `/${customMpiIdValue}` : (customMpiIdValue === step) ? `${step}/` : `${step}/${customMpiIdValue}`;
};
