import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";
import { Categories } from "../categories";

export const Part: IdocumentTypeDto =   {
  documentTypeName: "Part",
  documentTypeAcronym: "PRT-",
  group: DOC_TYPE_GROUP.PART,
  isQms: true,
  needsSignature: true,
  category: Categories.Parts,
};

export const POPart: IdocumentTypeDto =  {
  documentTypeName: "PO Part",
  documentTypeAcronym: "PRT-",
  group: DOC_TYPE_GROUP.PART,
  category: Categories.Parts,
  isQms: true,
};

export const CSPart: IdocumentTypeDto = {
  documentTypeName: "Component Specifications",
  documentTypeAcronym: "CS-",
  canRedLine: true,
  isQms: true,
  needsSignature: true,
  group: DOC_TYPE_GROUP.PART,
  startingNumber: 2000,
  schema: [
    {
      name: "make-vs-buy",
      type: "select",
      index: 0,
      label: "Make vs Buy",
      options: [
        {
          text: "Make",
          value: "Make",
        },
        {
          text: "Buy",
          value: "Buy",
        },
        {
          text: "Make and buy",
          value: "Make and buy",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      editorProperties: [],
      validationAttribute: "Make vs Buy",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "primary-supplier",
      type: "autocomplete",
      index: 1,
      label: "Primary Supplier",
      rules: "required_if_in:make-vs-buy,Buy,Make and buy",
      multiple: true,
      optionId: "5",
      placeholder: "Start typing to see the list",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      showErrorMsg: false,
      deleteDisabled: true,
      validationMode: "visibility",
      editorProperties: [
        "multiple",
      ],
      omitFinalValidation: true,
      validationAttribute: "Primary Supplier",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "other-suppliers",
      type: "autocomplete",
      index: 2,
      label: "Other Suppliers",
      rules: "required_if_in:make-vs-buy,Buy,Make and buy",
      multiple: true,
      optionId: "5",
      placeholder: "Start typing to see the list",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      showErrorMsg: false,
      deleteDisabled: true,
      validationMode: "visibility",
      editorProperties: [
        "multiple",
      ],
      omitFinalValidation: true,
      validationAttribute: "Other Suppliers",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "unit-of-measure",
      type: "select",
      index: 3,
      label: "Unit of measure",
      options: [
        {
          text: "Each",
          value: "Each",
        },
        {
          text: "Roll(s)",
          value: "Roll(s)",
        },
        {
          text: "Spool(s)",
          value: "Spool(s)",
        },
        {
          text: "Set(s)",
          value: "Set(s)",
        },
        {
          text: "Box(s)",
          value: "Box(s)",
        },
        {
          text: "Case(s)",
          value: "Case(s)",
        },
        {
          text: "Lot(s)",
          value: "Lot(s)",
        },
        {
          text: "Pack(s)",
          value: "Pack(s)",
        },
        {
          text: "Pail(s)",
          value: "Pail(s)",
        },
        {
          text: "Unit(s)",
          value: "Unit(s)",
        },
        {
          text: "Bobbin(s)",
          value: "Bobbin(s)",
        },
        {
          text: "Bottle(s)",
          value: "Bottle(s)",
        },
        {
          text: "Sample(s)",
          value: "Sample(s)",
        },
        {
          text: "Batch",
          value: "Batch",
        },
        {
          text: "foot",
          value: "foot",
        },
        {
          text: "inch",
          value: "inch",
        },
        {
          text: "mm.",
          value: "mm.",
        },
        {
          text: "cm.",
          value: "cm.",
        },
        {
          text: "m.",
          value: "m.",
        },
        {
          text: "sqft.",
          value: "sqft.",
        },
        {
          text: "ar",
          value: "ar",
        },
        {
          text: "gram",
          value: "gram",
        },
        {
          text: "kilogram",
          value: "kilogram",
        },
        {
          text: "pounds",
          value: "pounds",
        },
        {
          text: "gallon",
          value: "gallon",
        },
        {
          text: "ounce",
          value: "ounce",
        },
      ],
      placeholder: "Enter",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      editorProperties: [],
      validationAttribute: "Unit of measure",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "traceability-required",
      type: "checkboxgroup",
      index: 4,
      label: "Traceability required",
      options: [
        {
          text: "Traceability required",
          value: "Traceability required",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      editorProperties: [],
      validationAttribute: "Traceability required",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "serialized",
      type: "radiogroup",
      index: 5,
      label: "Serialized",
      rules: "required_if_in:traceability-required,Traceability required",
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
      deleteDisabled: true,
      validationMode: "visibility",
      editorProperties: [],
      validationAttribute: "Serialized",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "select-serialization",
      type: "select",
      index: 6,
      label: "Select serialization",
      rules: "required_if_in:serialized,Yes",
      options: [
        {
          text: "Select Provided Serialization",
          value: "Select Provided Serialization",
        },
        {
          text: "In-house Generated Serialization",
          value: "In-house Generated Serialization",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "visibility",
      editorProperties: [],
      validationAttribute: "Select serialization",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "iqc-required",
      type: "checkboxgroup",
      index: 7,
      label: "IQC Required",
      options: [
        {
          text: "IQC Required",
          value: "IQC Required",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      editorProperties: [],
      validationAttribute: "IQC Required",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "limited-shelf-life",
      type: "checkboxgroup",
      index: 8,
      label: "Limited Shelf Life",
      options: [
        {
          text: "Limited Shelf Life",
          value: "Limited Shelf Life",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      editorProperties: [],
      validationAttribute: "Limited Shelf Life",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
    {
      name: "fai-required",
      type: "checkboxgroup",
      index: 9,
      label: "FAI Required",
      options: [
        {
          text: "FAI Required",
          value: "FAI Required",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: true,
      validationMode: "default",
      editorProperties: [],
      validationAttribute: "FAI Required",
      deleteInFormDisabled: true,
      applicableValidationSchema: true,
      tabId: "specification",
    },
  ],
};
