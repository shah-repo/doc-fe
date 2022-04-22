import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const LotsTest: IdocumentTypeDto = {
  documentTypeName: "Lots test",
  documentTypeAcronym: "LTT-",
  group: DOC_TYPE_GROUP.LOT,
  category: Categories.Lot,
  isQms: true,
  privateNumberPool: true,
  needsSignature: true,
  fieldsConfig: {
    D: {
      label: "Description",
      visible: false,
      required: false,
    },
    E: {
      visible: false,
      required: true,
    },
    F: {
      visible: false,
      required: true,
    },
    G: {
      visible: false,
      required: false,
    },
    I: {
      label: "Update",
      visible: true,
    },
    J: {
      visible: false,
    },
    K: {
      visible: false,
    },
    L: {
      label: "Correction",
      visible: true,
    },
    O: {
      label: "Lot History",
      visible: true,
    },
    R: {
      visible: false,
    },
    A1: {
      label: "WIP",
      visible: true,
    },
    A2: {
      label: "Rejected",
      visible: true,
    },
    A3: {
      visible: false,
    },
    A4: {
      label: "Accepted",
      visible: true,
    },
    A5: {
      label: "Quarantine",
      visible: true,
    },
    A6: {
      visible: false,
    },
    P1: {
      label: "WIP",
      visible: true,
    },
    P2: {
      label: "Rejected",
      visible: true,
    },
    P3: {
      visible: false,
    },
    P4: {
      label: "Accepted",
      visible: true,
    },
    P5: {
      label: "Quarantine",
      visible: true,
    },
    P6: {
      visible: false,
    },
  },
};
