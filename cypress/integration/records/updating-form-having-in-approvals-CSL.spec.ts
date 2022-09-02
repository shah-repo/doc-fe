// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
//
//
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let adminEmployeeLoginResponse;
let employeeLoginAdmin;

const ADMIN_USER = USERS[10];
const FIRST_USER = USERS[11];
const SECOND_USER = USERS[12];
const THIRD_USER = USERS[13];
const INDIVIDUAL_USER = USERS[14];

const documentType = "Form";
const outputDocumentType = "Component Specification Lot";

const documentName = "ENC-12536 Scenario 1 - CSL";
const record1Name = "Record 1";
const record2Name = "Record 2";

const testName = "Updating form having inline approvals CSL";

let documentUrl: string;
let record1Url: string;
let record2Url: string;

context(testName, () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API] Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER, INDIVIDUAL_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          employeeLoginAdmin = company.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        done();
      });
    });
  });

  context("Log in admin", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: employeeLoginAdmin.id });
    });
  });

  context("Create document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: documentName });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it(`Select document type: ${documentType}`, () => {
      cy.drSelectDocumentType({ documentType });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it(`Select '${outputDocumentType}' output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: outputDocumentType });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });
  });

  context("Release document", () => {
    it("Add Inline Approval 1", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
      cy.fbEnterNameValue({ name: "label", value: "Inline Approval 1" });
      cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Owner as approver");
      cy.fbAddNewFieldButton();
    });

    it("Add Text field", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "Text" });
      cy.fbAddNewFieldButton();
    });

    it("Add Inline Approval 2", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
      cy.fbEnterNameValue({ name: "label", value: "Inline Approval 2" });
      cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.url().then((url: string) => { documentUrl = url; });
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "RELEASED" });
    });
  });

  context(`Create ${record1Name}`, () => {
    it("Create new", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: record1Name });
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "WIP" });
    });

    it("Add inline approver 1", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").eq(0).autocompleteSelect(`${ADMIN_USER.email}`);
    });

    it("Click Request Approval button", () => {
      cy.contains("Request approval").arrowClick();
    });

    it("Approve inline approval", () => {
      cy.inlineApproval();
    });

    it("Verify Revision 1", () => {
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy=revision]").eq(1).click();
      cy.drCheckDocumentStatus({ status: "LAST SIGNED" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 1");
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy=revision]").eq(0).click();
    });

    it("Add inline approver 2", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").eq(1).autocompleteSelect(`${ADMIN_USER.email}`);
    });

    it("Click Request Approval button", () => {
      cy.contains("Request approval").arrowClick();
    });

    it("Approve inline approval", () => {
      cy.inlineApproval();
    });

    it("Verify Revision 2", () => {
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy=revision]").eq(1).click();
      cy.drCheckDocumentStatus({ status: "LAST SIGNED" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 2");
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy=revision]").eq(0).click();
    });

    it("Verify Revision 1", () => {
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy=revision]").eq(2).click();
      cy.drCheckDocumentStatus({ status: "ARCHIVE" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 1");
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy=revision]").eq(0).click();
    });

    it("Save document", () => {
      cy.url().then((url: string) => { record1Url = url; });
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context(`Create ${record2Name}`, () => {
    it("Go to document", () => {
      cy.visit(documentUrl);
    });

    it("Create new", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "WIP" });
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: record2Name });
    });

    it("Save document", () => {
      cy.url().then((url) => record2Url = url);
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Revise and remove approvals", () => {
    it("Go to document", () => {
      cy.visit(documentUrl);
    });

    it("Revise document", () => {
      cy.lhrClickReviseDocument();
    });

    it("Remove approvals", () => {
      cy.get(`[data-cy="remove-schema-item"]`).eq(1).arrowClick({ force: true });
      cy.get(`[data-cy="remove-schema-item"]`).eq(2).arrowClick({ force: true });
    });

    it("Save document", () => {
      cy.get(`[data-cy=DocumentRevisionForm-submit]`).arrowClick();
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });

    it("Verify Revision 1", () => {
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy=revision]").eq(1).click();
      cy.drCheckDocumentStatus({ status: "RELEASED" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev 1");
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy=revision]").eq(0).click();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context(`Verify ${record1Name}`, () => {
    it("Go to the record", () => {
      cy.visit(record1Url);
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "WIP" });
    });

    it("Upgrade to Latest ",  () => {
      cy.get("[data-cy=HeaderMenuButton]").arrowClick();
      cy.get("#UpgradeToLatest-upgrade").arrowClick();
      cy.get("#UpgradeToLatest-proceed").arrowClick();
    });

    it("Select approvals", () => {
      cy.get("[data-cy^=fb-approvals-]").eq(0).autocompleteSelect(`${ADMIN_USER.email}`);
    });

    it("Click Approve And Release", () => {
      cy.drApproveAndReleaseDialog();
      cy.wait(2000);
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "IN REVIEW" });
    });

    it("Approve inline approval", () => {
      cy.inlineApproval();
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "RELEASED" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev A");
    });
  });

  context(`Verify ${record2Name}`, () => {
    it("Go to the record", () => {
      cy.visit(record2Url);
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "WIP" });
    });

    it("Upgrade to Latest ",  () => {
      cy.get("[data-cy=HeaderMenuButton]").arrowClick();
      cy.get("#UpgradeToLatest-upgrade").arrowClick();
      cy.get("#UpgradeToLatest-proceed").arrowClick();
    });

    it("Select approvals", () => {
      cy.get("[data-cy^=fb-approvals-]").eq(0).autocompleteSelect(`${ADMIN_USER.email}`);
    });

    it("Click Approve And Release", () => {
      cy.drApproveAndReleaseDialog();
      cy.wait(2000);
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "IN REVIEW" });
    });

    it("Approve inline approval", () => {
      cy.inlineApproval();
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "RELEASED" });
      cy.get("[data-cy=HeaderInfo-Rev]").should("contain", "Rev A");
    });
  });
});
