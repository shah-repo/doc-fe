// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../../support/config";
import { IMPORTER_USER, USERS } from "../../../../utils/constants/users";
import { SystemRequirement } from "../../../../utils/context/systemRequirement";
import { ClinicalProtocolDocType } from "../../../../utils/constants/documentTypes/clinicalProtocol";

let createdCompany;
let loginResponse;

const documentRevisionName = "New document for testing AR";

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
      cy.drEnterDocumentTitle({ name: documentRevisionName });
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

    it("Click Express AR", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({
        approverName: USERS[2].name,
      });
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
      cy.dashVerifyListItemExistsOnDashboard({
        listItem: `${documentRevisionName}IN REVIEWpending approvals from`,
      });
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
    it(`User should see AR notification from User 1`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "CP-00002")
        .and("contain.text", documentRevisionName);
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
        .and("contain.text", "CP-00002")
        .and("contain.text", documentRevisionName);
    });

    it("Dismiss item", () => {
      cy.contains("CP-00002").eq(0).trigger("mouseover");
      cy.get("[data-cy='dismiss-icon']").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(1000);
    });

    it("Dismissed item shouldn't be in the list", () => {
      cy.contains("REJECTED").should("not.exist");
    });

    it("Open Document", () => {
      cy.contains("CP-00002").arrowClick();
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

    it("Click approve submission", () => {
      cy.arApproveARWithoutApi();
      cy.wait(3000);
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
    it(`User should see AR notification from User 1`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "CP-00002")
        .and("contain.text", documentRevisionName);
    });

    it("Approve the AR", () => {
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
    it("Tab contains AR in approved state", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "APPROVED")
        .and("contain.text", "CP-00002")
        .and("contain.text", documentRevisionName);
    });

    it("Close the AR", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
      cy.get(`[data-cy="close-icon"]`).first().trigger("mouseover");
      cy.get(`[data-cy="close-icon-solid"]`).first().arrowClick();
      cy.get("#confirmEffectiveDate").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("There should be a banner notification that you have successfully closed an AR", () => {
      cy.checkToastMessageContains({ message: "You successfully closed an AR" });
      cy.wait(1000);
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
        .and("contain.text", "CP-00002")
        .and("contain.text", documentRevisionName);
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
