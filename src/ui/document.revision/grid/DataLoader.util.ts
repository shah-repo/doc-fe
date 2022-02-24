/* eslint-disable no-case-declarations */
import { State } from "@progress/kendo-data-query";
import { filter, find, map } from "lodash";
import moment from "moment";
import { DateFields } from "../../training/kendo/types";
import { documentRevisionEffectiveDateOption, dueDateOption, trainingCompletedOnDateOption } from "../utils/helpers";
import { CompletedOnDateOptions } from "../utils/types";

export const getDynamicPayloadItems = (tableName: string, payload) => {
  switch (tableName) {
    case "documentRevisions":
      const field = find(payload.filters, { field: "effectiveDate" });
      if (field && field.field === "effectiveDate") {
        const effectiveDateOptions = documentRevisionEffectiveDateOption();
        payload.effectiveDate = find(effectiveDateOptions, { text: field.value })?.value;
        payload.filters = filter(payload.filters, (el) => el.field !== "effectiveDate");
      }
      break;
    case "training":
      const createdAtField = find(payload.filters, {
        field: DateFields.CREATED_AT,
      });
      const completedAtField = find(payload.filters, {
        field: DateFields.COMPLETED_AT,
      });
      const dueOnField = find(payload.filters, { field: DateFields.DUE_ON });

      if (createdAtField) {
        const createdDateOptions = documentRevisionEffectiveDateOption();
        payload.createdAtAfter = find(createdDateOptions, {
          text: createdAtField.value,
        })?.value;
        payload.filters = filter(
          payload.filters,
          (el) => el.field !== DateFields.CREATED_AT
        );
      }

      if (completedAtField) {
        const completedDateOptions = trainingCompletedOnDateOption();
        payload.completedAtAfter = find(completedDateOptions, {
          text: completedAtField.value,
        })?.value;

        payload.filters = filter(
          payload.filters,
          (el) => el.field !== DateFields.COMPLETED_AT
        );
      }
      if (dueOnField) {
        const duOnOptions = dueDateOption();
        payload.dueOnBefore = find(duOnOptions, {
          text: dueOnField.value,
        })?.value;
        if (dueOnField.value === CompletedOnDateOptions.NEXT_WEEK) {
          payload.dueOnAfter = moment().toISOString();
        }
        payload.isCompleted = "false";
        payload.filters = filter(
          payload.filters,
          (el) => el.field !== DateFields.DUE_ON
        );
      }
      break;
    case "documentsByCategoryList-Record":
      // API is not working -- need to check this
      const releasedData = find(payload.filters, { field: "releasedAt" });
      if (releasedData) {
        const effectiveDateOptions = documentRevisionEffectiveDateOption();
        payload.releasedAt = find(effectiveDateOptions, { text: releasedData.value })?.value;
        payload.filters = filter(payload.filters, (el) => el.field !== "releasedAt");
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
