import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { IdocumentTypeDto } from "../../../support/commands";

export const Seed: IdocumentTypeDto = {
  documentTypeName: "SEED",
  documentTypeAcronym: "SEED-",
  group: DOC_TYPE_GROUP.SEED_DOCUMENT,
  privateNumberPool: true,
  needsSignature: true,
  isQms: true,
  schema: [
    {
      name: "document-title-kknwyqal",
      rows: 1,
      type: "textfield",
      index: 0,
      label: "Document Title",
      rules: "required",
      placeholder: "Enter the text to be supplied in the title field of the new document",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      validationMode: "default",
      validationAttribute: "Document Title",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "document-description-kknwz9iu",
      type: "texteditor",
      index: 1,
      label: "Document Description",
      rules: "required",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      validationMode: "default",
      validationAttribute: "Document Description",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "type-of-document-to-be-created-kknx7kob",
      type: "radiogroup",
      index: 2,
      label: "Type of document to be created",
      rules: "required",
      options: [
        {
          text: "Form with output",
          value: "Form with output",
        },
        {
          text: "Document",
          value: "Document",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      validationMode: "default",
      validationAttribute: "Type of document to be created",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "document-type-to-be-selected-kknx20x4",
      type: "select",
      index: 3,
      label: "Document Type to be selected",
      rules: "required|",
      options: [
        {
          text: "Accounting",
          value: "Accounting",
        },
        {
          text: "Action Item Record",
          value: "Action Item Record",
        },
        {
          text: "Change Order",
          value: "Change Order",
        },
        {
          text: "Attendance Record",
          value: "Attendance Record",
        },
        {
          text: "Budgets",
          value: "Budgets",
        },
        {
          text: "Business document.",
          value: "Business document.",
        },
        {
          text: "Equipment Calibration",
          value: "Equipment Calibration",
        },
        {
          text: "CAPA",
          value: "CAPA",
        },
        {
          text: "Clinical Document",
          value: "Clinical Document",
        },
        {
          text: "Certificate",
          value: "Certificate",
        },
        {
          text: "Complaint",
          value: "Complaint",
        },
        {
          text: "Clinical Protocol",
          value: "Clinical Protocol",
        },
        {
          text: "Clinical Report",
          value: "Clinical Report",
        },
        {
          text: "Component Specification",
          value: "Component Specification",
        },
        {
          text: "Administrative",
          value: "Administrative",
        },
        {
          text: "Design Document",
          value: "Design Document",
        },
        {
          text: "Dynamic form",
          value: "Dynamic form",
        },
        {
          text: "Device History Record",
          value: "Device History Record",
        },
        {
          text: "Device Master Record",
          value: "Device Master Record",
        },
        {
          text: "General Document",
          value: "General Document",
        },
        {
          text: "Design Review Records",
          value: "Design Review Records",
        },
        {
          text: "Engineering builds",
          value: "Engineering builds",
        },
        {
          text: "Equipment, Fixture or Tool",
          value: "Equipment, Fixture or Tool",
        },
        {
          text: "Equipment, Fixture or Tool Specification",
          value: "Equipment, Fixture or Tool Specification",
        },
        {
          text: "Final Assembly",
          value: "Final Assembly",
        },
        {
          text: "Feedback",
          value: "Feedback",
        },
        {
          text: "Finished Good",
          value: "Finished Good",
        },
        {
          text: "Form",
          value: "Form",
        },
        {
          text: "Inspection Record",
          value: "Inspection Record",
        },
        {
          text: "Labeling",
          value: "Labeling",
        },
        {
          text: "Lot History Record",
          value: "Lot History Record",
        },
        {
          text: "Lot History Record step",
          value: "Lot History Record step",
        },
        {
          text: "Lot History Record template",
          value: "Lot History Record template",
        },
        {
          text: "Literature Reference",
          value: "Literature Reference",
        },
        {
          text: "Lot Record",
          value: "Lot Record",
        },
        {
          text: "Marketing",
          value: "Marketing",
        },
        {
          text: "Manufacturing Process Instruction",
          value: "Manufacturing Process Instruction",
        },
        {
          text: "Nonconformance",
          value: "Nonconformance",
        },
        {
          text: "Non-product Software",
          value: "Non-product Software",
        },
        {
          text: "Equipment Preventive Maintenance",
          value: "Equipment Preventive Maintenance",
        },
        {
          text: "Purchase Order",
          value: "Purchase Order",
        },
        {
          text: "PO Approval Matrix",
          value: "PO Approval Matrix",
        },
        {
          text: "Presentation",
          value: "Presentation",
        },
        {
          text: "Quality Manual",
          value: "Quality Manual",
        },
        {
          text: "Quality Plan",
          value: "Quality Plan",
        },
        {
          text: "Quality Process Instruction",
          value: "Quality Process Instruction",
        },
        {
          text: "Quality System Record",
          value: "Quality System Record",
        },
        {
          text: "Receiving Record",
          value: "Receiving Record",
        },
        {
          text: "Requirements",
          value: "Requirements",
        },
        {
          text: "Risk Management Documents",
          value: "Risk Management Documents",
        },
        {
          text: "Subassembly",
          value: "Subassembly",
        },
        {
          text: "Supplier Assessment Report",
          value: "Supplier Assessment Report",
        },
        {
          text: "Supplier Corrective Action Request",
          value: "Supplier Corrective Action Request",
        },
        {
          text: "Supply Item",
          value: "Supply Item",
        },
        {
          text: "Standard Operating Procedure",
          value: "Standard Operating Procedure",
        },
        {
          text: "Standards and Regulations",
          value: "Standards and Regulations",
        },
        {
          text: "Supplier",
          value: "Supplier",
        },
        {
          text: "Product Software",
          value: "Product Software",
        },
        {
          text: "Report",
          value: "Report",
        },
        {
          text: "Training Curriculum",
          value: "Training Curriculum",
        },
        {
          text: "User Requirements Specification or Product User Needs Document",
          value: "User Requirements Specification or Product User Needs Document",
        },
        {
          text: "Validation Plan",
          value: "Validation Plan",
        },
        {
          text: "Work Instruction",
          value: "Work Instruction",
        },
        {
          text: "Test Report",
          value: "Test Report",
        },
      ],
      optionId: "22",
      validators: {
        required: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        required_if: false,
      },
      placeholder: "Select the document type to be created in the new company",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: false,
      validationMode: "default",
      validationAttribute: "Document Type to be selected",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "json-form-kknxl2fm",
      type: "fileupload",
      index: 4,
      label: "JSON Form",
      rules: "required_if:type-of-document-to-be-created-kknx7kob,Form with output",
      validators: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        required_if: {
          name: "type-of-document-to-be-created-kknx7kob",
          value: [
            "Form with output",
          ],
        },
      },
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      validationMode: "visibility",
      validationAttribute: "JSON Form",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "define-the-output-of-that-form-kknxbkt6",
      type: "select",
      index: 5,
      label: "Define the output of that form",
      rules: "required_if:type-of-document-to-be-created-kknx7kob,Form with output",
      options: [
        {
          text: "Accounting",
          value: "Accounting",
        },
        {
          text: "Action Item Record",
          value: "Action Item Record",
        },
        {
          text: "Change Order",
          value: "Change Order",
        },
        {
          text: "Attendance Record",
          value: "Attendance Record",
        },
        {
          text: "Budgets",
          value: "Budgets",
        },
        {
          text: "Business document.",
          value: "Business document.",
        },
        {
          text: "Equipment Calibration",
          value: "Equipment Calibration",
        },
        {
          text: "CAPA",
          value: "CAPA",
        },
        {
          text: "Clinical Document",
          value: "Clinical Document",
        },
        {
          text: "Certificate",
          value: "Certificate",
        },
        {
          text: "Complaint",
          value: "Complaint",
        },
        {
          text: "Clinical Protocol",
          value: "Clinical Protocol",
        },
        {
          text: "Clinical Report",
          value: "Clinical Report",
        },
        {
          text: "Component Specification",
          value: "Component Specification",
        },
        {
          text: "Administrative",
          value: "Administrative",
        },
        {
          text: "Design Document",
          value: "Design Document",
        },
        {
          text: "Dynamic form",
          value: "Dynamic form",
        },
        {
          text: "Device History Record",
          value: "Device History Record",
        },
        {
          text: "Device Master Record",
          value: "Device Master Record",
        },
        {
          text: "General Document",
          value: "General Document",
        },
        {
          text: "Design Review Records",
          value: "Design Review Records",
        },
        {
          text: "Engineering builds",
          value: "Engineering builds",
        },
        {
          text: "Equipment, Fixture or Tool",
          value: "Equipment, Fixture or Tool",
        },
        {
          text: "Equipment, Fixture or Tool Specification",
          value: "Equipment, Fixture or Tool Specification",
        },
        {
          text: "Final Assembly",
          value: "Final Assembly",
        },
        {
          text: "Feedback",
          value: "Feedback",
        },
        {
          text: "Finished Good",
          value: "Finished Good",
        },
        {
          text: "Form",
          value: "Form",
        },
        {
          text: "Inspection Record",
          value: "Inspection Record",
        },
        {
          text: "Labeling",
          value: "Labeling",
        },
        {
          text: "Lot History Record",
          value: "Lot History Record",
        },
        {
          text: "Lot History Record step",
          value: "Lot History Record step",
        },
        {
          text: "Lot History Record template",
          value: "Lot History Record template",
        },
        {
          text: "Literature Reference",
          value: "Literature Reference",
        },
        {
          text: "Lot Record",
          value: "Lot Record",
        },
        {
          text: "Marketing",
          value: "Marketing",
        },
        {
          text: "Manufacturing Process Instruction",
          value: "Manufacturing Process Instruction",
        },
        {
          text: "Nonconformance",
          value: "Nonconformance",
        },
        {
          text: "Non-product Software",
          value: "Non-product Software",
        },
        {
          text: "Equipment Preventive Maintenance",
          value: "Equipment Preventive Maintenance",
        },
        {
          text: "Purchase Order",
          value: "Purchase Order",
        },
        {
          text: "PO Approval Matrix",
          value: "PO Approval Matrix",
        },
        {
          text: "Presentation",
          value: "Presentation",
        },
        {
          text: "Quality Manual",
          value: "Quality Manual",
        },
        {
          text: "Quality Plan",
          value: "Quality Plan",
        },
        {
          text: "Quality Process Instruction",
          value: "Quality Process Instruction",
        },
        {
          text: "Quality System Record",
          value: "Quality System Record",
        },
        {
          text: "Receiving Record",
          value: "Receiving Record",
        },
        {
          text: "Requirements",
          value: "Requirements",
        },
        {
          text: "Risk Management Documents",
          value: "Risk Management Documents",
        },
        {
          text: "Subassembly",
          value: "Subassembly",
        },
        {
          text: "Supplier Assessment Report",
          value: "Supplier Assessment Report",
        },
        {
          text: "Supplier Corrective Action Request",
          value: "Supplier Corrective Action Request",
        },
        {
          text: "Supply Item",
          value: "Supply Item",
        },
        {
          text: "Standard Operating Procedure",
          value: "Standard Operating Procedure",
        },
        {
          text: "Standards and Regulations",
          value: "Standards and Regulations",
        },
        {
          text: "Supplier",
          value: "Supplier",
        },
        {
          text: "Product Software",
          value: "Product Software",
        },
        {
          text: "Report",
          value: "Report",
        },
        {
          text: "Training Curriculum",
          value: "Training Curriculum",
        },
        {
          text: "User Requirements Specification or Product User Needs Document",
          value: "User Requirements Specification or Product User Needs Document",
        },
        {
          text: "Validation Plan",
          value: "Validation Plan",
        },
        {
          text: "Work Instruction",
          value: "Work Instruction",
        },
        {
          text: "Test Report",
          value: "Test Report",
        },
      ],
      optionId: "22",
      validators: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        required_if: {
          name: "type-of-document-to-be-created-kknx7kob",
          value: [
            "Form with output",
          ],
        },
      },
      placeholder: "Select the output of the form",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      deleteDisabled: false,
      validationMode: "visibility",
      validationAttribute: "Define the output of that form",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "default-revision-stage-kknx0vxh",
      type: "radiogroup",
      index: 6,
      label: "Default Revision Stage",
      rules: "required",
      options: [
        {
          text: "Numeric",
          value: "Numeric",
        },
        {
          text: "Alpha",
          value: "Alpha",
        },
      ],
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      validationMode: "default",
      validationAttribute: "Default Revision Stage",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "training-required-kknx4qaq",
      type: "radiogroup",
      index: 7,
      label: "Training Required",
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
      validationMode: "default",
      validationAttribute: "Training Required",
      applicableValidationSchema: true,
      tabId: "details",
    },
    {
      name: "attachments-to-be-included-kknx68g3",
      type: "fileupload",
      index: 8,
      label: "Attachments to be included",
      applicableOn: [
        "ON_STATE_TO_IN_REVIEW",
      ],
      validationMode: "default",
      validationAttribute: "Attachments to be included",
      applicableValidationSchema: true,
      tabId: "details",
    },
  ],
},