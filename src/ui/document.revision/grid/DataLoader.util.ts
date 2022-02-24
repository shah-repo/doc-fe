/* eslint-disable no-case-declarations */
import { State } from "@progress/kendo-data-query";
import { filter, find, map } from "lodash";
import moment from "moment";
import { CHANGE_REQUEST_ROOT_URL_SEARCH } from "../../../state/ducks/changeRequest/constants";
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { TRAINING_RECORDS_SEARCH_URL } from "../../constants/urls";
import { DateFields } from "../../training/kendo/types";
import { documentRevisionEffectiveDateOption, documentRevisionQueryStatus, dueDateOption, trainingCompletedOnDateOption } from "../utils/helpers";
import { CompletedOnDateOptions } from "../utils/types";

const TABLE_PAYLOAD_ITEMS_MAPPING = {
  "documentRevisions": {
    documentTypeWithoutCategory: "true",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Record": {
    documentTypeCategory: "Record",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Equipment": {
    documentTypeCategory: "Equipment",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Supplier": {
    documentTypeCategory: "Supplier",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Purchase Order": {
    documentTypeCategory: "Purchase Order",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Parts": {
    documentTypeCategory: "Parts",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-EB": {
    documentTypeCategory: "EB",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Lot": {
    documentTypeCategory: "Lot",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Lhr": {
    documentTypeCategory: "Lhr",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Receive": {
    documentTypeCategory: "Receive",
    status: documentRevisionQueryStatus(),
  },
  "documentsByCategoryList-Training Curriculums": {
    documentTypeCategory: "Training Curriculums",
    status: documentRevisionQueryStatus(),
  },
};
export const getDefaultPayloadItems = (tableName: string) => TABLE_PAYLOAD_ITEMS_MAPPING[tableName] || {};
export const getQueryURL = (tableName: string) => {
  const urls = [
    "documentsByCategoryList-Record",
    "documentsByCategoryList-Equipment",
    "documentsByCategoryList-Supplier",
    "documentsByCategoryList-Purchase Order",
    "documentsByCategoryList-Parts",
    "documentsByCategoryList-EB",
    "documentsByCategoryList-Lot",
    "documentsByCategoryList-Lhr",
    "documentsByCategoryList-Receive",
    "documentsByCategoryList-Training Curriculums",
  ];
  if (urls.includes(tableName)) {
    return DOCUMENT_REVISION_SEARCH_ROOT_URL;
  }
  if (["documentRevisions"].includes(tableName) ) {
    return DOCUMENT_REVISION_SEARCH_ROOT_URL;
  }
  if (["changeRequests"].includes(tableName)) {
    return CHANGE_REQUEST_ROOT_URL_SEARCH;
  }
  if (["training"].includes(tableName)) {
    return TRAINING_RECORDS_SEARCH_URL;
  }
};
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
