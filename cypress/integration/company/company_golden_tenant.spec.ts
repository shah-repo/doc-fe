// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";

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
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "SEED",
                documentTypeAcronym: "SEED-",
                group: "SEED_DOCUMENT",
                privateNumberPool: true,
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
                    deleteDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Type of document to be created",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "json-form-kknxl2fm",
                    type: "fileupload",
                    index: 3,
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
                    deleteDisabled: false,
                    validationMode: "visibility",
                    validationAttribute: "JSON Form",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "define-the-output-of-that-form-kknxbkt6",
                    type: "select",
                    index: 4,
                    label: "Define the output of that form",
                    rules: "required_if:type-of-document-to-be-created-kknx7kob,Form with output",
                    options: [
                      {
                        text: "Clinical Protocol",
                        value: "Clinical Protocol",
                      },
                      {
                        text: "Test",
                        value: "Test",
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
                    index: 5,
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
                    name: "document-type-to-be-selected-kknx20x4",
                    type: "select",
                    index: 6,
                    label: "Document Type to be selected",
                    options: [
                      {
                        text: "Form",
                        value: "Form",
                      },
                      {
                        text: "Clinical Protocol",
                        value: "Clinical Protocol",
                      },
                      {
                        text: "Test",
                        value: "Test",
                      },
                    ],
                    optionId: "22",
                    placeholder: "Select the document type to be created in the new company",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Document Type to be selected",
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
                    deleteDisabled: false,
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
                    deleteDisabled: true,
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
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Company Admin Email",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "clients-logo-kknwh2my",
                    type: "evidencemediaupload",
                    index: 4,
                    label: "Client's Logo",
                    isTemplate: false,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationAttribute: "Client's Logo",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "-kknufjy0",
                    type: "paragraph",
                    index: 5,
                    // eslint-disable-next-line max-len
                    paragraph: "<p>DAM JSON will include all the following details:</p>\n<ol>\n<li>List of all the documents to be created in the next company to be created</li>\n<li>All the roles necessary as defined in the approval matrix</li>\n</ol>",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                  },
                  {
                    name: "dom-json-kknwbegh",
                    type: "fileupload",
                    index: 6,
                    label: "DOM JSON ",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "DOM JSON ",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "page-details-json-kknzjq6c",
                    type: "fileupload",
                    index: 7,
                    label: "Page Details JSON",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Page Details JSON",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "navigation-json-kknzjzkx",
                    type: "fileupload",
                    index: 8,
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
                    index: 9,
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
                    index: 10,
                    label: "Scheduled Go Live Date",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Scheduled Go Live Date",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "users-list-kknwg5mb",
                    type: "fileupload",
                    index: 11,
                    label: "Users List",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Users List",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "seed-documents-to-be-included-kknz6afl",
                    type: "autocomplete",
                    index: 12,
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
                    index: 13,
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
                    index: 14,
                    label: "Logs Created",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Logs Created",
                    applicableValidationSchema: true,
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
        password: "Tester1!",
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
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create form for NCO document", () => {
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
      cy.get("[data-cy^=document-title-]").type("First document");
    });

    it("Select 'Form with output' value on 'Type of document to be created'", () => {
      cy.get("[name^=type-of-document-to-be-created-]").eq(0).click();
    });

    it("Select 'Numeric' value on 'Default Revision Stage'", () => {
      cy.get("[name^=default-revision-stage-]").eq(0).click();
    });

    it("Upload JSON Form", () => {
      cy.atchUploadJSONFormForSeed({ fileName: "TestTemplate.json", queue: 0 });
    });

    it("Enters document description 'First document description'", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev, CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[data-cy^=document-description-]>div>div>div>div>div[contenteditable]>div")
            .click({ force: true }).type("First document description", { force: true });
          cy.get("[data-cy^=document-title-]").click();
        });
    });

    it("Selects document type as 'Form'", () => {
      cy.get("[id^=mui-component-select-document-type-to-be-selected-]").click();
      cy.get("[id^=menu-document-type-to-be-selected-]>div:nth-child(3)>ul>li:nth-child(2)").click();
    });

    it("Selects document type as 'Clinical Protocol'", () => {
      cy.get("[id^=mui-component-select-define-the-output-of-that-form-]").click();
      cy.get("[id^=menu-define-the-output-of-that-form-]>div:nth-child(3)>ul>li:nth-child(2)").click();
    });

    it("Selects 'No' training required option", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev, CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[name^=training-required-]").eq(1).click();
        });
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
      cy.get("[data-cy^=document-title-]").type("Second document");
    });

    it("Select 'Document' value on 'Type of document to be created'", () => {
      cy.get("[name^=type-of-document-to-be-created-]").eq(1).click();
    });

    it("Select 'Numeric' value on 'Default Revision Stage'", () => {
      cy.get("[name^=default-revision-stage-]").eq(0).click();
    });

    it("Enters document description 'Second document description'", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev, CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[data-cy^=document-description-]>div>div>div>div>div[contenteditable]>div")
            .click({ force: true }).type("Second document description", { force: true });
          cy.get("[data-cy^=document-title-]").click();
        });
    });

    it("Selects document type as 'Clinical Protocol'", () => {
      cy.get("[id^=mui-component-select-document-type-to-be-selected-]").click();
      cy.get("[id^=menu-document-type-to-be-selected-]>div:nth-child(3)>ul>li:nth-child(3)").click();
    });

    it("Selects 'No' training required option", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev, CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[name^=training-required-]").eq(1).click();
        });
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
      cy.get("[name^=company-name-]").type(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").type(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").type(USERS[1].email);
    });

    it("Upload DOM JSON", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.atchUploadDOMJSONForNCO({ fileName: "dam.json", queue: 0 });
        });
    });

    it("Upload Page Details JSON", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
        });
    });

    it("Upload Navigation JSON", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.atchUploadNavigationJSONForNCO({ fileName: "navigation.json", queue: 0 });
        });
    });

    it("Upload Users List JSON", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
        });
    });

    it("Include Seed documents", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.DocRevGet], () => {
          cy.get("[name^=seed-documents-to-be-included-]>div>div:nth-child(2)>button").click();
        });
      cy.wait(1500);
      cy.get("[name^=seed-documents-to-be-included-]").type("SEED-00001{downarrow}{enter}");
      cy.get("[name^=seed-documents-to-be-included-]").type("SEED-00002{downarrow}{enter}");
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.get("[data-cy=\"media.upload\"]>div>div>button").click();
      cy.pmUploadAttachment({ fileName: "image.jpg" });
    });

    it("Approve and release document - create company", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview,
        CyRoutes.EmployeesGet, CyRoutes.GetAttachments], () => {
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
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
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
      cy.drFilterDocListByNameAndStatus({ title: "First document", status: "Draft" });
      cy.get("[id=Title-field]").contains("First document");
      cy.get("[data-cy=\"RichTextEditor.description\"]>div>div:nth-child(2)>div>div>div>div>div>div>span>span")
        .contains("First document description");
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Form");
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Clinical Protocol");
    });

    it("Check second document values", () => {
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
      cy.drFilterDocListByNameAndStatus({ title: "Document Approval Matrix", status: "Released" });
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(0).contains("Document Approval Matrix");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Initial DAM Description");
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

  context("Check each AR values", () => {
    it("Check first AR", () => {
      cy.navigToApprovalRequestList();
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: "AR Form", status: "Closed" });
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(0).contains("AR Form");
      cy.get("[data-cy=\"documentRevisions.0.proposedDocumentRevision.id\"]")
        .should("have.value", "FM-00001 - rev 1 - AR Form");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Approval Request Form");
    });

    it("Check second AR", () => {
      cy.navigToApprovalRequestList();
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: "Releasing DAM-00003, Document Approval Matrix", status: "Closed" });
      cy.get("[data-cy=\"SummaryBaseProps-values\"]").eq(0).contains("Releasing DAM-00003, Document Approval Matrix");
      cy.get("[data-cy=\"documentRevisions.0.proposedDocumentRevision.id\"]")
        .should("have.value", "DAM-00003 - rev 1 - Document Approval Matrix");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Releasing DAM-00003, Document Approval Matrix");
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Check if another user can login into company created by NCO", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
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
        password: "Tester1!",
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
        password: "Tester1!",
      });
    });

    it("Check if company is deleted", () => {
      cy.cmpCompanyDoesntExist({ name: newCompanyName, multiple: multipleCompanies });
    });
  });
});

export { };
