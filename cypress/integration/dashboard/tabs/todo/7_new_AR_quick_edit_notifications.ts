// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../../support/config";
import { IMPORTER_USER, USERS } from "../../../../utils/constants/users";
import { ClinicalProtocolDocType } from "../../../../utils/constants/documentTypes/clinicalProtocol";
import { SystemRequirement } from "../../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let arUrl;

// @todo: 8.b.iii

context("Express AR notifications", () => {
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
              ClinicalProtocolDocType,
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

  context("Create new document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document' button", () => {
      cy.cmpClickCreateNewDocument();
      cy.wait(1000);
    });

    it("Enters title", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision title" });
    });

    it("Enters description", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects document type", () => {
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Checks if document type id is 'CP-00002'", () => {
      cy.drCheckIfDocumentIdMatches({ docId: "CP-00002" });
    });

    it("Select document revision as Numeric", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Clicks on 'Create Document' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Create new Express AR", () => {
    it("Click on new Express AR", () => {
      cy.get("[data-cy='dropdown-arrow']").arrowClick();
      cy.get("[data-cy='ar-new']").arrowClick();
    });

    it("Enter AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "AR Title" });
    });

    it("Enter description", () => {
      cy.arEnterApprovalRequestDescriptionNew({ description: "AR Description" });
    });

    it("Add User 2 as approver", () => {
      cy.drSelectApprovalsTab();
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email, noWait: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click send to review", () => {
      cy.arClickSendToReviewNew();
    });
  });

  context("Verify tabs content", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });

    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it(`User 1 should see pending AR in My Feed`, () => {
      cy.contains("AR-00001").invoke("attr", "href").then((url) => (arUrl = url));
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", USERS[2].name);
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
    it(`To Do tab should contain approval request from User 1`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001");
    });

    it("Reject the AR", () => {
      cy.arRejectARFromDashboardWithoutApi();
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
    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });

    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it(`User should see rejected AR notification from User 2`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[2].name)
        .and("contain.text", "REJECTED")
        .and("contain.text", "AR-00001");
    });

    it("Dismiss item", () => {
      cy.contains("AR-00001").eq(0).trigger("mouseover");
      cy.get("[data-cy='dismiss-icon']").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(1000);
    });

    it("Dismissed item shouldn't be in the list", () => {
      SystemRequirement("REQ-5330");
      cy.contains("REJECTED").should("not.exist");
    });

    it("Open Document", () => {
      cy.visit(arUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Status should be 'DRAFT'", () => {
      cy.arVerifyStatus({ status: "DRAFT" });
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewNew();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
    it(`To Do tab should contain approval request from User 1`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001");
    });

    it("Approve the AR", () => {
      cy.arApproveARFromDashboardWithoutApi();
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

  context("Notification that the AR is now approved should be on the To Do tab", () => {
    it("Tab contains AR in approved state", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "APPROVED")
        .and("contain.text", "AR-00001");
    });

    it("Close the AR", () => {
      cy.arCloseARFromDashboardWithoutApi();
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });

    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("Tab contains closed AR notification", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "CLOSED")
        .and("contain.text", "AR-00001");
    });

    it("Dismiss item", () => {
      cy.contains("CLOSED").eq(0).trigger("mouseover");
      cy.get("[data-cy='dismiss-icon']").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(1000);
    });

    it("Dismissed item shouldn't be in the list", () => {
      SystemRequirement("REQ-5330");
      cy.contains("CLOSED").should("not.exist");
    });
  });
});

export { };
