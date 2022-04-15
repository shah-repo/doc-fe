// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
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

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });

    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
    });

    it("Click on 'Add Document Type'", () => {
      cy.dtmClickAddDocumentType();
    });

    it("Check for all fields inside newly added row", () => {
      cy.get("[data-grid-row-index='0']>td>input").eq(0).should("exist");
      cy.get("[data-grid-row-index='0']>td>input").eq(1).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(0).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(1).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(2).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(3).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(4).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>span>input").should("exist");
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(3).contains("Select Item").should("exist");
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(5).contains("Select Item").should("exist");
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(7).contains("Select Item").should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(5).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(5).should("be.disabled");
      cy.get("[data-grid-row-index='0']>td>span>svg").eq(0).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>svg").eq(1).should("exist");
    });


    it("Select LHR for Group and check if Equipment Prod Enforce will be enabled", () => {
      cy.dtmSelectGroup({ group: "LHR" });
      cy.get("[data-grid-row-index='0']>td>span>input").eq(5).should("be.enabled");
    });

    it("Cancel newly created document creation", () => {
      cy.get("button>span svg[class*='makeStyles-Cancel-']").arrowClick();
    });

    it("Check filters for document type management", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("left");
      cy.filterDocTypeManagement({
        status: "Active", documentType: "Receivable", acronym: "RC-",
        privateNumber: "Yes", redline: "No", qms: "Yes", needsSignature: "Yes", training: "No",
        startingNumber: "1", revisionStage: "Numeric", group: "RECEIVABLE",
        equipmentProdEnforce: "No", category: "Receive",
      });
    });

    it("Clear Filters", () => {
      cy.dtmClearFilters();
    });

    it("Click on 'Add Document Type'", () => {
      cy.dtmClickAddDocumentType();
    });
  });

  context("Add new Doc Type", () => {
    it("Add Document type name", () => {
      cy.dtmAddDocType({ docType: "Red" });
    });

    it("Add Acronym", () => {
      cy.dtmAddAcronym({ acronym: "RED" });
    });

    it("Check Private Number checkbox", () => {
      cy.dtmSelectPrivateNumber();
    });

    it("Check Redline checkbox", () => {
      cy.dtmSelectRedline();
    });

    it("Check QMS checkbox", () => {
      cy.dtmSelectQMS();
    });

    it("Check Needs Signature checkbox", () => {
      cy.dtmSelectNeedsSignature();
    });

    it("Check Training checkbox", () => {
      cy.dtmSelectTraining();
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("center").wait(1000);
    });

    it("Add Starting Number", () => {
      cy.dtmAddStartingNumber({ startingNumber: "000" });
    });
    it("Select Revision Stage 'Numeric'", () => {
      cy.dtmSelectRevisionStage({ revisionStage: "Numeric" });
    });

    it("Select Users Without Tags 'DOCUMENT_TYPE_MANAGEMENT'", () => {
      cy.dtmSelectUsersWithoutTags({ usersWithoutTags: "DOCUMENT_TYPE_MANAGEMENT" });
    });

    it("Select Group 'OTHER'", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("right").wait(1000);
      cy.dtmSelectGroup({ group: "OTHER" });
    });

    it("Create Doc Type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentTypes, () => {
        cy.get("button>span svg[class*='makeStyles-ButtonColor']").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Edit Doc Type", () => {
    it("Click on edit added Doc Type", () => {
      cy.get("button>span svg[class*='makeStyles-ButtonColor']").eq(0).arrowClick();
    });

    it("Edit Document type name", () => {
      cy.dtmAddDocType({ docType: "Yellow" });
    });

    it("Edit Acronym", () => {
      cy.dtmAddAcronym({ acronym: "YEL" });
    });

    it("Confirm Edit added Doc Type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentTypes, () => {
        cy.get("button>span svg[class*='makeStyles-ButtonColor']").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Check Export button", () => {
    it("Click 'Export DAM details'", () => {
      cy.get("button").contains("Export DAM Details").arrowClick();
    });

    it("Set file name of exported details", () => {
      cy.get("#ExportDAMDetails-fileName").arrowType("ExportDAM");
      cy.wrapWithWaitOnApiCall(CyRoutes.ExportApprovaMatrixNCO, () => {
        cy.get("[data-cy='ExportDAMDetails-downloadButton']").arrowClick();
      });
    });
  });

  context("Make newly added Doc type inactive", () => {
    it("Search for 'Yellow' Doc Type", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("Yellow").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(1).arrowType("YEL").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on edit added Doc Type", () => {
      cy.wait(1500);
      cy.get("button>span svg[class*='makeStyles-ButtonColor']").eq(0).arrowClick();
    });

    it("Inactivate doc type", () => {
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(0).arrowClick();
      cy.get("li").contains("Inactive").arrowClick();
    });

    it("Confirm Edit added Doc Type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentTypes, () => {
        cy.get("button>span svg[class*='makeStyles-ButtonColor']").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Delete newly added Doc type", () => {
    it("Click on delete Doc Type", () => {
      cy.wait(1500);
      cy.get("button>span svg[class*='makeStyles-Remove']").eq(0).arrowClick();
    });

    it("Confirm deleted Doc Type is no longer in the list", () => {
      cy.get(`[class="k-grid-norecords"]`).should("have.text", "No results found");
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

