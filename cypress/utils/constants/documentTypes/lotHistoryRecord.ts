import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const LotHistoryRecordTest: IdocumentTypeDto = {
  documentTypeName: "Lot History Record Test",
  documentTypeAcronym: "LHR-",
  group: DOC_TYPE_GROUP.LHR,
  privateNumberPool: false,
  needsSignature: true,
  category: Categories.Lhr,
  fieldsConfig: {
    C: {
      visible: false,
    },
    D: {
      visible: false,
    },
    E: {
      visible: false,
    },
    U: {
      visible: true,
    },
    A1: {
      label: "WIP",
      visible: true,
    },
  },
  schema: [
    {
      name: "lhr-selected-part",
      type: "partsselection",
      index: 0,
      rules: "required",
      label: "Part to be Manufactured",
      deleteDisabled: true,
      deleteInFormDisabled: true,
      tabId: "overview",
    },
    {
      name: "lhr_initial_quantity",
      type: "quantity",
      index: 1,
      label: "Initial Quantity",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationAttribute: "Initial Quantity",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "overview",
    },
    {
      name: "lhr-end-quantity",
      type: "quantity",
      index: 2,
      label: "End Quantity",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      outputDisabled: true,
      validationAttribute: "End Quantity",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "overview",
    },
    {
      name: "lhr-build-type",
      type: "radiogroup",
      index: 3,
      label: "Build Type",
      rules: "required",
      options: [
        {
          text: "R&D",
          value: "R&D",
        },
        {
          text: "Production",
          value: "Production",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      validationAttribute: "Build Type",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "overview",
    },
    {
      name: "lhr-due-date",
      type: "datepicker",
      index: 4,
      label: "Due Date",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      validationMode: "default",
      validationAttribute: "Due Date",
      applicableValidationSchema: true,
      tabId: "overview",
    },
    {
      name: "lhrstep-built-in",
      type: "lhrstep",
      index: 5,
      label: "LHR Step",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      validationMode: "default",
      applicableValidationSchema: true,
      tabId: "details",
    },
  ],
};

export const LotHistoryRecordOperators: IdocumentTypeDto = {
  documentTypeName: "Lot Hisotry Record Operators",
  documentTypeAcronym: "LHRO-",
  group: DOC_TYPE_GROUP.LHR,
  category: Categories.Record,
  isQms: true,
  fieldsConfig:
    {
      U: {
        visible: true,
        required: false,
        label: "Operators",
      },
    },
  schema: [
    {
      name: "lhr-build-type",
      type: "radiogroup",
      index: 0,
      label: "Build Type",
      rules: "required",
      options: [
        {
          text: "R&D",
          value: "R&D",
        },
        {
          text: "Production",
          value: "Production",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      validationAttribute: "Build Type",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "overview",
    },
  ],
};
