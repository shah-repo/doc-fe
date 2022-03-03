/* eslint-disable max-len */
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

context("Create Company Without Logo Golden Tenant", () => {
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
    it("Upload Users List JSON", () => {
      SystemRequirement("REQ-3550");
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });
    it("Verify the empty fields for white label", () => {
      cy.get(".MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-formControl").should("have.value", "");
    });
    it("Verify the empty fields for logo", () => {
      cy.get(".MuiBox-root").should("have.value", "");
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
      cy.get("img[alt=\"Logo\"]").should("have.attr", "src", "/logo_enlil.svg");
    });
    it("Verify left default Background company color", () => {
      cy.get("#navigation").should("have.css", "background-color", "rgb(18, 27, 33)");
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

    it("Verify the Dev logo", () => {
      cy.get("img[alt=\"Logo\"]").should("have.attr", "src", "/logo_enlil.svg");
    });

    it("Verify the profile dropdown", () => {
      cy.get("[data-cy=\"header-userInitials\"]").eq(0).contains("GR").trigger("mousedown");
    });
  });
});

export { };
