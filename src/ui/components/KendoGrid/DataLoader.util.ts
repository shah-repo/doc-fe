import { State } from '@progress/kendo-data-query';
import { filter, find, map } from 'lodash';
import moment from 'moment';
import { TIME_ZONE } from '../../../common/utils/date';
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from '../../../state/ducks/documentRevisions/constants';
import { POStatusLabelMapping, POStatusType } from '../../../state/ducks/documentRevisions/types';
import { TRAINING_RECORDS_SEARCH_URL } from '../../../state/ducks/training/constants';
import { documentRevisionEffectiveDateOption, trainingCompletedOnDateOption } from '../../document.revision/utils/helpers';
import { CompletedOnDateOptions } from '../../document.revision/utils/types';
import { DateFields } from '../../training/kendo/types';
import { KendoGridFilterCell } from './interfaces';

export const getDynamicPayloadItems = (queryUrl, payload) => {
  const removeFieldFromFilters = (filters: any[], field: string) => {
    filters = filter(filters, (filterObject) => filterObject.field !== field);
    return filters;
  };
  switch (queryUrl) {
    case DOCUMENT_REVISION_SEARCH_ROOT_URL: {
      // handling payload for po Status cases
      const poStatusField = find(payload.filters, { field: KendoGridFilterCell.PO_STATUS });
      if (poStatusField && payload?.filters && poStatusField.field === KendoGridFilterCell.PO_STATUS) {
        payload?.filters?.forEach((filter) => {
          if (filter.field === KendoGridFilterCell.PO_STATUS) {
            if ([POStatusLabelMapping.CLOSED, POStatusLabelMapping.VOIDED].includes(filter.value)) {
              filter.value = filter.value.toUpperCase();
            } else {
              filter.value = POStatusType.OPENED;
            }
          }
        });
      }
      // Special handling in payload for effectiveDate
      const effectiveDateFiel = find(payload.filters, { field: 'effectiveDate' });
      if (effectiveDateFiel && effectiveDateFiel.field === 'effectiveDate') {
        const effectiveDateOptions = documentRevisionEffectiveDateOption();
        payload.effectiveDate = find(effectiveDateOptions, { text: effectiveDateFiel.value })?.value;
        payload.filters = removeFieldFromFilters(payload.filters, 'effectiveDate');
      }
      // Special handling in payload for releasedAt
      const releasedAtFeild = find(payload.filters, { field: 'releasedAt' });
      if (releasedAtFeild) {
        const effectiveDateOptions = documentRevisionEffectiveDateOption();
        payload.releasedAfter = find(effectiveDateOptions, { text: releasedAtFeild.value })?.value;
        payload.filters = removeFieldFromFilters(payload.filters, 'releasedAt');
      }
      break;
    }
    case TRAINING_RECORDS_SEARCH_URL: {
      const createdAtField = find(payload.filters, { field: DateFields.CREATED_AT });
      const completedAtField = find(payload.filters, { field: DateFields.COMPLETED_AT });
      const dueOnField = find(payload.filters, { field: DateFields.DUE_ON });
      if (createdAtField) {
        const createdDateOptions = documentRevisionEffectiveDateOption();
        payload.createdAtAfter = find(createdDateOptions, { text: createdAtField.value })?.value;
        payload.filters = removeFieldFromFilters(payload.filters, DateFields.CREATED_AT);
      }
      if (completedAtField) {
        const completedDateOptions = trainingCompletedOnDateOption();
        payload.completedAtAfter = find(completedDateOptions, { text: completedAtField.value })?.value;
        payload.filters = removeFieldFromFilters(payload.filters, DateFields.COMPLETED_AT);
      }
      if (dueOnField) {
        if (dueOnField.value === CompletedOnDateOptions.NEXT_WEEK) {
          payload.dueOnBefore = moment().tz(TIME_ZONE).add(7, 'd').startOf('day').toISOString();
          payload.dueOnAfter = moment().tz(TIME_ZONE).startOf('day').toISOString();
        } else if (dueOnField.value === CompletedOnDateOptions.OVERDUE) {
          payload.dueOnBefore = moment().tz(TIME_ZONE).add(-1, 'd').endOf('day').toISOString();
        }
        payload.isCompleted = 'false';
        payload.filters = removeFieldFromFilters(payload.filters, DateFields.DUE_ON);
      }
      break;
    }
    default:
  }
  return payload;
};

export const updateDataState = (dataState: State) => {
  const groupList = dataState.group || [];
  const groupFields = map(groupList, 'field');
  let sortList = dataState.sort;
  sortList = filter(sortList, (sortObject) => !groupFields.includes(sortObject.field));
  sortList.unshift(...groupList);
  sortList = map(sortList, (o) => {
    if (!o.dir) {
      o.dir = 'asc';
    }
    return o;
  });
  dataState.sort = sortList;
  return dataState;
};
