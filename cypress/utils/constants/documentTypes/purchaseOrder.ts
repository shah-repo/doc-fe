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
      label: "Released",
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
      tabId: "details",
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
      tabId: "details",
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
      tabId: "lineitems",
    },
  ],
};

export const PurchaseOrderDocType:  IdocumentTypeDto = {
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
      label: "Released",
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
      tabId: "details",
    },
    {
      name: "general-information-to-be-completed-by-requester-kc3oqlpn",
      type: "section",
      index: 1,
      label: "General Information",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      tabId: "details",
    },
    {
      name: "po-requestor-autocomplete",
      type: "autocomplete",
      index: 2,
      label: "Requestor",
      rules: "required",
      optionId: "3",
      optionPath: "/change_requests/available_approvers",
      placeholder: "[Select requestor here]",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: false,
      optionLabelKey: "user.email",
      optionValueKey: "id",
      validationMode: "default",
      formValuesRules: {},
      validationAttribute: "Requestor",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "po-supplier-built-in",
      type: "supplier",
      index: 3,
      label: "Supplier ",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      validationAttribute: "Supplier",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "ordered-k6mlhan7",
      type: "datepicker",
      index: 4,
      label: "Order Date",
      rules: "required",
      validators: {
        required: true,
      },
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: false,
      validationMode: "default",
      formValuesRules: {},
      validationAttribute: "Order Date",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "po-items-built-in",
      type: "purchaseorder",
      index: 5,
      label: "Purchase Order",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationAttribute: "Purchase Order",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "lineitems",
    },
  ],
};

// Added based on latest field_config and schema from demo in 22.4 release
export const PurchaseOrderNew:  IdocumentTypeDto = {
  documentTypeName: "Purchase Order New",
  documentTypeAcronym: "PO-",
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
      label: "Close PO",
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
    W: {
      label: "Revision Stage",
      visible: false,
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
      label: "Released",
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
      label: "Released",
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
      tabId: "details",
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
      validationAttribute: "PO Status",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
    {
      name: "po-items-built-in-summary",
      type: "purchaseordersummary",
      index: 1,
      label: "Summary of Totals",
      tabId: "details",
      lineItem: "po-items-built-in",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationAttribute: "Summary of Totals",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
    {
      name: "po-general-information-to-be-completed-by-requester-section",
      type: "section",
      index: 2,
      label: "General Information",
      tabId: "details",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
    },
    {
      name: "po-requestor-autocomplete",
      type: "autocomplete",
      index: 3,
      label: "Requestor",
      rules: "required",
      tabId: "details",
      hidden: false,
      deleted: false,
      optionId: "3",
      optionPath: "/change_requests/available_approvers",
      placeholder: "[Select requestor here]",
      rulesObject: {},
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: false,
      optionLabelKey: "user.email",
      optionValueKey: "id",
      outputDisabled: false,
      validationMode: "default",
      formValuesRules: {},
      editorProperties: [
        "deleteDisabled",
      ],
      validationAttribute: "Requestor",
      deleteInFormDisabled: true,
      sampleItemsIndicator: {
        id: "",
        enabled: false,
        serialNumber: 0,
        sampleSection: false,
      },
      applicableValidationSchema: true,
    },
    {
      name: "po-supplier-built-in",
      type: "supplier",
      index: 4,
      label: "Supplier ",
      tabId: "details",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationAttribute: "Supplier",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
    {
      name: "po-order-date",
      type: "datepicker",
      index: 5,
      label: "Order Date",
      rules: "required",
      tabId: "details",
      hidden: false,
      deleted: false,
      validators: {
        required: true,
      },
      rulesObject: {},
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: false,
      outputDisabled: false,
      validationMode: "default",
      formValuesRules: {},
      editorProperties: [
        "deleteDisabled",
      ],
      validationAttribute: "Order Date",
      deleteInFormDisabled: true,
      sampleItemsIndicator: {
        id: "",
        enabled: false,
        serialNumber: 0,
        sampleSection: false,
      },
      applicableValidationSchema: true,
    },
    {
      name: "po-items-built-in",
      type: "purchaseorder",
      index: 6,
      label: "Purchase Order",
      tabId: "lineitems",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationAttribute: "Purchase Order",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
    },
  ]
  ,
};
