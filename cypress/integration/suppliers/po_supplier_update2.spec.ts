// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const apiCreatedCompany: any = {
  employees: [],
  documentTypes: [],
};

let multipleCompanies;
let createdCompany;
let loginResponse;
let supplierFieldName;
let poFieldName;
let adminEmployee;
let group;
let supplierDocumentType;
let poHTMLDocRevId;
let initialArDocument;
let createdOldSupplierForm;
let formDocumentType;
let approvalRequestDocumentType;
let createdReleasedSupplier;

context("DAM approvals in LHR", () => {
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

  context("Create NCO", () => {
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

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
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

      it("Upload DAM JSON", () => {
        cy.atchUploadDOMJSONForNCO({ fileName: "dam1.json", queue: 0 });
      });

      it("Select 'Yes' for 'Approved Page Details json is used'", () => {
        cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
      });

      it("Upload Page Details JSON", () => {
        cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
      });

      it("Select 'Yes' for 'Approved Navigation json is used'", () => {
        cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
      });

      it("Upload Navigation JSON", () => {
        cy.atchUploadNavigationJSONForNCO({ fileName: "navigation.json", queue: 0 });
      });

      it("Upload Users List JSON", () => {
        cy.atchUploadUserListJSONForNCO({ fileName: "dam_users.csv", queue: 0 });
      });

      it("Save document", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
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
  });

  context(`Login with user ${USERS[1].name}`, () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Intercept APIs", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/company/mine" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            apiCreatedCompany.employees = response.employees;
            createdCompany = response;
            adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          }
        });
      }).as("response");

      cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            apiCreatedCompany.documentTypes = res.body;
            supplierDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Supplier");
            approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Approval Request");
            formDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Form");
          }
        });
      }).as("response1");

      cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            loginResponse = res.body;
          }
        });
      }).as("response2");

      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      cy.wait("@response");
      cy.wait("@response1");
      cy.wait("@response2");
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("[API]Create supplier form", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "All Users",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>supplier form</p>",
              document: {
                docId: "FM-00004",
                documentType: {
                  id: formDocumentType[0].id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [
                    {
                      id: group.body[0].id,
                    },
                  ],
                },
              },
              formTemplate: {
                outputDocumentTypes: [
                  { id: supplierDocumentType[0].id },
                ],
                schema: [
                  {
                    name: "approvals-kycw6cjf",
                    type: "approvals",
                    index: 0,
                    label: "Approvals",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                ],
              },
              name: "supplier form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdOldSupplierForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdOldSupplierForm.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create released supplier with old form document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>released supplier</p>",
          document: {
            docId: "SUP-00001",
            documentType: {
              id: supplierDocumentType[0].id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
            },
          },
          name: "released supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdOldSupplierForm.id },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdReleasedSupplier = response;
        cy.drAPIApproveAndRelease({
          documentId: createdReleasedSupplier.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Verify revision is displayed when selecting Supplier in PO", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title 'New PO HTML Template Form'", () => {
        cy.drEnterDocumentTitle({ name: "New PO HTML Template Form" });
      });

      it("Enters description 'New HTML template description'", () => {
        cy.drEnterDocumentDescription({ description: "New HTML template description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Purchase Order' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Set document type", () => {
        cy.drSetDocTypeId({ docId: "00006" });
      });

      it("Click create document after filling document", () => {
        cy.intercept({ method: "GET", pathname: "/api/v1/document_revisions/*" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              const response = res.body;
              supplierFieldName = response.formTemplate.schema[3].name;
              poFieldName = response.formTemplate.schema[5].name;
            }
          });
        }).as("response");
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait("@response");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter html code into 'Render HTML' field", () => {
        cy.drEnterHtmlText({
          htmlText:
            `<html>
            <body>
               <h1>Purchase order: {{documentRevision.document.docId}}-{{documentRevision.displayRevision}}</h1>
               <div>
                  <strong>Supplier</strong>                                                                             
                  <ul>
                     <li>Name: {{autocompletes.${supplierFieldName}.name}}</li>
                     <li>Description: {{{autocompletes.${supplierFieldName}.description}}}</li>
                  </ul>
               </div>
               <div>
                  <strong>Ordered</strong>                                                                             
                  <ul>
                     {{#documentRevision.formInput.${poFieldName}.items}}                        
                     <li>Name: {{serviceId}}{{^serviceId}}{{/serviceId}}</li>
                     <li>Description: {{description}}{{^description}}{{/description}}</li>
                     <li>Ordered: {{order}} {{units}}</li>
                     <li>GL codes: {{glCode}} </li>
                     {{/documentRevision.formInput.${poFieldName}.items}}                  
                  </ul>
               </div>
               <div>
                  <strong>Total cost</strong>
                  <ul>
                     <li>Total amount: {{documentRevision.formInput.${poFieldName}.totalAmount}}</li>
                  </ul>
               </div>
               <div>
               <strong>Tax</strong>                                                                             
               <ul>
                  <li>Tax Rate: {{documentRevision.formInput.${poFieldName}.taxRate}}</li>
                  <li>Tax: {{documentRevision.formInput.${poFieldName}.tax}}</li>
               </ul>
              </div>
               <div>
                  <strong>Approvals </strong>
                  <ul>
                    {{#documentRevision.approvals}}
                     <li>Name: {{approver.user.name}}</li>
                     {{#validApprovalDates}}
                     <li>Date: {{reviewedAt}} </li>
                     {{/validApprovalDates}} 
                    {{/documentRevision.approvals}}
                  </ul>
               </div>
            </body>
         </html>`,
        });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create Purchase Order document and verify supplier", () => {
      it("Create new document from form", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enters description 'Test description'", () => {
        cy.drEnterDocumentDescription({ description: "Test description" });
      });

      it("Click 'Create A New Supplier'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[data-cy=\"form.builder.create.new.supplier\"]").arrowClick();
        });
      });

      it("Enter Supplier Title 'Supplier'", () => {
        cy.get("[data-cy=\"name\"]").arrowType("New Supplier");
      });

      it("Enter Supplier Description 'Supplier Description'", () => {
        cy.xpath("//div[@data-cy=\"description\"]/../div[2]").arrowClick();
        cy.get("[data-cy=\"description\"]>div>div>div>div>div[contenteditable]").clear()
          .arrowType("Supplier Description");
        cy.get("[data-cy=\"description\"]>div").arrowClick();
        cy.checkToastMessage({ exists: false });
      });

      it("Select Document Type 'Supplier'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetSpecificDocumentType, () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[name=\"document.documentType.id\"]").arrowType("{downarrow}{enter}");
        });
      });

      it("Create new supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
      });

      it("Verify Supplier", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 1 - New Supplier");
      });

      it("Add Required Date", () => {
        cy.get("[name^=\"ordered-\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("clicks on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.poVerifyStatus({ status: "Draft" });
      });

      it("Navigates to Supplier and Select created supplier", () => {
        cy.navigToSuppliers();
        cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00002" });
      });

      it("Verify supplier status should be 'Draft'", () => {
        cy.drCheckDocumentStatus({ status: "Draft" });
      });

      it("Release supplier", () => {
        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").eq(0).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.ebApprove();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Update Supplier name and Release it", () => {
        cy.drClickReviseDocument();
        cy.get("#Title-field input").clear().arrowType("1");
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();

        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").eq(0).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.ebApprove();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Open PO again - verify PO in Draft is updated to the newly released version of the Supplier", () => {
        cy.navigToPurchaseOrder();
        cy.dlSelectFirstDocument();
        cy.poVerifyStatus({ status: "Draft" });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 2 - New Supplier1");
      });

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[2].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("clicks on 'Save' button", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click 'Submit for Approval' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
      });

      it("check status should be 'Pending Approval'", () => {
        cy.poVerifyStatus({ status: "Pending Approval" });
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00002" });
        cy.drClickReviseDocument();
        cy.get("#Title-field input").clear().arrowType("2");
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();

        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").eq(0).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.ebApprove();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
        cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "New Supplier12");
        cy.dlClearFilters();
      });

      it("Open PO again - verify PO in Pending Approval updated to the newly released version of the Supplier", () => {
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
        cy.poVerifyStatus({ status: "Pending Approval" });
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - New Supplier12");
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it(`Logs user ${USERS[2].name} in`, () => {
        cy.authLogin({
          email: USERS[2].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
      });

      it("Approve PO", () => {
        cy.contains("PO-00001").arrowClick();
        cy.ebApprove();
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it(`Logs user ${USERS[1].name} in`, () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company and intercept APIs", () => {
        cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              loginResponse = res.body;
            }
          });
        }).as("response");

        cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
        cy.wait("@response");
      });

      it("Update Supplier name and Release it", () => {
        cy.navigToSuppliers();
        cy.supClickOnSpecificSupplierFileFromList({ item: "SUP-00002" });
        cy.drClickReviseDocument();
        cy.get("#Title-field input").clear().arrowType("3");
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();

        cy.get("[data-cy^=fb-approvals-approvals-]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").eq(0).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.ebApprove();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to PO Landing Page", () => {
        cy.navigToPurchaseOrder();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
        cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "New Supplier12");
      });

      it("Open released PO", () => {
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
      });

      it("Verify the system does not update Supplier to the latest revision when PO is released", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 3 - New Supplier12");
      });

      it("[API]Get html document and verify supplier", () => {
        cy.url().then((url: any) => {
          poHTMLDocRevId = url.split("/").pop();
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/document_revisions/generate_html/${poHTMLDocRevId}`,
            headers: {
              Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {
            const responseBody = response.body.toString();
            expect(responseBody)
              .contains("Name: New Supplier12");
          });
        });
      });

      it("Revise and release Purchase order document", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
        cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
        cy.drClickReviseDocument();
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.drEnterDocumentDescription({ description: "Test description1" });
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.ebApprove();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify the system is updating Supplier to the latest revision when PO is revised", () => {
        cy.get("[data-cy^=\"po-supplier-built-in\"]").should("have.value", "SUP-00002 - rev 4 - New Supplier123");
      });

      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlFilterByDocId({ docId: "PO-00001" });
        cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
        cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "New Supplier123");
        cy.dlClearFilters();
      });
    });
  });
});

export { };

