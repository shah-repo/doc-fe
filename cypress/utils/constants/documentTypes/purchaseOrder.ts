import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const PurchaseOrderTest: IdocumentTypeDto = {
  documentTypeName: "Purchase Order test",
  documentTypeAcronym: "POT-",
  group: DOC_TYPE_GROUP.PO,
  category: Categories.PurchaseOrder,
  isQms: true,
  privateNumberPool: true,
  needsSignature: true,
  fieldsConfig: {
    C: {
      visible: false,
      required: false,
    },
    D: {
      label: "Description",
      visible: true,
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
      label: "Revise PO",
      visible: true,
    },
    J: {
      visible: false,
    },
    K: {
      label: "Cancel PO",
      visible: true,
    },
    L: {
      label: "Correct PO",
      visible: true,
    },
    M: {
      label: "Type of Change",
      visible: true,
      required: true,
    },
    N: {
      label: "Add Approvers",
      visible: false,
      required: false,
    },
    O: {
      label: "PO History",
      visible: true,
    },
    R: {
      visible: false,
    },
    S: {
      label: "Revise PO",
      visible: true,
    },
    V: {
      label: "Create PO",
      visible: true,
    },
    A1: {
      label: "Draft",
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
      visible: false,
    },
    A5: {
      label: "Pending Approval",
      visible: true,
    },
    A6: {
      label: "Draft",
      visible: true,
    },
    P1: {
      label: "Draft",
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
      visible: false,
    },
    P5: {
      label: "Pending Approval",
      visible: true,
    },
    P6: {
      label: "Draft",
      visible: true,
    },
  },
  schema: [
    {
      name: "po-status-built-in",
      type: "select",
      index: 0,
      label: "PO Status",
      options: [
        {
          text: "Open",
          value: "Open",
        },
        {
          text: "Closed",
          value: "Closed",
        },
        {
          text: "Cancelled",
          value: "Cancelled",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      validationAttribute: "PO Status",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
    {
      name: "po-supplier-built-in",
      type: "supplier",
      index: 1,
      label: "Supplier ",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      validationAttribute: "Supplier",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
    {
      name: "po-items-built-in",
      type: "purchaseorder",
      index: 2,
      label: "Purchase Order",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationAttribute: "Purchase Order",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
  ],
};
