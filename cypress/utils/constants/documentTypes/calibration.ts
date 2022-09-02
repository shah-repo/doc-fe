import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const Calibration: IdocumentTypeDto = {
  documentTypeName: "Calibration",
  documentTypeAcronym: "CAL-",
  category: Categories.Record,
  group: DOC_TYPE_GROUP.MAINTENANCE_RECORD,
  isQms: true,
  fieldsConfig:
  {
    D: {
      visible: false,
      required: false,
    },
    E: {
      label: "Record Type",
      visible: true,
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
      label: "Finalize and Release",
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
      name: "fb-maintenance-details-section",
      type: "section",
      index: 0,
      label: "Maintenance Details",
      tabId: "details",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      deleteInFormDisabled: true,
    },
    {
      name: "equipment_id",
      type: "autocomplete",
      index: 1,
      label: "Equipment",
      rules: "",
      tabId: "details",
      optionId: "20",
      placeholder: "[Select revision here]",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      formValuesRules: {},
      deleteInFormDisabled: true,
    },
    {
      name: "equipment_maintainer",
      type: "autocomplete",
      index: 2,
      label: "Maintainer",
      rules: "required",
      tabId: "details",
      optionId: "13",
      placeholder: "[Select name here]",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      deleteInFormDisabled: true,
    },
    {
      name: "fb-equipment_due_date",
      type: "datepicker",
      index: 3,
      label: "Completion Date",
      rules: "required",
      tabId: "details",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      deleteInFormDisabled: true,
    },
    {
      name: "fb-requipment-maintenance-section",
      type: "textfield",
      index: 4,
      label: "Equipment Maintenance Section",
      rules: "required",
      tabId: "details",
      hidden: true,
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      deleteInFormDisabled: true,
    },
  ],
};
