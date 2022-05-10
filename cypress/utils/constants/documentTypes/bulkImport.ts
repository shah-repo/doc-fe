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
