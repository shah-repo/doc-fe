/* eslint-disable no-case-declarations */
import { State } from "@progress/kendo-data-query";
import { filter, find, map } from "lodash";
import moment from "moment";
import { TABLE_NAME as TRAINING_TABLE_NAME } from "../../training/grid/container";
import { DateFields } from "../../training/kendo/types";
import { documentRevisionEffectiveDateOption, dueDateOption, trainingCompletedOnDateOption } from "../utils/helpers";
import { CompletedOnDateOptions } from "../utils/types";
import { TABLE_NAME as DOC_LIST_TABLE_NAME } from "./container";

export const getDynamicPayloadItems = (tableName: string, payload) => {
  const removeFieldFromFilters = (filters: any[], field: string) => {
    filters = filter(filters, (filterObject) => filterObject.field !== field);
    return filters;
  };
  switch (tableName) {
    case DOC_LIST_TABLE_NAME:
      const field = find(payload.filters, { field: "effectiveDate" });
      if (field && field.field === "effectiveDate") {
        const effectiveDateOptions = documentRevisionEffectiveDateOption();
        payload.effectiveDate = find(effectiveDateOptions, { text: field.value })?.value;
        payload.filters = removeFieldFromFilters(payload.filters, "effectiveDate");
      }
      break;
    case TRAINING_TABLE_NAME:
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
        const duOnOptions = dueDateOption();
        payload.dueOnBefore = find(duOnOptions, { text: dueOnField.value })?.value;
        if (dueOnField.value === CompletedOnDateOptions.NEXT_WEEK) {
          payload.dueOnAfter = moment().toISOString();
        }
        payload.isCompleted = "false";
        payload.filters = removeFieldFromFilters(payload.filters, DateFields.DUE_ON);
      }
      break;
    case "documentsByCategoryList-Record":
    case "documentsByCategoryList-EB":
    case "documentsByCategoryList-Receive":
    case "documentsByCategoryList-Lhr":
      const releasedData = find(payload.filters, { field: "releasedAt" });
      if (releasedData) {
        const effectiveDateOptions = documentRevisionEffectiveDateOption();
        payload.releasedAfter = find(effectiveDateOptions, { text: releasedData.value })?.value;
        payload.filters = removeFieldFromFilters(payload.filters, "releasedAt");
      }
      break;
    case "documentsByCategoryList-Parts":
      const partsField = find(payload.filters, { field: "effectiveDate" });
      if (partsField) {
        const effectiveDateOptions = documentRevisionEffectiveDateOption();
        payload.effectiveDate = find(effectiveDateOptions, { text: partsField.value })?.value;
        payload.filters = removeFieldFromFilters(payload.filters, "effectiveDate");
      }
      break;
    default:
  }
  return payload;
};

export const updateDataState = (dataState: State) => {
  const groupList = dataState.group || [];
  const groupFields = map(groupList, "field");
  let sortList = dataState.sort;
  sortList = filter(sortList, (sortObject) => !groupFields.includes(sortObject.field));
  sortList.unshift(...groupList);
  sortList = map(sortList, (o) => {
    if (!o.dir) {
      o.dir = "asc";
    }
    return o;
  });
  dataState.sort = sortList;
  return dataState;
};
