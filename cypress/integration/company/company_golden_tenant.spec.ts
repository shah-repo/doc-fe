// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
const seedFormName = "Seed Form";
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

context("Create company with golden tenant", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API]Prepare company", () => {
    SystemRequirement("REQ-3490");
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "SEED",
                documentTypeAcronym: "SEED-",
                group: "SEED_DOCUMENT",
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
                        text: "Approval Request",
                        value: "Approval Request",
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
                        text: "Approval Request",
                        value: "Approval Request",
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
                  },
                ],
              },
              {
                documentTypeName: "New Company Record",
                documentTypeAcronym: "NCO-",
                group: "NEW_COMPANY",
                privateNumberPool: true,
                canRedLine: true,
                isQms: true,
                schema: [
                  {
                    name: "company-details-kknucnd4",
                    type: "section",
                    index: 0,
                    label: "Company Details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Company Details",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "company-name-kknuh7mr",
                    rows: 1,
                    type: "textfield",
                    index: 1,
                    label: "Company Name",
                    rules: "required",
                    placeholder: "Select the company name to be used",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Company Name",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "company-abbreviation-kknuhx5k",
                    rows: 1,
                    type: "textfield",
                    index: 2,
                    label: "Company Abbreviation",
                    rules: "required",
                    placeholder: "This has to be unique in the system",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Company Abbreviation",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "company-admin-email-kknuh8mr",
                    rows: 1,
                    type: "textfield",
                    index: 3,
                    label: "Company Admin Email",
                    rules: "required",
                    placeholder: "Select the company admin email to be used",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Company Admin Email",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "companys-logo-avatar-kobccmoe",
                    type: "section",
                    index: 4,
                    label: "Client's Logo & Avatar",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "Client's Logo & Avatar",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "use-this-source-to-resize-the-company-logo-and-avatar-if-needed-kobcbize",
                    type: "hyperlink",
                    index: 5,
                    label: "Use this source to resize the company logo and avatar if needed",
                    linkUrl: "https://www.iloveimg.com/resize-image",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationAttribute: "Use this source to resize the company logo and avatar if needed",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "clients-logo-kknwh2my",
                    type: "evidencemediaupload",
                    index: 6,
                    label: "Client's Logo (max 180px x 75px)",
                    isTemplate: false,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationAttribute: "Client's Logo (max 180px x 75px)",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approved-dam-json-kljtd74j",
                    type: "section",
                    index: 7,
                    label: "APPROVED DAM JSON",
                    deleted: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "APPROVED DAM JSON",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "avatars-logo-ko2ylk33",
                    type: "evidencemediaupload",
                    index: 8,
                    label: "Client's Avatar (58px x 58px)",
                    isTemplate: false,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationAttribute: "Client's Avatar (58px x 58px)",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "white-labeling-ko2ypvsj",
                    type: "section",
                    index: 9,
                    label: "White-labeling",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "White-labeling",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "-ko2ysl4d",
                    type: "paragraph",
                    index: 10,
                    // eslint-disable-next-line max-len
                    paragraph: "<p>If the whitelabeling section is empty, the system will use default Enlil colors.</p>",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                  },
                  {
                    name: "instructions-media-upload-ko2yqqry",
                    type: "instructionsmediaupload",
                    index: 11,
                    label: "Instructions Media upload",
                    isTemplate: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationAttribute: "Instructions Media upload",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "colors-ko2ytbtm",
                    type: "subsection",
                    index: 12,
                    label: "Colors:",
                    deleted: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "Colors:",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "default-background-ko2yv2ks",
                    rows: 1,
                    type: "textfield",
                    index: 13,
                    label: "defaultBackground",
                    placeholder: "#F8921E",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    validationAttribute: "defaultBackground",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "primary-ko2yw85e",
                    rows: 1,
                    type: "textfield",
                    index: 14,
                    label: "primary",
                    placeholder: "#401A64",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    validationAttribute: "primary",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "secondary-ko2yxws8",
                    rows: 1,
                    type: "textfield",
                    index: 15,
                    label: "secondary",
                    placeholder: "#401A64",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "secondary",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "-kknufjy0",
                    type: "paragraph",
                    index: 16,
                    // eslint-disable-next-line max-len
                    paragraph: "<p>DAM JSON will include all the following details:</p>\n<ol>\n<li>List of all the documents to be created in the next company</li>\n<li>All the roles necessary as defined in the approval matrix</li>\n</ol>",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approved-dam-json-kljteki1",
                    type: "blanktplform",
                    index: 17,
                    label: "APPROVED DAM JSON",
                    gutter: false,
                    autosave: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "APPROVED DAM JSON",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approved-dam-json-is-used-kljtf3fy",
                    type: "radiogroup",
                    index: 18,
                    label: "Approved DAM json is used",
                    rules: "required",
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
                    validators: {
                      required: true,
                    },
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Approved DAM json is used",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "dom-json-kknwbegh",
                    type: "fileupload",
                    index: 19,
                    label: "DAM JSON ",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "DAM JSON ",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approved-page-details-json-kljtfrrz",
                    type: "blanktplform",
                    index: 20,
                    label: "APPROVED PAGE DETAILS JSON",
                    gutter: false,
                    autosave: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "APPROVED PAGE DETAILS JSON",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approved-page-details-json-is-used-kljtglop",
                    type: "radiogroup",
                    index: 21,
                    label: "Approved Page Details json is used",
                    rules: "required",
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
                    validators: {
                      required: true,
                    },
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Approved Page Details json is used",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "page-details-json-kknzjq6c",
                    type: "fileupload",
                    index: 22,
                    label: "Page Details JSON",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Page Details JSON",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approved-navigation-json-kljth6ck",
                    type: "blanktplform",
                    index: 23,
                    label: "APPROVED NAVIGATION JSON",
                    gutter: false,
                    autosave: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "APPROVED NAVIGATION JSON",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "approved-navigation-json-is-used-kljthw2e",
                    type: "radiogroup",
                    index: 24,
                    label: "Approved Navigation json is used",
                    rules: "required",
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
                    validators: {
                      required: true,
                    },
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Approved Navigation json is used",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "navigation-json-kknzjzkx",
                    type: "fileupload",
                    index: 25,
                    label: "Navigation JSON",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Navigation JSON",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "launching-details-kknwbuor",
                    type: "section",
                    index: 26,
                    label: "Launching Details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Launching Details",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "scheduled-go-live-date-kknwfx7f",
                    type: "datepicker",
                    index: 27,
                    label: "Scheduled Go Live Date",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Scheduled Go Live Date",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "employees-template-list-kljtijb4",
                    type: "blanktplform",
                    index: 28,
                    label: "EMPLOYEES TEMPLATE LIST",
                    gutter: false,
                    autosave: true,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "EMPLOYEES TEMPLATE LIST",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "users-list-kknwg5mb",
                    type: "fileupload",
                    index: 29,
                    label: "Users List",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Users List",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "clients-gl-codes-list-kobexykq",
                    type: "blanktplform",
                    index: 30,
                    label: "GL Codes template list",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    omitFinalValidation: true,
                    validationAttribute: "GL Codes template list",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "clients-gl-codes-list-kobez14x",
                    type: "fileupload",
                    index: 31,
                    label: "Client's GL codes list",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Client's GL codes list",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "seed-documents-to-be-included-kknz6afl",
                    type: "autocomplete",
                    index: 32,
                    label: "Seed documents to be included",
                    multiple: true,
                    optionId: "28",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Seed documents to be included",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "post-creation-records-kknzl4t6",
                    type: "section",
                    index: 33,
                    label: "Post Creation Records",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Post Creation Records",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "logs-created-kknzkrnl",
                    type: "fileupload",
                    index: 34,
                    label: "Logs Created",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Logs Created",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-approvals-klmeeadi",
                    type: "approvals",
                    index: 35,
                    label: "form.builder.approvals",
                    deleted: true,
                    deleteDisabled: false,
                    uniqueSchemaItem: true,
                  },
                ],
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create form for NCO document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${ncoFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: ncoFormName });
    });

    it("Enters description 'New NCO Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New NCO Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'New Company Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create form for SEED document", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${seedFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: seedFormName });
    });

    it("Enters description 'New Seed Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'SEED' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "SEED" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create first document from Seed Form - form with output", () => {
    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Seed'", () => {
      cy.drEnterDocumentTitle({ name: "New Seed" });
    });

    it("Enters description 'New Seed description'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed description" });
    });

    it("Enters document title 'First document'", () => {
      cy.get("[data-cy^=document-title-]").arrowType("First document");
    });

    it("Select 'Form with output' value on 'Type of document to be created'", () => {
      cy.get("[name^=type-of-document-to-be-created-]").eq(0).check();
    });

    it("Select 'Numeric' value on 'Default Revision Stage'", () => {
      cy.get("[name^=default-revision-stage-]").eq(0).check();
    });

    it("Upload JSON Form", () => {
      cy.atchUploadJSONFormForSeed({ fileName: "TestTemplate.json", queue: 0 });
    });

    it("Enters document description 'First document description'", () => {
      cy.get("[data-cy^=document-description-]>div>div>div>div>div[contenteditable]>div")
        .click({ force: true }).arrowType("First document description", { force: true });
    });

    it("Selects document type as 'Form'", () => {
      cy.get("[id^=mui-component-select-document-type-to-be-selected-]").arrowClick();
      cy.get("[id^=menu-document-type-to-be-selected-]>div:nth-child(3)>ul").contains("li", "Form").arrowClick();
    });

    it("Selects document type as 'Clinical Protocol'", () => {
      cy.get("[id^=mui-component-select-define-the-output-of-that-form-]").arrowClick();
      cy.get("[id^=menu-define-the-output-of-that-form-]>div:nth-child(3)>ul")
        .contains("li", "Clinical Protocol").arrowClick();
    });

    it("Selects 'No' training required option", () => {
      cy.get("[name^=training-required-]").eq(1).arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create second document from Seed Form - normal document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released Seed Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: seedFormName, status: "Released" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Seed 2'", () => {
      cy.drEnterDocumentTitle({ name: "New Seed 2" });
    });

    it("Enters description 'New Seed description 2'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed description 2" });
    });

    it("Enters document title 'Second document'", () => {
      cy.get("[data-cy^=document-title-]").arrowType("Second document");
    });

    it("Select 'Document' value on 'Type of document to be created'", () => {
      cy.get("[name^=type-of-document-to-be-created-]").eq(1).check();
    });

    it("Select 'Numeric' value on 'Default Revision Stage'", () => {
      cy.get("[name^=default-revision-stage-]").eq(0).check();
    });

    it("Enters document description 'Second document description'", () => {
      cy.get("[data-cy^=document-description-]>div>div>div>div>div[contenteditable]>div")
        .click({ force: true }).arrowType("Second document description", { force: true });
      cy.get("[data-cy^=document-title-]").arrowClick();
    });

    it("Selects document type as 'Clinical Protocol'", () => {
      cy.get("[id^=mui-component-select-document-type-to-be-selected-]").arrowClick();
      cy.get("[id^=menu-document-type-to-be-selected-]>div:nth-child(3)>ul")
        .contains("li", "Clinical Protocol").arrowClick();
    });

    it("Selects 'No' training required option", () => {
      cy.get("[name^=training-required-]").eq(1).check();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create NCO document from Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company description" });
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
    });

    it("Upload DOM JSON", () => {
      SystemRequirement("REQ-3520");
      cy.atchUploadDOMJSONForNCO({ fileName: "dam.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
    });

    it("Upload Page Details JSON", () => {
      SystemRequirement("REQ-3530");
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
    });

    it("Upload Navigation JSON", () => {
      SystemRequirement("REQ-3540");
      cy.atchUploadNavigationJSONForNCO({ fileName: "navigation.json", queue: 0 });
    });

    it("Error message on upload Users List with incorrect email in JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "incorrect_users.csv", queue: 0 });
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm({ toastifyExists: true });
      cy.checkToastMessageContains({ message: "email must be an email" });
      cy.closeAllAlertMessages();
      cy.get("[data-cy=\"ApproveAndRelease-cancelButton\"]").arrowClick();
      cy.get("[data-cy=\"remove-incorrect_users.csv\"]").arrowClick({ force: true });
    });

    it("Error message on upload Users List file other than json or csv", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "test.docx", queue: 0 });
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm({ toastifyExists: true });
      cy.checkToastMessageContains({ message: "has to be either CSV or JSON file!" });
      cy.closeAllAlertMessages();
      cy.get("[data-cy=\"ApproveAndRelease-cancelButton\"]").arrowClick();
      cy.get("[data-cy=\"remove-test.docx\"]").arrowClick({ force: true });
    });

    it("Upload Users List JSON", () => {
      SystemRequirement("REQ-3550");
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Refresh Seed documents input", () => {
      SystemRequirement("REQ-3570");
      cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
        cy.get("[name^=seed-documents-to-be-included-]>div>div:nth-child(2)>button").arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Seed documents", () => {
      SystemRequirement("REQ-3570");
      cy.get("[name^=seed-documents-to-be-included-]").arrowType("SEED-00001");
      cy.get("ul>li[role=option]").contains("SEED-00001").arrowClick();
      cy.unClick();
      cy.get("[name^=seed-documents-to-be-included-]").arrowType("SEED-00002");
      cy.get("ul>li[role=option]").contains("SEED-00002").arrowClick();
    });

    it("Upload logo picture 'image.jpg'", () => {
      SystemRequirement("REQ-3500");
      cy.get("[data-cy=\"albumMediaButton\"]").eq(0).arrowClick();
      cy.pmUploadAttachment({ fileName: "image.jpg" });
    });

    it("Error message on upload incorrect DAM JSON", () => {
      cy.get("[data-cy=\"remove-dam.json\"]").arrowClick({ force: true });
      cy.atchUploadDOMJSONForNCO({ fileName: "incorrect_dam.json", queue: 0 });
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm({ toastifyExists: true });
      cy.checkToastMessageContains({ message: "User email: enlil1.testmail+cy2@gmail.com is not users.csv" });
      cy.checkToastMessageContains({ message: "Group name: QA1 is not in default NCO groups list" });
      cy.closeAllAlertMessages();
      cy.get("[data-cy=\"ApproveAndRelease-cancelButton\"]").arrowClick();
      cy.get("[data-cy=\"remove-incorrect_dam.json\"]").arrowClick({ force: true });
    });

    it("Upload correct DAM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "dam.json", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      SystemRequirement("REQ-3600");
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetAttachments], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });

    it("Verify default Background company color", () => {
      cy.get("#navigation").should("have.css", "background-color", "rgb(18, 27, 33)");
    });

    it("Verify default company logo", () => {
      const tmpRegex = new RegExp( `http[s]:\\/\\/.*\\/image`, "gi" );
      cy.get("img[alt=\"Company logo\"]").invoke("attr", "src").should("match", tmpRegex);
    });

    it("Verify that tabs are lighter color when they are hovered over on Dashboard", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(0)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Document Control", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(1).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(1)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Equipment", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(2).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(2)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Supplier Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(3).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(3)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Purchase orders", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(4).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(4)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Receiving", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(5).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(5)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Manfacturing", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(6).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(6)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Group Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(7).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(7)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on User Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(8).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(8)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });
    it("Verify that tabs are lighter color when they are hovered over on Training", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(9).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(9)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });
    it("Verify the profile dropdown", () => {
      cy.get("[data-cy=\"header-userInitials\"]").eq(0).contains("GR").trigger("mousedown");
    });
  });

  context("Check document existence inside company", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Check number of documents in list", () => {
      cy.dlClearFilters();
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "5" });
    });
  });

  context("Check each document values", () => {
    it("Check first document values", () => {
      SystemRequirement("REQ-3580");
      cy.drFilterDocListByNameAndStatus({ title: "First document", status: "Draft" });
      cy.get("[id=Title-field]").contains("First document");
      cy.get("[data-cy=\"RichTextEditor.description\"]>div>div:nth-child(2)>div>div>div>div>div>div>span>span")
        .contains("First document description");
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Form");
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Clinical Protocol");
    });

    it("Check second document values", () => {
      SystemRequirement("REQ-3580");
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "Second document", status: "Draft" });
      cy.get("[id=Title-field]>div>div").contains("Second document");
      cy.get("[data-cy=\"RichTextEditor.description\"]>div>div:nth-child(2)>div>div>div>div>div>div>span>span")
        .contains("Second document description");
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Clinical Protocol");
    });

    it("Check third document values", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Draft" });
      cy.get("#Title-field").eq(0).contains("Document Approval Matrix");
      cy.get("[data-cy=\"RichTextEditor.description\"]").contains("Initial DAM Description");
    });

    it("Check forth document values", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "DAM Form", status: "Released" });
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(0).contains("DAM Form");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("DAM Form");
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(2).contains("Document Approval Matrix");
    });

    it("Check fifth document values", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "AR Form", status: "Released" });
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(0).contains("AR Form");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Approval Request Form");
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(2).contains("Approval Request");
    });
  });

  context("Check the DAM and list should be created with defined Document types, Roles and Assigned Approval", () => {
    it("Open the DAM and its status should be Draft", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Draft" });
      cy.get("#Title-field").eq(0).contains("Document Approval Matrix");
      cy.drCheckDocumentStatus({ status: "Draft" });
    });

    it("check DAM document types", () => {
      const documentTypes = [];
      cy.get("[data-cy=\"documentTypeApprovalMatrix\"]").each(($el) => {
        documentTypes.push($el.text());
      });
      cy.fixture("dam.json").then((file) => {
        cy.get(file.approvalMatrix).each((obj) => {
          expect(documentTypes).to.include(obj.docType.name);
        });
      });
    });

    it("Check DAM assigned approval roles", () => {
      const roles = [];
      cy.get("table:eq(1) tbody tr:eq(9) td").each(($el) => {
        roles.push($el.text());
      });
      cy.wrap(roles).should("have.length", 12);
      cy.fixture("dam.json").then((file) => {
        let damRoles = [];
        const approvalRoles = file.approvalMatrix[1].approvalRoles;
        damRoles.push(approvalRoles.stage1);
        damRoles.push(approvalRoles.stage2);
        damRoles.push(approvalRoles.stage3);
        damRoles.push(approvalRoles.admStage);
        damRoles = [].concat(...damRoles);

        cy.wrap(damRoles).each((obj, i) => {
          expect(obj ? "Y" : " ").eql(roles[i]);
        });
      });
    });

    it("Check DAM approval roles", () => {
      const roles = [];
      cy.get("table:eq(1) thead tr:eq(1) th").each(($el) => {
        roles.push($el.text());
      });
      cy.wrap(roles).should("have.length", 12);
      cy.fixture("dam.json").then((file) => {
        cy.wrap(roles).each((obj, i) => {
          expect(obj).eql(file.approvalRoles[i % 3].name);
        });
      });
    });
  });

  context("Verify change in DAM should update", () => {
    it("Edit DAM", () => {
      cy.get("[data-cy=\"EditBtnDAM\"]").arrowClick();
    });

    it("Make a change in DAM", () => {
      cy.get("table:eq(0) tbody tr:eq(0) td:eq(3) svg").arrowClick();
    });

    it("Click exit DAM", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"EditBtnDAM\"]").arrowClick();
        });
    });

    it("Reload page", () => {
      cy.reload();
    });

    it("change should be saved", () => {
      cy.get("table:eq(0) tbody tr:eq(0) td:eq(3)").should("have.text", "Yes");
    });
  });

  context("Check each AR values", () => {
    it("Check first AR", () => {
      cy.navigToApprovalRequestList();
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: "AR Form", status: "CLOSED" });
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(0).contains("AR Form");
      cy.get("[data-cy=\"documentRevisions.0.proposedDocumentRevision.id\"]")
        .should("have.value", "FM-00001 - rev 1 - AR Form");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Approval Request Form");
    });
  });

  context("Check group management", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Click on 'All Users' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "All Users" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "CR_OWNER_AS_APPROVER")
        .and("contain.text", "CR_ON_APPROVER_LIST")
        .and("contain.text", "EMPLOYEE_GET");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "QMS_DEFAULT")
        .and("contain.text", "FB_COMPONENT_INLINE_APPROVAL");
      cy.grpCloseDialog();
    });

    it("Click on 'User Management' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "User Management" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "EMPLOYEE_CREATE")
        .and("contain.text", "EMPLOYEE_DELETE")
        .and("contain.text", "EMPLOYEE_GET")
        .and("contain.text", "EMPLOYEE_UPDATE")
        .and("contain.text", "GROUP_UPDATE");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "USER_MANAGEMENT");
      cy.grpCloseDialog();
    });

    it("Click on 'Group Management' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Group Management" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "GROUP_CREATE")
        .and("contain.text", "GROUP_UPDATE")
        .and("contain.text", "GROUP_DELETE")
        .and("contain.text", "GROUP_CREATE_UNOFFICIAL")
        .and("contain.text", "GROUP_UPDATE_UNOFFICIAL");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "GROUP_MANAGEMENT");
      cy.grpCloseDialog();
    });

    it("Click on 'Company Admin' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Company Admin" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "EMPLOYEE_CREATE")
        .and("contain.text", "EMPLOYEE_DELETE")
        .and("contain.text", "EMPLOYEE_UPDATE")
        .and("contain.text", "GROUP_CREATE")
        .and("contain.text", "GROUP_UPDATE")
        .and("contain.text", "SLACK_APP_INSTALL")
        .and("contain.text", "COMPANY_UPDATE_CURRENT")
        .and("contain.text", "DOCUMENT_OWNER_CHANGE")
        .and("contain.text", "DEVELOPERS");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "FB_COMPONENT_PURCHASE_ORDER")
        .and("contain.text", "FB_COMPONENT_RECEIVE_PURCHASE_ORDER")
        .and("contain.text", "GROUP_MANAGEMENT")
        .and("contain.text", "USER_MANAGEMENT")
        .and("contain.text", "OWNERSHIP_CHANGE")
        .and("contain.text", "FB_COMPONENT_EQUIPMENT_MAINTENANCE")
        .and("contain.text", "DOCUMENT_TYPE_MANAGEMENT");
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'Enlil Super User' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Enlil Super User" });
      cy.get("[id=\"Group-permissions\"]").should("contain.text", "DEVELOPERS")
        .and("contain.text", "FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED")
        .and("contain.text", "HTML_UPDATE")
        .and("contain.text", "REMOTE_VALIDATORS_REFRESH")
        .and("contain.text", "GROUP_DELETE")
        .and("contain.text", "DOC_REV_OBS_TO_RELEASED")
        .and("contain.text", "COMPANY_UPDATE_CURRENT");
      cy.get("[id=\"Group-addTags\"]").should("contain.text", "NAVIGATION_WITH_RESTRICTED_DOC_TYPES")
        .and("contain.text", "CREATE_DOCS_OF_RESTRICTED_DOC_TYPES")
        .and("contain.text", "USER_MANAGEMENT")
        .and("contain.text", "DOCUMENT_TYPE_MANAGEMENT")
        .and("contain.text", "PAGE_DETAILS_MANAGEMENT")
        .and("contain.text", "COMPANY_CONFIG_WHITELABELING")
        .and("contain.text", "COMPANY_CONFIG_NAVIGATION")
        .and("contain.text", "COMPANY_CONFIG_DOCUMENT_REV_STAGES")
        .and("contain.text", "LABEL_TOOLTIPS");
      cy.grpCloseDialog();
    });

    it("Click on 'CEO' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "CEO" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'QA' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "QA" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'R&D' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "R&D" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'OPS' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "OPS" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'RA' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "RA" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'Clinical' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Clinical" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'Marketing' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Marketing" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Click on 'Doc Admin' group and check default values", () => {
      cy.grpSelectGroupWithoutClosingDialog({ name: "Doc Admin" });
      cy.get("[id=\"Group-addParentGroups\"]").should("contain.text", "All Users");
      cy.grpCloseDialog();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Check if another user can login into company created by NCO", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login as admin user and obsolete NCO document", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New company", status: "Released" });
    });

    it("Save document", () => {
      cy.drClickReviseDocument();
    });

    it("Select 'Obsolete' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Log out user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Check if company is deleted", () => {
      cy.cmpCompanyDoesntExist({ name: newCompanyName, multiple: multipleCompanies });
    });
  });
});

export { };

