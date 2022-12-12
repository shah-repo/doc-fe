import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const BulkImport: IdocumentTypeDto = {
  documentTypeName: "Bulk Import",
  documentTypeAcronym: "BLC-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.BULK_CREATE,
  isQms: true,
  fieldsConfig: {
    D: {
      visible: false,
      required: false,
    },
    E: {
      label: "Record Type",
      visible: false,
      required: true,
    },
    F: {
      label: "Record ID",
      visible: false,
      required: true,
    },
    G: {
      visible: false,
      required: false,
    },
    I: {
      visible: false,
    },
    J: {
      visible: false,
    },
    K: {
      label: "Void",
      visible: true,
    },
    L: {
      label: "Correction",
      visible: true,
    },
    N: {
      label: "Approve and Release",
      visible: true,
    },
    O: {
      label: "Record History",
      visible: true,
    },
    R: {
      visible: false,
    },
    S: {
      label: "Update Record",
      visible: true,
    },
    A1: {
      label: "WIP",
      visible: true,
    },
    A2: {
      label: "Voided",
      visible: true,
    },
    A3: {
      label: "Archive",
      visible: true,
    },
    P1: {
      label: "WIP",
      visible: true,
    },
    P2: {
      label: "Voided",
      visible: true,
    },
    P3: {
      label: "Archive",
      visible: true,
    },
  },
};

export const BulkImportWithSchema: IdocumentTypeDto = {
  documentTypeName: "Bulk Import",
  documentTypeAcronym: "BLC-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.BULK_CREATE,
  isQms: true,
  fieldsConfig: {
    D: {
      visible: false,
      required: false,
    },
    E: {
      label: "Record Type",
      visible: false,
      required: true,
    },
    F: {
      label: "Record ID",
      visible: false,
      required: true,
    },
    G: {
      visible: false,
      required: false,
    },
    I: {
      visible: false,
    },
    J: {
      visible: false,
    },
    K: {
      label: "Void",
      visible: true,
    },
    L: {
      label: "Correction",
      visible: true,
    },
    N: {
      label: "Approve and Release",
      visible: true,
    },
    O: {
      label: "Record History",
      visible: true,
    },
    R: {
      visible: false,
    },
    S: {
      label: "Update Record",
      visible: true,
    },
    A1: {
      label: "WIP",
      visible: true,
    },
    A2: {
      label: "Voided",
      visible: true,
    },
    A3: {
      label: "Archive",
      visible: true,
    },
    P1: {
      label: "WIP",
      visible: true,
    },
    P2: {
      label: "Voided",
      visible: true,
    },
    P3: {
      label: "Archive",
      visible: true,
    },
  },
  schema: [
    {
      name: "fb-form-document-to-be-used",
      type: "autocomplete",
      index: 0,
      label: "Select Form Document For Import",
      rules: "required",
      optionId: "34",
      placeholder: "select form document for import",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      validationAttribute: "Select Form Document For Import",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "fb-add-column-document-record-id",
      type: "radiogroup",
      index: 2,
      label: "Column Document/Record Id?",
      options: [
        {
          text: "Yes",
          value: "Yes",
        },
        {
          text: "No",
          value: "No",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: false,
      validationMode: "default",
      editorProperties: [],
      validationAttribute: "Column Document/Record Id?",
      deleteInFormDisabled: false,
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "fb-output-document-type",
      type: "autocomplete",
      index: 3,
      label: "Select Output Document Type",
      rules: "required",
      optionId: "35",
      placeholder: "select output document type",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      validationAttribute: "Select Output Document Type",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "fb-download-sheet",
      type: "downloadsheet",
      index: 1,
      label: "Download Excel Template",
      deleteDisabled: true,
      editorProperties: [],
      deleteInFormDisabled: true,
      tabId: "details",
    },
    {
      name: "fb-spreadsheet-for-import",
      type: "section",
      index: 4,
      label: "Excel For Import",
      deleteDisabled: false,
      deleteInFormDisabled: true,
      tabId: "details",
    },
    {
      name: "fb-spreadsheet-for-import-file",
      type: "fileupload",
      index: 5,
      label: "Upload excel with data for import",
      rules: "required",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      editorProperties: [],
      validationAttribute: "Upload excel with data for import",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "fb-spreadsheet-for-logging",
      type: "section",
      index: 6,
      label: "Mass Create Logs",
      deleteDisabled: false,
      deleteInFormDisabled: true,
      tabId: "details",
    },
    {
      name: "fb-spreadsheet-for-logging-file",
      type: "fileupload",
      index: 7,
      label: "Logs",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      editorProperties: [],
      validationAttribute: "Logs",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "details",
    },
  ],
};
