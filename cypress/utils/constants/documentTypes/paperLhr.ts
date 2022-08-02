import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const PaperLHR: IdocumentTypeDto = {
  documentTypeName: "Paper LHR",
  documentTypeAcronym: "LHR-",
  group: DOC_TYPE_GROUP.PAPER_LHR,
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
      label: "Part to be Manufactured",
      deleteDisabled: true,
      deleteInFormDisabled: true,
      tabId: "details",
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
      tabId: "details",
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
      tabId: "details",
    },
    {
      name: "lhr-build-type",
      type: "radiogroup",
      index: 3,
      label: "Build Type",
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
      tabId: "details",
    },
  ],
};
