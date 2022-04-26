import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const Supplier: IdocumentTypeDto = {
  documentTypeName: "Supplier",
  documentTypeAcronym: "SUP-",
  group: DOC_TYPE_GROUP.SUPPLIER,
  isQms: true,
  needsSignature: true,
  category: Categories.Suppliers,
};

export const SupplierExport: IdocumentTypeDto = {
  documentTypeName: "Supplier",
  documentTypeAcronym: "SUP-",
  category: "Supplier",
  group: DOC_TYPE_GROUP.SUPPLIER,
  isQms: true,
  fieldsConfig: {
    C: {
      label: "Supplier Name",
      visible: true,
      required: true,
    },
    D: {
      label: "Supplier Address/Phone",
      visible: true,
      required: true,
    },
    E: {
      visible: false,
      required: false,
    },
    F: {
      visible: false,
      required: false,
    },
    G: {
      visible: false,
      required: false,
    },
    I: {
      label: "Next Revision",
      visible: true,
    },
    J: {
      label: "Upgrade to Next Revision Level",
      visible: true,
    },
    K: {
      label: "Void",
      visible: true,
    },
    L: {
      label: "Administrative Change",
      visible: true,
    },
    M: {
      label: "Type of Revision Change",
      visible: true,
    },
    N: {
      label: "Approve & Release",
      visible: false,
    },
    O: {
      label: "History",
      visible: true,
    },
    R: {
      label: "AR ID",
      visible: true,
    },
    S: {
      label: "Update Supplier",
      visible: true,
    },
    T: {
      label: "Revision",
      visible: true,
    },
    A1: {
      label: "Draft",
      visible: true,
    },
    A2: {
      label: "Voided",
      visible: true,
    },
    A3: {
      label: "Superseded",
      visible: true,
    },
    A4: {
      label: "Released",
      visible: true,
    },
    A5: {
      label: "In Review",
      visible: true,
    },
    A6: {
      label: "Pending Change",
      visible: true,
    },
    A7: {
      label: "Approved",
      visible: true,
    },
    A8: {
      label: "Canceled",
      visible: true,
    },
    A9: {
      label: "Voided",
      visible: true,
    },
    P1: {
      label: "Draft",
      visible: true,
    },
    P2: {
      label: "Voided",
      visible: true,
    },
    P3: {
      label: "Superseded",
      visible: true,
    },
    P4: {
      label: "Released",
      visible: true,
    },
    P5: {
      label: "In Review",
      visible: true,
    },
    P6: {
      label: "Pending Change",
      visible: true,
    },
    P7: {
      label: "Approved",
      visible: true,
    },
    P8: {
      label: "Canceled",
      visible: true,
    },
  },
};
