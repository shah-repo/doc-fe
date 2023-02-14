// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment";
import { CONFIG } from "../../../../support/config";
import { IMPORTER_USER, USERS } from "../../../../utils/constants/users";
import { SystemRequirement } from "../../../../utils/context/systemRequirement";
import { RevisionChangeType } from "../../../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../../../support/commands/company/commands";
import { ClinicalProtocolDocType } from "../../../../utils/constants/documentTypes/clinicalProtocol";

let createdCompany;
let loginResponse;
let firstEmployee;
let clinicalProtocolDocumentType;
let group;
let ARUrl;

const documentRevisionName = "New document for testing AR";
const ARTitle = "Approval request form";
const currentDate = moment().tz("America/Los_Angeles").format("MMM D, YYYY");

// @todo: point 2

context("Regular AR notifications", () => {
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
          firstEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API] Login User 1", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API] Creates document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: firstEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description</p>",
            document: {
              docId: "CP-00004",
              documentType: {
                id: clinicalProtocolDocumentType[0].id,
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
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: firstEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
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

  context("Verify Dashboard tabs", () => {
    it("Dashboard should have 3 tabs - 'To Do', 'My Feed' and 'Recent'", () => {
      cy.get("[role=tablist] button").eq(0).should("contain.text", "To Do");
      cy.get("[role=tablist] button").eq(1).should("contain.text", "My Feed");
      cy.get("[role=tablist] button").eq(2).should("contain.text", "Recent");
    });
    it("'To Do' tab should be selected by default", () => {
      cy.get("#scrollable-auto-tab-todo[aria-selected='true']").should("exist");
    });
    it("'Trainings' tab shouldn't exist", () => {
      SystemRequirement("REQ-5070");
      cy.get("#scrollable-auto-tab-training").should("not.exist");
    });
    it("Verify tabs as fixed", () => {
      cy.verifyFixedTab();
    });
  });

  context("Create approval request", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestListWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter title AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: ARTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add document", () => {
      cy.drSelectItemsTab();
      cy.arClickAddItem();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickSaveItem();
      cy.arItemsLoaderShouldNotExist();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.drSelectApprovalsTab();
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email, noWait: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click Send To Review", () => {
      cy.url().then((url) => (ARUrl = url));
      cy.arClickSendToReviewNew();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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

  context("Verify Dashboard tabs", () => {
    it("Dashboard should have 3 tabs - 'To Do', 'My Feed' and 'Recent'", () => {
      cy.get("[role=tablist] button").eq(0).should("contain.text", "To Do");
      cy.get("[role=tablist] button").eq(1).should("contain.text", "My Feed");
      cy.get("[role=tablist] button").eq(2).should("contain.text", "Recent");
    });
    it("'To Do' tab should be selected by default", () => {
      cy.get("#scrollable-auto-tab-todo[aria-selected='true']").should("exist");
    });
    it("'Trainings' tab shouldn't exist", () => {
      SystemRequirement("REQ-5070");
      cy.get("#scrollable-auto-tab-training").should("not.exist");
    });
  });

  context("Verify AR line item in To Do tab", () => {
    it(`AR item should have Avatar, names, ID and submitted date`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiAvatar-root").eq(0)
        .should("have.text", "GR");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001")
        .and("contain.text", ARTitle);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);
    });

    it("Hovering AR line item should display buttons", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='transition-approve']").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='transition-reject']").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='dismiss-icon']").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='pin-icon']").should("not.exist");
    });

    it("Reject the AR", () => {
      cy.arRejectARFromDashboardWithoutApi();
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Verify that My Feed tab is empty", () => {
    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("'My Feed' tab should be empty", () => {
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

  context("Verify that To Do tab is empty", () => {
    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Verify rejected AR notify in My Feed tab", () => {
    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it(`AR item should have Avatar, names, ID, submitted date and rejected status`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiAvatar-root").eq(0)
        .should("have.text", "HB");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[2].name)
        .and("contain.text", "REJECTED")
        .and("contain.text", "AR-00001")
        .and("contain.text", ARTitle);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);
    });

    it("Dismiss item", () => {
      cy.contains("AR-00001").eq(0).trigger("mouseover");
      cy.get("[data-cy='dismiss-icon']").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(1000);
    });

    it("Dismissed item shouldn't be in the list", () => {
      cy.contains("AR-00001").should("not.exist");
    });

    it("Open AR", () => {
      cy.visit(ARUrl);
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

  context("Verify that My Feed tab is empty", () => {
    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("'My Feed' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Verify AR line item in To Do tab", () => {
    it("Open To Do tab", () => {
      cy.dashOpenToDoTab();
    });

    it(`AR item should have Avatar, names, ID and submitted date`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiAvatar-root").eq(0)
        .should("have.text", "GR");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001")
        .and("contain.text", ARTitle);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);
    });

    it("Hovering AR line item should display buttons", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='transition-approve']").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='transition-reject']").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='dismiss-icon']").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='pin-icon']").should("not.exist");
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

  context("Notification that User 2 approved the AR should be on the My Feed tab", () => {
    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("Tab contains AR in approved state", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiAvatar-root").eq(0)
        .should("have.text", "HB");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[2].name)
        .and("contain.text", "APPROVED")
        .and("contain.text", "AR-00001")
        .and("contain.text", ARTitle);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);
    });
  });

  context("Notification that the AR is now approved and can be closed should be on the To Do tab", () => {
    it("Open To Do tab", () => {
      cy.dashOpenToDoTab();
    });

    it("Tab contains AR in approved state", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "APPROVED")
        .and("contain.text", "AR-00001")
        .and("contain.text", ARTitle);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);
    });

    it("Hovering on approved AR item should show Close button", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='close-icon']").should("exist");
    });

    it("Close the AR", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
      cy.get(`[data-cy="close-icon"]`).first().trigger("mouseover");
      cy.get(`[data-cy="close-icon-solid"]`).first().arrowClick();
      cy.get("#confirmEffectiveDate").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });
});

export { };
