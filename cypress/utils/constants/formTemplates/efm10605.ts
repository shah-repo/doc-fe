/* eslint-disable max-len */

import { FBSchemaProps } from "../../../../src/ui/form.builder";

/* eslint-disable @typescript-eslint/camelcase */
export const EFM10605TemplateSchema: FBSchemaProps[] = [
  {
    name: "section-i-part-information-kiapyvrw",
    type: "section",
    index: 0,
    label: "Section I - Part Information",
    tabId: "details",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    applicableValidationSchema: true,
  },
  {
    name: "lot_part_deleted",
    type: "autocomplete",
    index: 1,
    label: "Part Number:",
    tabId: "details",
    deleted: true,
    optionId: "21",
    placeholder: "[Select from the List]",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Part Number:",
    applicableValidationSchema: true,
  },
  {
    name: "lot_part",
    type: "autocomplete",
    index: 2,
    label: "Part Number:",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: false,
    optionId: "21",
    placeholder: "[Select from the List]",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Part Number:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "lot_quantity",
    type: "quantity",
    index: 3,
    label: "Quantity Recieved:",
    tabId: "details",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: true,
    editorProperties: [

    ],
    validationAttribute: "Quantity Recieved:",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
  },
  {
    name: "fai-included-km2b0iqi",
    type: "radiogroup",
    index: 4,
    label: "FAI  Required?",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: false,
    options: [
      {
        text: "Yes",
        value: "Yes",
      },
      {
        text: "No",
        value: "No",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "FAI  Required?",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "reason-for-fai-kt0liet0",
    type: "radiogroup",
    index: 5,
    label: "Reason for FAI:",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: true,
    options: [
      {
        text: "New",
        value: "New",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Reason for FAI:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "reason-for-fai-ku8u9efk",
    type: "checkboxgroup",
    index: 6,
    label: "Reason for FAI:",
    tabId: "details",
    rules: "|required_if:fai-included-km2b0iqi,Yes",
    hidden: false,
    deleted: false,
    options: [
      {
        text: "New Part Number",
        value: "New Part Number",
      },
      {
        text: "New Revision",
        value: "New Revision",
      },
      {
        text: "New Supplier",
        value: "New Supplier",
      },
      {
        text: "Supplier Process Change",
        value: "Supplier Process Change",
      },
    ],
    validators: {
      required: false,
      required_if: {
        name: "fai-included-km2b0iqi",
        value: [
          "Yes",
        ],
      },
    },
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "visibility",
    editorProperties: [

    ],
    validationAttribute: "Reason for FAI:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "reference-fai-number-kt0llk7q",
    type: "autocomplete",
    index: 7,
    label: "Reference FAI number:",
    tabId: "details",
    rules: "required_if:fai-included-km2b0iqi,Yes",
    hidden: false,
    deleted: false,
    optionId: "18",
    validators: {
      required_if: {
        name: "fai-included-km2b0iqi",
        value: [
          "Yes",
        ],
      },
    },
    placeholder: "[Select from the List]",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "visibility",
    editorProperties: [

    ],
    validationAttribute: "Reference FAI number:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "comments-kt0lhgmr",
    rows: 3,
    type: "textfield",
    index: 8,
    label: "Comments:",
    tabId: "details",
    rules: "|",
    hidden: false,
    deleted: true,
    validators: {
      required: false,
      required_if: false,
    },
    placeholder: "",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "visibility",
    editorProperties: [

    ],
    validationAttribute: "Comments:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "justification-for-fai-ku8ub8r5",
    type: "select",
    index: 9,
    label: "Justification for FAI:",
    tabId: "details",
    rules: "required_if:fai-included-km2b0iqi,No",
    hidden: false,
    deleted: false,
    options: [
      {
        text: "FAI has already been completed",
        value: "FAI has already been completed",
      },
      {
        text: "This is a development component",
        value: "This is a development component",
      },
      {
        text: "Engineer does not request FAI to be done",
        value: "Engineer does not request FAI to be done",
      },
      {
        text: "form.builder.other",
        value: "includeContext",
      },
    ],
    validators: {
      required_if: {
        name: "fai-included-km2b0iqi",
        value: [
          "No",
        ],
      },
    },
    placeholder: "[Select from the List]",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "visibility",
    editorProperties: [
      "includeContext",
    ],
    validationAttribute: "Justification for FAI:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "section-ii-inspection-kiaqfdr5",
    type: "section",
    index: 10,
    label: "Section II - Inspection",
    tabId: "details",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    applicableValidationSchema: true,
  },
  {
    name: "download-inspection-form-kiaqgbpe",
    type: "blanktplform",
    index: 11,
    label: "Download Inspection Form",
    tabId: "details",
    deleted: true,
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    defaultValue: [

    ],
    deleteDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "inspector-kiaqhv0v",
    type: "autocomplete",
    index: 12,
    label: "Inspector:",
    tabId: "details",
    multiple: true,
    optionId: "13",
    placeholder: "[Select from the List]",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    editorProperties: [
      "multiple",
    ],
    applicableValidationSchema: true,
  },
  {
    name: "attach-completed-inspection-record-kiaqinf4",
    type: "fileupload",
    index: 13,
    label: "Attach Completed Inspection Record:",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: false,
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Attach Completed Inspection Record:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "section-iii-inspection-result-kiaqjbbv",
    type: "section",
    index: 14,
    label: "Section III - Inspection Result",
    tabId: "details",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    applicableValidationSchema: true,
  },
  {
    name: "fai-results-kt0lw66v",
    type: "radiogroup",
    index: 15,
    label: "FAI Results:",
    tabId: "details",
    rules: "|",
    hidden: false,
    deleted: true,
    options: [
      {
        text: "Pass ",
        value: "Pass ",
      },
      {
        text: "Fail",
        value: "Fail",
      },
    ],
    validators: {
      required: false,
      required_if: false,
    },
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "visibility",
    editorProperties: [

    ],
    validationAttribute: "FAI Results:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "material-conforming-kiaqjn2d",
    type: "radiogroup",
    index: 16,
    label: "IQC Results:",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: false,
    options: [
      {
        text: "Pass",
        value: "Pass",
      },
      {
        text: "Fail",
        value: "Fail",
      },
    ],
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "IQC Results:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "comments-kx7t5t49",
    rows: 3,
    type: "textfield",
    index: 17,
    label: "Comments",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: false,
    placeholder: "",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Comments",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "inspector-e-signature-kiaqk9q3",
    type: "inlineapproval",
    index: 18,
    label: "Inspector eSignature:",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: true,
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    editorConfig: {

    },
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Inspector eSignature:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "section-iv-disposition-kiaqkmjs",
    type: "section",
    index: 19,
    label: "Section IV - Disposition",
    tabId: "details",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    validationMode: "default",
    applicableValidationSchema: true,
  },
  {
    name: "disposition-rationale-kiaql269",
    rows: 5,
    type: "textfield",
    index: 20,
    label: "Disposition Rationale:",
    tabId: "details",
    rules: "",
    deleted: true,
    validators: {
      required_if: false,
    },
    placeholder: "[Discuss the outcome of the non-conforming parts between R&D and Quality]",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    validationMode: "visibility",
    editorProperties: [

    ],
    validationAttribute: "Disposition Rationale:",
    applicableValidationSchema: true,
  },
  {
    name: "r-d-and-quality-e-signatures-for-non-conforming-parts-km14lceb",
    type: "inlineapproval",
    index: 21,
    label: "R&D and Quality eSignatures for non-conforming parts:",
    tabId: "details",
    rules: "",
    deleted: true,
    validators: {
      required_if: false,
    },
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    editorConfig: {

    },
    deleteDisabled: false,
    validationMode: "visibility",
    validationAttribute: "R&D and Quality eSignatures for non-conforming parts:",
    applicableValidationSchema: true,
  },
  {
    name: "reference-pre-production-nonconformance-ppnc-kmguc8l0",
    type: "autocomplete",
    index: 22,
    label: "FAI Reference Pre-Production Nonconformance (PPNC): ",
    tabId: "details",
    rules: "|",
    hidden: false,
    deleted: true,
    optionId: "18",
    validators: {
      required: false,
      required_if: false,
    },
    placeholder: "[Create a PPNC record to complete investigation and disposition of this lot]",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "visibility",
    editorProperties: [

    ],
    validationAttribute: "FAI Reference Pre-Production Nonconformance (PPNC): ",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "-kiaqmtcc",
    type: "paragraph",
    tabId: "details",
    index: 23,
    deleted: true,
    paragraph: "<p><span style=\"font-size: 18px;\"><strong>Disposition quantities; refer to attached inspection form.</strong></span></p>",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "iqc-reference-production-nonconformance-kt0m3bfs",
    type: "autocomplete",
    index: 24,
    label: "IQC Reference-Production Nonconformance (PPNC):",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: true,
    optionId: "18",
    validators: {
      required_if: false,
    },
    placeholder: "[Create a PPNC record to complete investigation and disposition of this lot]",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "visibility",
    editorProperties: [

    ],
    validationAttribute: "IQC Reference-Production Nonconformance (PPNC):",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "-kuq2winx",
    type: "paragraph",
    tabId: "details",
    index: 25,
    rules: "",
    hidden: false,
    deleted: false,
    paragraph: "<p><strong>Final disposition quantities must equal the quantity received.</strong></p>",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "accepted-kraxlhv8",
    rows: 1,
    type: "textfield",
    tabId: "details",
    index: 26,
    label: "Accepted:",
    rules: "|",
    hidden: false,
    deleted: false,
    validators: {
      required: false,
      required_if: false,
    },
    placeholder: "",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Accepted:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "r-d-use-kraxn1mh",
    rows: 1,
    type: "textfield",
    index: 27,
    label: "R&D Use:",
    tabId: "details",
    rules: "|",
    hidden: false,
    deleted: false,
    validators: {
      required: false,
      required_if: false,
    },
    placeholder: "",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "R&D Use:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "rejected-kraxlvzp",
    rows: 1,
    type: "textfield",
    index: 28,
    label: "Rejected:",
    tabId: "details",
    rules: "|",
    hidden: false,
    deleted: false,
    validators: {
      required: false,
      required_if: false,
    },
    placeholder: "",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Rejected:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "return-to-vendor-kraxm5wm",
    rows: 1,
    type: "textfield",
    index: 29,
    label: "Return to Vendor:",
    tabId: "details",
    rules: "|",
    hidden: false,
    deleted: false,
    validators: {
      required: false,
      required_if: false,
    },
    placeholder: "",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Return to Vendor:",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "approvals-kihrepmo",
    type: "inlineapproval",
    index: 30,
    label: "Quality Approvals",
    tabId: "details",
    rules: "",
    hidden: false,
    deleted: true,
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    editorConfig: {

    },
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    editorProperties: [

    ],
    validationAttribute: "Quality Approvals",
    deleteInFormDisabled: false,
    applicableValidationSchema: true,
  },
  {
    name: "fb-approvals-kkoabl58",
    type: "approvals",
    index: 31,
    label: "form.builder.approvals",
    tabId: "overview",
    deleteDisabled: true,
    uniqueSchemaItem: true,
  },
];
