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
const apiCreatedCompany = {
  employees: [],
  documentTypes: [],
};
let lhrUrl;
let lhrUrl1;
let lhrUrl2;
let lhrUrl3;
let lhrUrl4;
let lhrUrl5;
let createdCompany;
let adminEmployee;
let thirdEmployee;
let loginResponse;
let multipleCompanies;
let approvalRequestDocumentType;
let equipmentDocumentType;
let partDocumentType;
let MPIDocumentType;
let LHRtDocumentType;
let LHRDocumentType;
let group;
let initialArDocument;
let equipmentDocument;
let createdPartDocument;
let createdMPIDocument;
let createdLHRtDocument;
let ceoGroup;

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
        cy.atchUploadDOMJSONForNCO({ fileName: "dam_lhr.json", queue: 0 });
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

  context("Add new User, Part doc, MPI doc, LHRt doc", () => {
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
            adminEmployee = apiCreatedCompany.employees.find((employee) => employee.user.email === USERS[1].email);
            thirdEmployee = apiCreatedCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          }
        });
      }).as("response");

      cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            apiCreatedCompany.documentTypes = res.body;
            approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Approval Request");
            equipmentDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Equipment or Fixture");
            partDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Component Specification");
            MPIDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Manufacturing Process Instruction");
            LHRtDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Lot History Record Template");
            LHRDocumentType = cmpFilterDocumentTypeIdByName(apiCreatedCompany, "Lot History Record");
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

    it("[API]Create equipment one", () => {
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
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
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
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
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

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "PRT-00005",
            documentType: {
              id: partDocumentType[0].id,
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
          name: "Part document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPartDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPartDocument.id,
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

    it("[API]Create MPI document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>MPI created through API</p>",
          document: {
            docId: "PI-00001",
            documentType: {
              id: MPIDocumentType[0].id,
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
          name: "API MPI",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                label: "form.builder.mpiprocedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                index: 1,
                stepIndex: 1,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorProperties: [
                  "includeNotes",
                ],
                includeNotes: true,
                editorConfig: {
                  description: "<p>Description for step 1</p>",
                  materials: [
                    {
                      id: "kvasuama",
                      title: createdPartDocument.id,
                      quantity: 3,
                      unit: "each",
                    },
                  ],
                  equipment: [
                    {
                      id: "kvasulmm",
                      title: equipmentDocument.id,
                    },
                  ],
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                label: "Start quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Start quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-accepted-quantity",
                type: "quantity",
                index: 3,
                label: "Accepted quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Accepted quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                label: "Rejected quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Rejected quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "approvals-built-in",
                type: "approvals",
                index: 5,
                label: "Approvals",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                uniqueSchemaItem: true,
                validationAttribute: "Approvals",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdMPIDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMPIDocument.id,
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

    it("[API]Create LHRt document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHRt created with API</p>",
          document: {
            docId: "LHRT-00003",
            documentType: {
              id: LHRtDocumentType[0].id,
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
          name: "API LHRt document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [
              { id: LHRDocumentType[0].id },
            ],
            schema: [
              {
                name: "lhr-selected-part",
                type: "partsselection",
                index: 0,
                label: "Part to be Manufactured",
                deleteDisabled: true,
                deleteInFormDisabled: true,
                editorConfig: {
                  id: createdPartDocument.documentId,
                },
              },
              {
                name: "lhr_initial_quantity",
                type: "quantity",
                index: 1,
                label: "Initial Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-end-quantity",
                type: "quantity",
                index: 2,
                label: "End Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                outputDisabled: true,
                validationAttribute: "End Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-build-type",
                type: "radiogroup",
                index: 3,
                label: "Build Type",
                options: [
                  {
                    text: "R&D",
                    value: "R&D",
                  },
                  {
                    text: "Production",
                    value: "Production",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "Build Type",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-due-date",
                type: "datepicker",
                index: 4,
                label: "Due Date",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Due Date",
                applicableValidationSchema: true,
              },
              {
                name: "lhrstep-built-in",
                type: "lhrstep",
                index: 5,
                label: "LHR Step",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                applicableValidationSchema: true,
                stepIndex: 1,
                editorConfig: {
                  value: createdMPIDocument.id,
                },
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-kvateryo",
                uniqueSchemaItem: true,
                index: 6,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLHRtDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLHRtDocument.id,
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "CEO",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        ceoGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: ceoGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: thirdEmployee.id }],
        },
      });
    });

    context("Approve & Release DAM", () => {
      it("Open the DAM and its status should be Draft", () => {
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Draft" });
        cy.get("#Title-field").eq(0).contains("Document Approval Matrix");
        cy.drCheckDocumentStatus({ status: "Draft" });
      });

      it("Approve and release DAM document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Owner and operator in LHR", () => {
    context("Create LHR", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
        cy.url().then((url: any) => {
          lhrUrl = url;
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on sidebar permission icon to add group", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it("Add another group", () => {
        cy.drAddGroupFromPermissionTab("CEO");
      });

      it("Reload page", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.reload();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on sidebar permission icon to add Operators", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it(`Assign operator '${USERS[3].name}'`, () => {
        cy.drAssignDocumentTo({ username: USERS[3].name });
      });
    });

    context("Verify DAM roles and approvers in approvals", () => {
      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Verify 3 approvers should be present", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
        cy.get(".MuiAutocomplete-popper ul li").should("have.length", 3);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[1].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[2].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[3].name);
      });
    });

    context("Operator should edit LHR fields", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs operator in", () => {
        cy.authLogin({
          email: USERS[3].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Verify 3 approvers should be present", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
        cy.get(".MuiAutocomplete-popper ul li").should("have.length", 3);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[1].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[2].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[3].name);
      });

      it("Click 'START MPI'", () => {
        cy.mpiStart();
      });

      it("Add an Approval", () => {
        cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[3].name).arrowClick();
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.ebApprove();
      });

      it("visit the LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Add operator and verify checkmark should not be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[3].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Add owner and verify checkmark should not be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Add DAM role user and verify checkmark should be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Log out user", () => {
        cy.authLogout();
      });
    });

    context("LHR should submit for approval by owner", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Approve button", () => {
        cy.ebApprove();
      });
    });
  });

  context("Make one of the operators part of the DAM signatures", () => {
    context("Add a new User and add it as DAM approver", () => {
      it("Navigates to User management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Clicks on 'Add Employee'", () => {
        cy.usrClickAddEmployee();
      });

      it("Enters e-mail", () => {
        cy.usrEnterEmail({ email: USERS[4].email });
      });

      it("Enters name", () => {
        cy.usrEnterName({ name: USERS[4].name });
      });

      it("Clicks the save button", () => {
        cy.usrClickSaveButton();
      });

      it("Clicks on the close button", () => {
        cy.usrClickCloseDialogButton();
      });

      it("Navigates to Group management", () => {
        cy.grpNavigateToGroupManagement();
      });

      it("Select the 'R&D' group", function() {
        cy.get(".ReactVirtualized__Table__rowColumn").contains("R&D").arrowClick();
        cy.listLoadingElementShouldNotExist();
      });

      it("Assigns user to the group", () => {
        cy.grpAssignUser({ name: USERS[4].name });
      });

      it("Saves the group", () => {
        cy.grpSaveGroupPatch();
      });
    });

    context("Revise DAM", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Open the DAM and revise it", () => {
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Released" });
        cy.drClickReviseDocument();
      });

      it(`Add ${USERS[4].name} in approving users`, () => {
        cy.contains("Approving Users").eq(0).parent().parent().parent().parent().parent()
          .find("input").arrowClick({ force: true }).arrowType(`${USERS[4].name}{downarrow}{enter}`);
      });

      it("Click the save button", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Approve and release DAM document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create LHR", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
        cy.url().then((url: any) => {
          lhrUrl1 = url;
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
      });

      it("Click on sidebar permission icon to add group", () => {
        cy.cmpTurnOnAutosave();
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it(`Assign operator ${USERS[3].name} and ${USERS[4].name}`, () => {
        cy.drAssignDocumentTo({ username: USERS[3].name });
        cy.drAssignDocumentTo({ username: USERS[4].name });
      });
    });

    context("Operators can edit fields", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator which is part of DAM", () => {
        cy.authLogin({
          email: USERS[4].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl1);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Add operator which is not part of DAM and verify checkmark should not be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[3].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator not part of DAM", () => {
        cy.authLogin({
          email: USERS[3].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl1);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add operator which is part of DAM and verify checkmark should be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[4].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });
    });
  });

  context("Revise the DAM and add/remove signatures of Owner/Operators as required signatures", () => {
    context("Revise DAM", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with owner", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Open the DAM and revise it", () => {
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Released" });
        cy.drClickReviseDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it(`Remove ${USERS[4].name} in approving users`, () => {
        cy.contains(USERS[4].name).last().parent().parent().find(".MuiChip-deleteIcon").arrowClick();
      });

      it(`Add owner ${USERS[1].name} in approving users`, () => {
        cy.contains("Approving Users").eq(0).parent().parent().parent().parent().parent()
          .find("input").arrowClick({ force: true }).arrowType(`${USERS[1].name}{downarrow}{enter}`);
      });

      it("Click the save button", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Approve and release DAM document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create LHR", () => {
      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
        cy.url().then((url: any) => {
          lhrUrl2 = url;
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on sidebar permission icon to add group", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it(`Assign operator ${USERS[3].name} and ${USERS[4].name}`, () => {
        cy.drAssignDocumentTo({ username: USERS[3].name });
        cy.drAssignDocumentTo({ username: USERS[4].name });
      });
    });

    context("Operators can edit fields", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator not part of DAM", () => {
        cy.authLogin({
          email: USERS[3].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl2);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Add operator1 which is not part of DAM and verify checkmark should not be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[4].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator which is part of DAM", () => {
        cy.authLogin({
          email: USERS[4].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl2);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add operator2 which is not part of DAM and verify checkmark should not be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[3].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Add owner which is part of DAM and verify checkmark should be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });
    });
  });

  context("Change ownership of the LHR to someone who is in the DAM and someone who is not in the DAM", () => {
    context("Create LHR", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with owner", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.url().then((url: any) => {
          lhrUrl3 = url;
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add owner which is part of DAM and verify checkmark should be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").parent().find(".MuiChip-deleteIcon").arrowClick();
      });

      it("Change owner of document", () => {
        cy.drChangeOwnerFromMenu({ employee: USERS[4].name });
      });
    });

    context("Check LHR with new ownership", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with operator not part of DAM", () => {
        cy.authLogin({
          email: USERS[4].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl3);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add new owner which is not part of DAM and verify checkmark should not be ticked", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[4].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });
    });
  });

  context("Revise the LHRS and see if the requirements are still met in the LHR", () => {
    context("Create LHR", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in", () => {
        cy.authLogin({
          email: USERS[2].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.url().then((url: any) => {
          lhrUrl4 = url;
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStart();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("1");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("1");
      });

      it("Add an Approval", () => {
        cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[2].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.ebApprove();
      });

      it("Click 'Revise Document'", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.DocPreview,
          CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy=\"updateRecord\"]").arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Add an Approval", () => {
        cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[2].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.ebApprove();
      });

      it("visit the LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl4);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Verify 4 approvers should be present", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").arrowClick();
        cy.get(".MuiAutocomplete-popper ul li").should("have.length", 4);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[1].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[2].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[3].name);
        cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[4].name);
      });

      it("Add approver and verify checkmark should be ticked", () => {
        cy.unClick();
        cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Approve button", () => {
        cy.ebApprove();
      });

      it("Click 'Revise Document' LHR", () => {
        cy.recClickUpdateRecord();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });
    });
  });

  context("Change ownership and verify new owner is able to edit fields and add approvers.", () => {
    context("Create LHR", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with owner", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Navigate to LHR landing page", () => {
        cy.navigToLHR();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create new button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Production' build type", () => {
        cy.unClick();
        cy.get("[value=\"Production\"]").check();
        cy.url().then((url: any) => {
          lhrUrl5 = url;
        });
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Change owner of document", () => {
        cy.drChangeOwnerFromMenu({ employee: USERS[2].name });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Check LHR with new ownership", () => {
      it("Log out user", () => {
        cy.authLogout();
      });

      it("Logs in with new ownership", () => {
        cy.authLogin({
          email: USERS[2].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
      });

      it("Goto LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl5);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("New owner can add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Verify 3 roles should be present", () => {
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='QA team']").should("be.exist");
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStart();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("1");
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("1");
      });

      it("Add an Approval", () => {
        cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[2].name).arrowClick();
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        cy.ebApprove();
      });

      it("visit the LHR", () => {
        cy.wrapWithWaitOnApiCalls([
          CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
          CyRoutes.GetSpecificDocumentType, CyRoutes.DocPreview,
        ], () => {
          cy.visit(lhrUrl5);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("New owner can add approver and verify checkmark should be ticked", () => {
        cy.unClick();
        cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });

      it("Click save document", () => {
        cy.drSaveDocumentWithoutaudit();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Approve button", () => {
        cy.ebApprove();
      });

      it("Click 'Revise Document' LHR", () => {
        cy.recClickUpdateRecord();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Verify no approver should be selected", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiChip-deletable").should("not.exist");
      });

      it("Verify 3 roles should be present and disabled", () => {
        cy.get("[data-cy='form.builder.approvals']").parent().parent().parent().parent()
          .find(".MuiSvgIcon-colorDisabled").should("have.length", 3);
        cy.get("[data-cy='Harry Bartoletti']").should("be.exist");
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='Clinical Team']").should("be.exist");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");

        cy.get("[data-cy='QA team']").should("be.exist");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorDisabled");
      });

      it("Add approver and verify checkmark should be ticked", () => {
        cy.unClick();
        cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
        cy.get("[data-cy='Harry Bartoletti']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='Clinical Team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
        cy.get("[data-cy='QA team']").parent().find("svg").should("have.class", "MuiSvgIcon-colorPrimary");
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Approve button", () => {
        cy.ebApprove();
      });
    });
  });
});

export { };

