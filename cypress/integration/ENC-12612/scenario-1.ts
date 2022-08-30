// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
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
const outputDocumentType = "Document Approval Matrix";

const documentName = "ENC-12612 Scenario 1";
const recordName = "Record 1";
const testName = "Update the Internal Type for the following: LHRT";

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
    it("Add 'Approval Matrix' field", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PO Approval Matrix" });
      cy.fbEnterNameValue({ name: "label", value: "Approval Matrix" });
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "RELEASED" });
    });
  });

  context(`Create ${recordName}`, () => {
    it("Create new", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: recordName });
    });

    it("Verify revision", () => {
      cy.drCheckDocumentStatus({ status: "DRAFT" });
    });

    it("Create Approval Role", () => {
      cy.get("[data-cy=\"tabId.approvalroles\"]").click();
      cy.get("[data-cy=\"form.builder.add.another.role\"] > .MuiBox-root").click();
      cy.get("[data-cy=\"name\"]").arrowType("Role 1").wait(500);
      cy.drEnterApprovingGroups("Groups Management");
      cy.get("[data-cy=\"common.add\"]").eq(0).click();
    });
  });

  context(`Virify ${recordName}`, () => {
    it("Virify matrix details", () => {
      cy.get("[data-cy=\"tabId.matrixdetails\"]").click();
      cy.get(":nth-child(1) > .MuiIconButton-label > .MuiBox-root > .MuiSvgIcon-root").click();
      cy.get(".MuiTableBody-root")
        .should("contain", "LHRT-")
        .and("contain", "LHRT")
        .and("contain", "LHR Template");
    });
  });
});
