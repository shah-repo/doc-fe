// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../../support/config";
import { IMPORTER_USER, USERS } from "../../../../utils/constants/users";
import { SystemRequirement } from "../../../../utils/context/systemRequirement";
import { RecordDocumentType } from "../../../../utils/constants/documentTypes/testTypes";
import { STATUS_TYPES_LABEL } from "../../../../../src/state/ducks/dashboard.new/my.feeds/types";

let createdCompany;
let loginResponse;
let recordUrl;

const recordTitle = "Record Title";

context("Regular Record notifications", () => {
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
    it("[API] Creates company", (done: any) => {
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
            users: [USERS[2]],
            documentTypes: [
              RecordDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create form document for Record", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "Record Form" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "first record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify approvals field is automatically added", () => {
          cy.get("[data-cy='form.builder.approvals']").should("exist");
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        });
      });
    });
  });

  context("Create new Record", () => {
    it("Create new record button click", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title", () => {
      cy.drEnterDocumentTitle({ name: recordTitle });
    });

    it("Enters description", () => {
      cy.drEnterDocumentDescription({ description: "Record description" });
    });

    it("Add approvers", () => {
      cy.contains("Approvals").should("exist");
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").should("exist");

      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[2].name });
    });

    it("Save Record", () => {
      cy.url().then((url) => (recordUrl = url));
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });
  });

  context("Verify tabs content", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("User should get a notification that Record is pending for user approval", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "RD-00003")
        .and("contain.text", recordTitle);
    });

    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("User should get a notification that Record is pending for user approval", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "RD-00003")
        .and("contain.text", recordTitle)
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
    });
  });

  context("Login as User 2", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it(`User should see Record AR notification from User 1`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "RD-00003")
        .and("contain.text", recordTitle);
    });

    it("Reject Record AR", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("AR notify should be removed and 'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });

    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it(`User should see rejected AR notification from User 2`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[2].name)
        .and("contain.text", "REJECTED")
        .and("contain.text", "RD-00003")
        .and("contain.text", recordTitle);
    });

    it("Dismiss item", () => {
      cy.contains("RD-00003").eq(0).trigger("mouseover");
      cy.get("[data-cy='dismiss-icon']").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(1000);
    });

    it("Dismissed item shouldn't be in the list", () => {
      SystemRequirement("REQ-5330");
      cy.contains("REJECTED").should("not.exist");
    });
  });

  context("Resend the Record", () => {
    it("Open the Record", () => {
      cy.visit(recordUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Status should be 'DRAFT'", () => {
      cy.arVerifyStatus({ status: "DRAFT" });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("Approve Record AR", () => {
      cy.dashApproverFirstFromListWithoutApi();
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Login as User 2", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it(`User should see Record AR notification from User 1`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "RD-00003")
        .and("contain.text", recordTitle);
    });

    it("Approve Record AR", () => {
      cy.dashApproverFirstFromListWithoutApi();
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("User should see Released Record notification", () => {
      cy.contains("RELEASED").parent().parent().parent().parent()
        .should("contain.text", "RD-00003")
        .and("contain.text", recordTitle);
    });
  });
});

export { };
