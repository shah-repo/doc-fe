import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const ReceivableTest: IdocumentTypeDto = {
  documentTypeName: "Receivable test",
  documentTypeAcronym: "RCT-",
  group: DOC_TYPE_GROUP.RECEIVABLE,
  category: Categories.Receive,
  isQms: true,
  privateNumberPool: true,
  needsSignature: true,
  fieldsConfig: {
    C: {
      visible: false,
      required: false,
    },
    D: {
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
    M: {
      label: "Type of Revision Change",
      visible: true,
      required: true,
    },
    N: {
      label: "Create Receving Record",
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
      label: "Void",
      visible: true,
    },
    A3: {
      label: "History",
      visible: true,
    },
    A4: {
      label: "Released",
      visible: true,
    },
    A5: {
      label: "Pending Approval",
      visible: true,
    },
    P1: {
      label: "WIP",
      visible: true,
    },
    P2: {
      label: "Void",
      visible: true,
    },
    P3: {
      label: "History",
      visible: true,
    },
    P4: {
      label: "Released",
      visible: true,
    },
    P5: {
      label: "Pending Approval",
      visible: true,
    },
  },
};

export const ReceivableTestWithSchema: IdocumentTypeDto = {
  documentTypeName: "Receivable test with schema",
  documentTypeAcronym: "RCT-",
  group: DOC_TYPE_GROUP.RECEIVABLE,
  category: Categories.Receive,
  isQms: true,
  privateNumberPool: true,
  needsSignature: true,
  schema: [{
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    applicableValidationSchema: true,
    deleteInFormDisabled: true,
    deleteDisabled: true,
    editorProperties: [],
    index: 1,
    tabId: "details",
    label: "Receive PO",
    name: "fb-receive-po",
    type: "poreceive",
    validationAttribute: "Receive PO",
    validationMode: "default",
    uniqueSchemaItem: true,
  }],
  fieldsConfig: {
    C: {
      visible: false,
      required: false,
    },
    D: {
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
    M: {
      label: "Type of Revision Change",
      visible: true,
      required: true,
    },
    N: {
      label: "Create Receving Record",
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
      label: "Void",
      visible: true,
    },
    A3: {
      label: "History",
      visible: true,
    },
    A4: {
      label: "Released",
      visible: true,
    },
    A5: {
      label: "Pending Approval",
      visible: true,
    },
    P1: {
      label: "WIP",
      visible: true,
    },
    P2: {
      label: "Void",
      visible: true,
    },
    P3: {
      label: "History",
      visible: true,
    },
    P4: {
      label: "Released",
      visible: true,
    },
    P5: {
      label: "Pending Approval",
      visible: true,
    },
  },
};

export const ReceivableExport: IdocumentTypeDto = {
  documentTypeName: "Receivable Test",
  documentTypeAcronym: "RC-",
  category: "Receive",
  group: DOC_TYPE_GROUP.RECEIVABLE,
  isQms: true,
  fieldsConfig: {
    C: {
      visible: false,
      required: false,
    },
    D: {
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
    M: {
      label: "Type of Revision Change",
      visible: true,
      required: true,
    },
    N: {
      label: "Create Receving Record",
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
    A4: {
      label: "Released",
      visible: true,
    },
    A5: {
      label: "Pending Approval",
      visible: true,
    },
    P1: {
      label: "WIP",
      visible: true,
    },
    P2: {
      label: "Void",
      visible: true,
    },
    P3: {
      label: "Archive",
      visible: true,
    },
    P4: {
      label: "Released",
      visible: true,
    },
    P5: {
      label: "Pending Approval",
      visible: true,
    },
  },
};
