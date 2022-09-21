import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { DEFAUL_REV_STAGE, IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

const CSLName = "Component Specifications Lot";
const CSLAcronym = "CSL-";

export const CSLDocTypeLot: IdocumentTypeDto = {
  documentTypeName: CSLName,
  documentTypeAcronym: CSLAcronym,
  category: Categories.Record,
  privateNumberPool: true,
  isQms: true,
  needsSignature: true,
  startingNumber: 1,
  defaultRevStage: DEFAUL_REV_STAGE.NUMERIC,
  group: DOC_TYPE_GROUP.PART_LOT,
  schema: [
    {
      name: "lot_quantity",
      type: "quantity",
      index: 0,
      label: "Initial Quantity",
      tabId: "details",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      editorProperties: [],
      validationAttribute: "Initial Quantity",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
    {
      name: "lot_usable_quantity",
      type: "quantity",
      index: 1,
      label: "Usable Quantity",
      tabId: "details",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      editorProperties: [],
      validationAttribute: "Usable Quantity",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
    {
      name: "lot_expiry_date",
      type: "datepicker",
      index: 2,
      label: "Expiration Date",
      tabId: "details",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationAttribute: "Expiration Date",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
    {
      name: "lot_part",
      type: "autocomplete",
      index: 3,
      label: "Part Selection",
      tabId: "details",
      optionId: "21",
      placeholder: "Select the appropriate part for this lot",
      deleteDisabled: true,
      deleteInFormDisabled: true,
    },
    {
      name: "100-inspection-override",
      type: "checkboxgroup",
      index: 4,
      label: "100% Inspection Override",
      tabId: "details",
      options: [
        {
          text: "100% Inspection Override",
          value: "100% Inspection Override",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      editorProperties: [],
      validationAttribute: "100% Inspection Override",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
  ],
  fieldsConfig: {
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
};

export const CSLDocument: IdocumentTypeDto =  {
  documentTypeName: "CSL Document",
  documentTypeAcronym: CSLAcronym,
  category: Categories.Record,
  group: DOC_TYPE_GROUP.PART_LOT,
  isQms: true,
  fieldsConfig: {
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
};
