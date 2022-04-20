// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let loggedInEmployee;
let equipmentDocumentType;
let formDocumentType;
let maintenanceRecordDocumentType;
let toolingDocType;
let approvalRequestDocumentType;
let initialArDocument;
let createdEquipmentFormDocument;
let createdPMForm;
let createdCalibrationForm;
let createdPMRecord;
let createdCalibrationRecord;
let createdEquipmentNumericRevision;
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;


context("NCO document type management", () => {
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
          loggedInEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          done();
        });
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
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });
  });

  context("Create form for NCO document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
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
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
    });

    it("Upload correct DAM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "doc_type_DAM.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "doc_type_page_details.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.GetAttachments], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Prepare new Company", () => {
    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        loggedInEmployee = loginResponse.employees.find((emp) => emp.company.name.includes(newCompanyName));
        done();
      });
    });

    it("[API]Get newly created NCO company", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/document_type`,
        headers: {
          Authorization: `bearer ${loggedInEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((res) => {
        if (res.body.length > 0 ) {
          approvalRequestDocumentType = res.body.find(
            (docType: any) => docType.documentTypeName === "Approval Request"
          );
          equipmentDocumentType = res.body.find((docType: any) => docType.documentTypeName === "Equipment or Fixture");
          formDocumentType = res.body.find((docType: any) => docType.documentTypeName === "Form");
          maintenanceRecordDocumentType = res.body.find(
            (docType: any) => docType.documentTypeName === "Equipment Preventive Maintenance"
          );
        }
        done();
      });
    });

    it("[API]Create Equipment form", (done: any) => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: loggedInEmployee.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response ? response[0] : {};
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Maintenance and Calibration form</p>",
            document: {
              docId: "FM-00003",
              documentType: {
                id: formDocumentType.id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [],
              },
            },
            name: "Maintenance and calibration form document",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: equipmentDocumentType.id,
              }],
              schema: [
                {
                  name: "fb-default-eq-status",
                  type: "radiogroup",
                  index: 0,
                  label: "EQ Status",
                  rules: "required",
                  options: [
                    {
                      text: "Active",
                      value: "Active",
                    },
                    {
                      text: "Inactive",
                      value: "Inactive",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  deleteInFormDisabled: true,
                },
                {
                  name: "fb-primary-owner-eq",
                  type: "autocomplete",
                  index: 1,
                  label: "Primary Owner",
                  optionId: "13",
                  placeholder: "Select employee as primary owner",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationAttribute: "Primary Owner",
                  deleteInFormDisabled: true,
                  applicableValidationSchema: true,
                },
                {
                  name: "fb-coordinator-eq",
                  type: "autocomplete",
                  index: 2,
                  label: "Coordinator",
                  optionId: "13",
                  placeholder: "Select employee as coordinator",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationAttribute: "Coordinator",
                  deleteInFormDisabled: true,
                  applicableValidationSchema: true,
                },
                {
                  index: 3,
                  type: "eqmaintenance",
                  name: "pm-ki5wtk5l",
                  editorConfig: {
                    type: "preventativeMaintenance",
                  },
                  editorProperties: [],
                  label: "Preventative Maintenance",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  applicableValidationSchema: true,
                  validationAttribute: "PM",
                },
                {
                  index: 4,
                  type: "eqmaintenance",
                  name: "calibration-ki5wtyj0",
                  editorConfig: {
                    type: "calibration",
                  },
                  editorProperties: [],
                  label: "Calibration",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  applicableValidationSchema: true,
                  validationAttribute: "Calibration",
                },
                {
                  name: "location-kngiboz9",
                  type: "select",
                  index: 5,
                  label: "Location:",
                  options: [
                    {
                      text: "R&D ",
                      value: "R&D ",
                    },
                    {
                      text: "Hemolysis ",
                      value: "Hemolysis ",
                    },
                    {
                      text: "Portable",
                      value: "Portable",
                    },
                    {
                      text: "CER (Controlled Environment Room)",
                      value: "CER (Controlled Environment Room)",
                    },
                    {
                      text: "IQC",
                      value: "IQC",
                    },
                    {
                      text: "form.builder.other",
                      value: "includeContext",
                    },
                  ],
                  placeholder: "[Select from the List]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  validationMode: "default",
                  editorProperties: [
                    "includeContext",
                  ],
                  validationAttribute: "Location:",
                  applicableValidationSchema: true,
                },
              ],
            },

          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then((response) => {
          createdEquipmentFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdEquipmentFormDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType.id },
              formDocument: { id: initialArDocument.id },
              approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
            },
            employeeId: loggedInEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });
    });

    it("[API]Create PM form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PM form</p>",
          document: {
            docId: "FM-00004",
            documentType: {
              id: formDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Preventative Maintenance form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: maintenanceRecordDocumentType.id,
            }],
            schema: [
              {
                name: "fb-maintenance-details-section",
                type: "section",
                index: 0,
                label: "Maintenance Details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kybkhbpt",
                uniqueSchemaItem: true,
                index: 5,
              },
            ],
          },

        },
        employeeId: loggedInEmployee.id,
        sessionId: loginResponse.sessionId,
      }).then((response) => {
        createdPMForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPMForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Calibration form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Calibration form</p>",
          document: {
            docId: "FM-00005",
            documentType: {
              id: formDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Calibration form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: maintenanceRecordDocumentType.id,
            }],
            schema: [
              {
                name: "fb-maintenance-details-section",
                type: "section",
                index: 0,
                label: "Maintenance Details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_id",
                type: "autocomplete",
                index: 1,
                label: "Equipment",
                rules: "required",
                optionId: "20",
                placeholder: "[Select revision here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "equipment_maintainer",
                type: "autocomplete",
                index: 2,
                label: "Maintainer",
                rules: "required",
                optionId: "13",
                placeholder: "[Select name here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-equipment_due_date",
                type: "datepicker",
                index: 3,
                label: "Completion Date",
                rules: "required",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-requipment-maintenance-section",
                type: "textfield",
                index: 4,
                label: "Equipment Maintenance Section",
                rules: "required",
                hidden: true,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                deleteInFormDisabled: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kybkhbpt",
                uniqueSchemaItem: true,
                index: 5,
              },
            ],
          },

        },
        employeeId: loggedInEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Equipment document with Numeric revision", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
          document: {
            docId: "EQ-00001",
            documentType: {
              id: equipmentDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Equipment document",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "fb-default-eq-status": "Active",
            "fb-primary-owner-eq": loggedInEmployee.id,
            "fb-coordinator-eq": loggedInEmployee.id,
            "pm-ki5wtk5l": {
              requirements: "Yes",
              preventativeForm: createdPMForm.documentId,
              frequency: 10,
              instructions: "<p>Instructions for preventative maintenance</p>",
            },
            "calibration-ki5wtyj0": {
              requirements: "Yes",
              preventativeForm: createdCalibrationForm.documentId,
              frequency: 5,
              instructions: "<p>Instructions for calibration</p>",
            },
            "location-kngiboz9": "IQC",
          },
        },
        employeeId: loggedInEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Equipment document with Numeric revision", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document 2</p>",
          document: {
            docId: "EQ-00002",
            documentType: {
              id: equipmentDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Equipment document 2",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "fb-default-eq-status": "Active",
            "fb-primary-owner-eq": loggedInEmployee.id,
            "fb-coordinator-eq": loggedInEmployee.id,
            "pm-ki5wtk5l": {
              requirements: "Yes",
              preventativeForm: createdPMForm.documentId,
              frequency: 10,
              instructions: "<p>Instructions for preventative maintenance</p>",
            },
            "calibration-ki5wtyj0": {
              requirements: "Yes",
              preventativeForm: createdCalibrationForm.documentId,
              frequency: 5,
              instructions: "<p>Instructions for calibration</p>",
            },
            "location-kngiboz9": "Portable",
          },
        },
        employeeId: loggedInEmployee.id,
        sessionId: loginResponse.sessionId,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Equipment document with Numeric revision", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Equipment document</p>",
          document: {
            docId: "EQ-00003",
            documentType: {
              id: equipmentDocumentType.id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Equipment document",
          formDocument: {
            id: createdEquipmentFormDocument.id,
          },
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "fb-default-eq-status": "Active",
            "fb-primary-owner-eq": loggedInEmployee.id,
            "fb-coordinator-eq": loggedInEmployee.id,
            "pm-ki5wtk5l": {
              requirements: "Yes",
              preventativeForm: createdPMForm.documentId,
              frequency: 10,
              instructions: "<p>Instructions for preventative maintenance</p>",
            },
            "calibration-ki5wtyj0": {
              requirements: "Yes",
              preventativeForm: createdCalibrationForm.documentId,
              frequency: 5,
              instructions: "<p>Instructions for calibration</p>",
            },
            "location-kngiboz9": "R&D ",
          },
        },
        employeeId: loggedInEmployee.id,
        sessionId: loginResponse.sessionId,
      }).then((response) => {
        createdEquipmentNumericRevision = response;
        cy.drAPIApproveAndRelease({
          documentId: createdEquipmentNumericRevision.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create PM record for equipment in numeric version", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdPMForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentNumericRevision.id,
            "equipment_maintainer": loggedInEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentNumericRevision.id,
          },
          equipmentSection: "pm-ki5wtk5l",
          description: "",
          name: "Preventative maintenance document",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MR-00001",
            securityList: {
              securityEmployees: [],
              securityGroups: [],
              operators: [],
            },
            documentType: {
              id: maintenanceRecordDocumentType.id,
            },
          },
        },
        employeeId: loggedInEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPMRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPMRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Create Calibration record for equipment in numeric version", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          formDocument: {
            id: createdCalibrationForm.id,
          },
          formInput: {
            "equipment_id": createdEquipmentNumericRevision.id,
            "equipment_maintainer": loggedInEmployee.id,
            "fb-approvals-kybkhbpt": [],
            "fb-equipment_due_date": moment().tz("America/Los_Angeles"),
          },
          parentEquipment: {
            id: createdEquipmentNumericRevision.id,
          },
          equipmentSection: "calibration-ki5wtyj0",
          description: "",
          name: "Calibration record",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "MR-00002",
            securityList: {
              securityEmployees: [],
              securityGroups: [],
              operators: [],
            },
            documentType: {
              id: maintenanceRecordDocumentType.id,
            },
          },
        },
        employeeId: loggedInEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCalibrationRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdCalibrationRecord.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType.id },
            formDocument: { id: initialArDocument.id },
            approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
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
      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
    });
  });

  context("Navigate and verify Equipment Landing Page", () => {
    it("Click on Equipment list", () => {
      cy.navigToEquipmentList();
    });

    it("Verify Owner title column", () => {
      cy.get("[class='k-column-title']").eq(4).should("have.text", "Owner");
    });

    it("Verify Owner title column", () => {
      cy.get("[class='k-column-title']").eq(8).should("have.text", "Location");
    });

    it("Filter by Owner & Location", () => {
      cy.filterEquipByOwnerAndLocation({ owner: USERS[1].name, location: "IQC" });
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Clear Filters", () => {
      cy.dtmClearFilters();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
    });
  });

  context("Create equipment maintenace document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click 'ADD NEW EQUIPMENT'", () => {
      cy.get("[id='DocumentByTypeListPresenter-openDocRev']").arrowClick();
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocPreview], () => {
        cy.get("div[id^=react-select]").contains("Equipment or Fixture").arrowClick();
      });
    });

    it("Enter title 'Equipment maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Manual Equipment" });
    });

    it("Enter description 'Equipment maintenance'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment maintenance Manual" });
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check();
    });

    it("Select Primary Owner", () => {
      // cy.get("[data-cy='fb-primary-owner-eq']").arrowType(USERS[1].name);
      cy.get("[data-cy*='fb-primary-owner-eq']").eq(0).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick();
    });

    it("Select 'Maintenance record form' for preventative maintenance required", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Preventative Maintenance form").arrowClick();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType("10");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"pm\")]/../div[2]")
        .type("Instructions for preventative maintenance").wait(500);
      cy.unClick();
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick();
    });

    it("Select 'Maintenance record form' for calibration required", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType("5");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
        .type("Instructions for calibration").wait(500);
      cy.unClick();
    });

    it("Select Portable Location", () => {
      cy.get("[id*=select-location]").eq(0).arrowClick();
      cy.get("ul>li[data-value='Portable']").arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    context("Verify owner", () => {
      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
      });

      it("Filter by title", () => {
        cy.filterEquipmentTitle({ name: "Manual Equipment" });
      });

      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify Owner name", () => {
        Cypress.Commands.add("dlVerifyOwnerIsPresentOnFirstDocument", () => {
          cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[1].name);
        });
      });

      it("Change Primary Owner", () => {
        cy.get("[aria-label='Open']").eq(1).arrowClick();
        cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall']").eq(0).arrowClick();
        cy.get("[data-cy*='fb-primary-owner-eq']").eq(0).arrowClick();
        cy.get("ul>li[role=\"option\"]").contains(USERS[2].name).arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
      });

      it("Verify Owner name", () => {
        Cypress.Commands.add("dlVerifyOwnerIsPresentOnFirstDocument", () => {
          cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[2].name);
        });
      });
    });

    context("Release EQ", () => {
      it("[API] Release EQ'", (done: any) => {
        cy.drGetDocRevs({ employeeId: loggedInEmployee.id, sessionId: loginResponse.sessionId })
          .then((documentRevisionsRes) => {
            const manualDocRev = (documentRevisionsRes || []).find((x: any) => x.name === "Manual Equipment") as any;
            cy.drAPIApproveAndRelease({
              documentId: manualDocRev.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType.id },
                formDocument: { id: initialArDocument.id },
                approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
              },
              employeeId: loggedInEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
      });


      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Revise EQ and verify owner", () => {
      it("Revise Equipment", () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      });
      it("Change Primary Owner", () => {
        cy.get("[aria-label='Open']").eq(1).arrowClick();
        cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall']").eq(0).arrowClick();
        cy.get("[data-cy*='fb-primary-owner-eq']").eq(0).arrowClick();
        cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
      });

      it("Verify Owner name", () => {
        Cypress.Commands.add("dlVerifyOwnerIsPresentOnFirstDocument", () => {
          cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[1].name);
        });
      });
    });
  });


  context("Create Tooling Eqipment", () => {
    context("Add Tooling DocRev", () => {
      it("[API]Get Company and DocTypes", (done: any) => {
        cy.request({
          method: "GET",
          url: `${CONFIG.BE_URL}/api/v1/document_type`,
          headers: {
            Authorization: `bearer ${loggedInEmployee.id}:${loginResponse.sessionId}`,
          },
        }).then((res) => {
          if (res.body.length > 0 ) {
            toolingDocType = res.body.find(
              (docType: any) => docType.documentTypeName.includes("Tool")
            );
          }
          done();
        });
      });

      it("[API]Create TL form", (done: any) => {
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: loggedInEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response ? response[0] : {};
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Tooling form</p>",
              document: {
                docId: "FM-00006",
                documentType: {
                  id: formDocumentType.id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [],
                },
              },
              name: "Tooling form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: toolingDocType.id,
                }],
                schema: [
                  {
                    name: "fb-default-eq-status",
                    type: "radiogroup",
                    index: 0,
                    label: "EQ Status",
                    rules: "required",
                    options: [
                      {
                        text: "Active",
                        value: "Active",
                      },
                      {
                        text: "Inactive",
                        value: "Inactive",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "fb-primary-owner-eq",
                    type: "autocomplete",
                    index: 1,
                    label: "TL Owner",
                    optionId: "13",
                    placeholder: "Select employee as primary owner",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Primary Owner",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-coordinator-eq",
                    type: "autocomplete",
                    index: 2,
                    label: "Coordinator",
                    optionId: "13",
                    placeholder: "Select employee as coordinator",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Coordinator",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    index: 3,
                    type: "eqmaintenance",
                    name: "pm-ki5wtk5l",
                    editorConfig: {
                      type: "preventativeMaintenance",
                    },
                    editorProperties: [],
                    label: "Preventative Maintenance",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "PM",
                  },
                  {
                    index: 4,
                    type: "eqmaintenance",
                    name: "calibration-ki5wtyj0",
                    editorConfig: {
                      type: "calibration",
                    },
                    editorProperties: [],
                    label: "Calibration",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Calibration",
                  },
                  {
                    name: "location-kngiboz9",
                    type: "select",
                    index: 5,
                    label: "Location:",
                    options: [
                      {
                        text: "R&D ",
                        value: "R&D ",
                      },
                      {
                        text: "Hemolysis ",
                        value: "Hemolysis ",
                      },
                      {
                        text: "Portable",
                        value: "Portable",
                      },
                      {
                        text: "CER (Controlled Environment Room)",
                        value: "CER (Controlled Environment Room)",
                      },
                      {
                        text: "IQC",
                        value: "IQC",
                      },
                      {
                        text: "form.builder.other",
                        value: "includeContext",
                      },
                    ],
                    placeholder: "[Select from the List]",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    editorProperties: [
                      "includeContext",
                    ],
                    validationAttribute: "Location:",
                    applicableValidationSchema: true,
                  },
                ],
              },

            },
            employeeId: loggedInEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            createdEquipmentFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEquipmentFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType.id },
                formDocument: { id: initialArDocument.id },
                approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
              },
              employeeId: loggedInEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });

      it("[API]Create Tooling document with Numeric revision", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Equipment document</p>",
            document: {
              docId: "TL-00001",
              documentType: {
                id: toolingDocType.id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [],
              },
            },
            name: "Tooling document",
            formDocument: {
              id: createdEquipmentFormDocument.id,
            },
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formInput: {
              "fb-default-eq-status": "Active",
              "fb-primary-owner-eq": loggedInEmployee.id,
              "fb-coordinator-eq": loggedInEmployee.id,
              "pm-ki5wtk5l": {
                requirements: "Yes",
                preventativeForm: createdPMForm.documentId,
                frequency: 10,
                instructions: "<p>Instructions for preventative maintenance</p>",
              },
              "calibration-ki5wtyj0": {
                requirements: "Yes",
                preventativeForm: createdCalibrationForm.documentId,
                frequency: 5,
                instructions: "<p>Instructions for calibration</p>",
              },
              "location-kngiboz9": "Portable",
            },
          },
          employeeId: loggedInEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    context("Verify owner", () => {
      it("Clear Filters", () => {
        cy.dtmClearFilters();
        cy.dlVerifyDocumentCount({ numberOfDoc: 6 });
      });


      it("Filter by title", () => {
        cy.filterEquipmentTitle({ name: "Tooling document" });
      });

      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify Owner name", () => {
        Cypress.Commands.add("dlVerifyOwnerIsPresentOnFirstDocument", () => {
          cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[1].name);
        });
      });

      it("Change Primary Owner", () => {
        cy.get("[aria-label='Open']").eq(1).arrowClick();
        cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall']").eq(0).arrowClick();
        cy.get("[data-cy*='fb-primary-owner-eq']").eq(0).arrowClick();
        cy.get("ul>li[role=\"option\"]").contains(USERS[2].name).arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
      });

      it("Verify Owner name", () => {
        Cypress.Commands.add("dlVerifyOwnerIsPresentOnFirstDocument", () => {
          cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[2].name);
        });
      });
    });

    context("Release EQ", () => {
      it("[API] Release EQ'", (done: any) => {
        cy.drGetDocRevs({ employeeId: loggedInEmployee.id, sessionId: loginResponse.sessionId })
          .then((documentRevisionsRes) => {
            const manualDocRev = (documentRevisionsRes || []).find((x: any) => x.name === "Tooling document") as any;
            cy.drAPIApproveAndRelease({
              documentId: manualDocRev.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType.id },
                formDocument: { id: initialArDocument.id },
                approversWithSignatures: [{ approver: { id: loggedInEmployee.id } }],
              },
              employeeId: loggedInEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
      });
    });

    context("Revise EQ and verify owner", () => {
      it("Select first Equipment on list", () => {
        cy.dlSelectFirstDocument();
      });

      it("Revise Equipment", () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      });

      it("Change Primary Owner", () => {
        cy.get("[aria-label='Open']").eq(1).arrowClick();
        cy.get("[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall']").eq(0).arrowClick();
        cy.get("[data-cy*='fb-primary-owner-eq']").eq(0).arrowClick();
        cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click on Equipment list", () => {
        cy.navigToEquipmentList();
      });

      it("Verify Owner name", () => {
        Cypress.Commands.add("dlVerifyOwnerIsPresentOnFirstDocument", () => {
          cy.get("tr.k-master-row").first().find("td").eq(4).contains(USERS[1].name);
        });
      });
    });
  });

});

export { };
