/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { SupplierExport } from "../../utils/constants/documentTypes/supplier";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

context("Export Supplier", () => {
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
    it("[API]Create company", (done: any) => {
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
              SupplierExport,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create supplier form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Supplier Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Supplier Form" });
    });

    it("Enter description 'New Supplier Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Supplier Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Supplier' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify approval field is added as result of predefined schema", () => {
      cy.get("[id^=\"fb-approvals-section-fb-approvals\"]").should("exist");
      cy.get("input[data-cy^=\"fb-approvals-fb-approvals\"]").should("exist");
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create supplier document", () => {
    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter 'Supplier Address/Phone'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier address" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateSupplierWithApiCall();
    });
  });

  context("Supplier with Draft status", () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Draft", filename: "-1-Test-Supplier", status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("Supplier with In Review status", () => {
    it("Add Approver", () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(`${USERS[1].name}`);
    });

    it("Save the document", () => {
      cy.drClickCreateSupplierWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save and submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "In Review", filename: "-1-Test-Supplier",
        status: STATUS_TYPES_LABEL.IN_REVIEW,
      });
    });
  });

  context("Supplier with Released status", () => {
    it("Click Approve button", () => {
      cy.ebApprove();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Released", filename: "-1-Test-Supplier",
        status: STATUS_TYPES_LABEL.RELEASED,
      });
    });
  });

  context("Supplier with Superseded status", () => {
    it("Revise document with 'Superseded' option", () => {
      cy.drClickReviseDocument();
      cy.drEnterDocumentDescription({ description: "1" });
      cy.drClickCreateDocumentWithoutApiCall();
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(`${USERS[1].name}`);
      cy.pmSubmitForApproval();
      cy.ebApprove();
    });

    it("Select Revision", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Select 'Superseded' record", () => {
      cy.contains("Superseded").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Superseded", filename: "-1-Test-Supplier",
        status: STATUS_TYPES_LABEL.SUPERSEDED,
      });
    });
  });

  context("Supplier with Voided status", () => {
    it("Select Revision", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Select 'Released' record", () => {
      cy.contains("Released").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Revise document with 'Void' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Void" });
      cy.drClickCreateDocumentWithoutApiCall();
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(`${USERS[1].name}`);
      cy.drApproveAndReleaseDialog();
      cy.get("[name=\"voidDescription\"]").arrowType("Voiding");
      cy.get("[data-cy=\"fb-control-btn\"]").last().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Approve", () => {
      cy.contains("PENDING APPROVAL").arrowClick();
      cy.ebApprove();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Voided", filename: "-OBS-Test-Supplier", status: STATUS_TYPES_LABEL.VOIDED });
    });
  });
});

export { };

