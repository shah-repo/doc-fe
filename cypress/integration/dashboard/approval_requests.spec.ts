// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { momentInPST } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let clinicalProtocolDocumentType;
let group;
let asyncTasksGroup;
const documentRevisionName = "New document for testing AR";

context("Approval request form", { tags: ["@timetool"] },  () => {
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
            companyAdminEmail: USERS[11].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API]Login first tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[11].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Creates document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
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
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Creates another document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description 2 </p>",
            document: {
              docId: "CP-00005",
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
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Creates third document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description 3 </p>",
            document: {
              docId: "CP-00006",
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
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Creates fourth document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description 4 </p>",
            document: {
              docId: "CP-00007",
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
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.arEnterApprovalRequestTitle({ title: "Approval request form" });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add first document revision", () => {
      cy.arSelectItemsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arAddItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arSelectItem({ name: "CP-00004" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arEnterItemDescription({ description: "added document description" });
      cy.arEnterItemJustification({ justification: "justification for added document" });
      cy.arClickAddItemDone();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Add second document revision", () => {
      cy.arAddItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arSelectItem({ name: "CP-00005" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arEnterItemDescription({ description: "added document description" });
      cy.arEnterItemJustification({ justification: "justification for added document" });
      cy.arClickAddItemDone();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click on Save button", () => {
      cy.arSaveApiCallWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arSelectApprovalTab();
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[11].email, noWait: true });
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email, noWait: true });
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[3].email, noWait: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Save AR", () => {
      cy.arSaveApiCallWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });
  });

  context("Check the dashboard", () => {
    it("AR should not appear on My Feed since AR is still in Draft", () => {
      cy.navigToDashboardWithoutApi();
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.contains("No pending actions").should("exist");
    });

    it("Switch to Recent tab", () => {
      cy.dashboardRecentTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("AR should appear in Recent", () => {
      cy.get("#scrollable-auto-tab-recent").arrowClick();
      cy.get("#scrollable-auto-tabpanel-recent").find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
    });
  });

  context("Create another AR and check dashboard", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestListWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Enter AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "Second AR" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter description", () => {
      cy.arEnterApprovalRequestDescription({ description: "test" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add A Document'", () => {
      cy.arSelectItemsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arAddItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arSelectItem({ name: "CP-00006" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arEnterItemDescription({ description: "added document description" });
      cy.arEnterItemJustification({ justification: "justification for added document" });
      cy.arClickAddItemDone();
    });

    it("Save AR", () => {
      cy.arSaveApiCallWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Check that in Recent tab, the latest open should appear on top", () => {
      SystemRequirement("REQ-4990");
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.dashboardRecentTab();
      cy.get("#scrollable-auto-tab-recent").arrowClick();
      cy.get("#scrollable-auto-tabpanel-recent").find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00002")
        .and("contain.text", "Second AR");

      cy.get("#scrollable-auto-tabpanel-recent").find(".MuiGrid-container").eq(1)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
    });
  });

  context("Send AR to review and check dashboard", () => {
    it("Send AR to review", () => {
      cy.get("#scrollable-auto-tab-recent").arrowClick();
      cy.get("#scrollable-auto-tabpanel-recent").find(".MuiGrid-container").eq(1).find("a").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arClickSendToReviewWithoutApi();
      cy.wait(3000);
      cy.arVerifyStatus({ status: "IN REVIEW" });
    });

    it("Goto dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Switch to MyFeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("AR in review present on dashboard", () => {
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[11].name}`)
        .and("contain.text", `${USERS[2].name}`)
        .and("contain.text", `${USERS[3].name}`);
    });

    it("Hovering on the status should highlight it", () => {
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .find(".MuiChip-root").trigger("mouseover");
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .find(".MuiChip-root").should("have.css", "background-color", "rgb(48, 128, 234)");
    });

    it("click on status or approvers should open the email modal box", () => {
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("a").arrowClick();
      cy.get("#simple-modal-title").should("exist").and("have.text", "Approval Status");
      cy.get("button[aria-label=close]").last().arrowClick();
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .find(".MuiGrid-root").eq(2).arrowClick();
      cy.get("#simple-modal-title").should("exist").and("have.text", "Approval Status");
      cy.get("button[aria-label=close]").last().arrowClick();
    });

    it("Clicking on the arrow should show the AR details", () => {
      cy.contains("IN REVIEW").parent().parent().parent().parent().parent().parent().parent()
        .find("svg").eq(0).arrowClick();
      cy.contains("IN REVIEW").parent().parent().parent().parent().parent().parent().parent().next()
        .find("ul div").eq(0)
        .should("contain.text", "New document for testing AR");
    });

    it("Close line item by click arrow", () => {
      cy.contains("IN REVIEW").parent().parent().parent().parent().parent().parent().parent()
        .find("svg").eq(0).arrowClick();
    });

    it("Switch to To Do tab", () => {
      cy.dashboardToDoTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Hovering AR line item should display buttons", () => {
      cy.contains("needs your approval for").trigger("mouseover");
      cy.contains("needs your approval for").parent().parent().parent().parent().parent()
        .find(".MuiBox-root").eq(0)
        .find("svg").should("have.length", 3);
      cy.contains("needs your approval for").parent().parent().parent().parent().parent()
        .find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-approve\"]").should("exist");
      cy.contains("needs your approval for").parent().parent().parent().parent().parent()
        .find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-reject\"]").should("exist");
    });
  });

  context(`For ${USERS[2].name}, AR request should display on dashboard`, () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });


    it("For User 2 dashboard, it should appear in their My Feed as 'needs your approval'", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[11].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
    });

    it("Hovering AR line item should display buttons", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("svg").should("have.length", 3);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-approve\"]").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-reject\"]").should("exist");
    });

    it("Clicking on the arrow should show the AR details", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find("svg").eq(0).arrowClick();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).next()
        .find("ul div").eq(0)
        .should("contain.text", "New document for testing AR");
    });

    it("Close line item by click arrow", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find("svg").eq(0).arrowClick();
    });

    it("Approve the AR", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick().wait(1000);
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });

    it("After approve, AR should appear in Recent items", () => {
      cy.get("#scrollable-auto-tab-recent").arrowClick();
      cy.get("#scrollable-auto-tabpanel-recent").find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
    });
  });

  context(`Check ${USERS[11].name} dashboard notifications`, () => {
    it(`Login as ${USERS[11].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Switch to MyFeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("AR in review present on dashboard with 2 approvers", () => {
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[11].name}`)
        .and("contain.text", `${USERS[3].name}`);
    });
  });

  context(`For ${USERS[3].name}, AR request should display on dashboard`, () => {
    it(`Login as ${USERS[3].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[3].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("For User 3 dashboard, it should appear in their My Feed as 'needs your approval'", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[11].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
    });

    it("Hovering AR line item should display buttons", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("svg").should("have.length", 3);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-approve\"]").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-reject\"]").should("exist");
    });

    it("Clicking on the arrow should show the AR details", () => {
      SystemRequirement("REQ-4970");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find("svg").eq(0).arrowClick();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).next()
        .find("ul div").eq(0)
        .should("contain.text", "New document for testing AR");
    });

    it("Close line item by click arrow", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find("svg").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Reject the AR", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });
  });

  context(`Check ${USERS[11].name} dashboard notifications`, () => {
    it(`Login as ${USERS[11].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Switch to MyFeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("There should be a notification that User 3 has rejected AR", () => {
      SystemRequirement("REQ-4980");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "REJECTED")
        .and("contain.text", USERS[3].name);
    });

    it("Open AR", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .find(".MuiGrid-root").eq(2).find("a").arrowClick();
    });

    it("Status should be 'DRAFT'", () => {
      cy.arVerifyStatus({ status: "DRAFT" });
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });
  });

  context("Approve AR by all 3 approvers", () => {
    it("Goto dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Approve the AR by ${USERS[11].name}`, () => {
      cy.contains("needs your approval for").trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick().wait(1000);
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });

    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Approve the AR by ${USERS[2].name}`, () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick().wait(1000);
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });

    it(`Login as ${USERS[3].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[3].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it(`Approve the AR by ${USERS[3].name}`, () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick().wait(1000);
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });
  });

  context(`Check ${USERS[11].name} notifications on dashboard`, () => {
    it(`Login as ${USERS[11].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("there should be a notification that AR has been approved", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "APPROVED");
    });

    it("Hovering AR line item should display buttons", () => {
      cy.get("[data-cy=dashboardFeedList]>div").contains("AR-00001Approval request formisAPPROVED")
        .trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList]>div").contains("AR-00001Approval request formisAPPROVED")
        .parent()
        .parent()
        .parent()
        .find(".MuiBox-root").eq(0)
        .find("svg").should("have.length", 2);
    });

    it("Close popup should open on click close button", () => {
      cy.get("[data-cy=dashboardFeedList]>div").contains("AR-00001Approval request formisAPPROVED")
        .parent()
        .parent()
        .parent()
        .find(".MuiBox-root").eq(0)
        .find("svg").eq(0).arrowClick();

      cy.get("#simple-modal-title").should("exist").and("have.text", "Close Approval Request");
    });

    it("Close AR and verify notification on dashboard should be closed", () => {
      cy.get("#confirmEffectiveDate").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Switch to MyFeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("verify notification on dashboard should be closed", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "CLOSED");
    });
  });

  context("Create a document and express release it with additional approvers and check AR process", () => {
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
      cy.arEnterApprovalRequestTitle({ title: "Approval request form1" });
    });

    it("Enter description", () => {
      cy.arEnterApprovalRequestDescription({ description: "description" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add document revision", () => {
      cy.arSelectItemsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arAddItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arSelectItem({ name: "CP-00007" });
      cy.arEnterItemDescription({ description: "form1 description" });
      cy.arEnterItemJustification({ justification: "form1 justification" });
      cy.arClickAddItemDone();
    });

    it("Click Create Approval Request", () => {
      cy.arSaveApiCallWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arSelectApprovalTab();
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email, noWait: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Save AR", () => {
      cy.arSaveApiCallWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Verify AR status is 'IN_REVIEW'", () => {
      cy.arVerifyStatus({ status: "IN REVIEW" });
    });

    it("Goto dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Switch to MyFeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("AR in review present on dashboard", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00003")
        .and("contain.text", "Approval request form1")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .find("span").eq(0)
        .should("contain.text", `${USERS[2].name}`);
    });

    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("For User 2 dashboard, it should appear in their My Feed as 'needs your approval'", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[11].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00003")
        .and("contain.text", "Approval request form1");
    });

    it("Hovering AR line item should display buttons", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("svg").should("have.length", 3);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-approve\"]").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-reject\"]").should("exist");
    });

    it("Clicking on the arrow should show the AR details", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find("svg").eq(0).arrowClick();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).next()
        .find("ul div").eq(0)
        .should("contain.text", "New document for testing AR");
    });

    it("Close line item by click arrow", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find("svg").eq(0).arrowClick();
    });

    it("Approve the AR", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick().wait(1000);
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });

    it("After approve, AR should appear in Recent items", () => {
      cy.get("#scrollable-auto-tab-recent").arrowClick();
      cy.get("#scrollable-auto-tabpanel-recent").find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00003")
        .and("contain.text", "Approval request form1");
    });

    it(`Login as ${USERS[11].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("there should be a notification that AR has been approved", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00003")
        .and("contain.text", "Approval request form1")
        .and("contain.text", "APPROVED");
    });

    it("Close popup should open on click close button", () => {
      cy.get("[data-cy=dashboardFeedList]>div").contains("AR-00003Approval request form1isAPPROVED")
        .trigger("mouseover")
        .parent()
        .parent()
        .parent()
        .find(".MuiBox-root").eq(0)
        .find("svg").eq(0).arrowClick();

      cy.get("#simple-modal-title").should("exist").and("have.text", "Close Approval Request");
    });

    it("Close AR and verify notification on dashboard should be closed", () => {
      cy.get("#confirmEffectiveDate").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Switch to MyFeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("verify notification on dashboard should be closed", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00003")
        .and("contain.text", "Approval request form1")
        .and("contain.text", "CLOSED");
    });
  });

  context("Navigate to DRAFT approval request and approve request", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestListWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter AR by title as 'Second AR'", () => {
      cy.alFilterByTitle({ title: "Second AR" });
    });

    it(`Filter list by OWNER as ${USERS[11].name}`, () => {
      cy.alFilterByOwner({ owner: USERS[11].name });
    });

    it("Filter list by STATUS as DRAFT", () => {
      cy.alFilterByStatus({ status: "DRAFT" });
    });

    it("Verify filter by STATUS as DRAFT", () => {
      cy.alVerifyFilterByStatus({ status: "DRAFT" });
    });

    it("Click on DRAFT", () => {
      cy.get(`td[data-grid-col-index="3"]`).should("contain.text", "DRAFT").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approver", () => {
      cy.arSelectApprovalTab();
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Send to review", () => {
      cy.arClickSendToReviewWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click approve submission", () => {
      cy.arApproveARWithoutApi();
      cy.wait(3000);
    });

    it("Click Close button", () => {
      cy.get("[data-cy=\"transition-closed\"]").first().arrowClick();
      cy.wait(3000);
    });

    it("Select option No", () => {
      cy.get("button[id=\"AlertDialog-cancelButton\"]").contains("No").arrowClick();
      cy.wait(3000);
    });

    it("Advance Effective Date to 30 days from now", () => {
      const effectiveDate = momentInPST().add(30, "days");
      const month = effectiveDate.format("MMM");
      const day = effectiveDate.format("D");

      cy.get("[aria-label=\"change date\"]").arrowClick();

      cy.get("div.MuiPickersCalendarHeader-transitionContainer").then(($el) => {
        const monthYearText = $el.text();
        if (!monthYearText.includes(month)) {
          cy.get("div.MuiPickersCalendarHeader-switchHeader>button").eq(1).arrowClick();
        }

        cy.wait(500);

        cy.get("button.MuiPickersDay-day")
          .not(".MuiPickersDay-hidden")
          .each(($el) => {
            const dayNumber = $el.text();
            if (day === dayNumber) {
              cy.wrap($el).arrowClick();
            }
          });
      });
      cy.get("#confirmEffectiveDate").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });
  });

  context("Verify the AR in APPROVED State", () => {
    it("Navigate to ar list", () => {
      cy.navigToApprovalRequestListWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter AR by title as 'Second AR'", () => {
      cy.alFilterByTitle({ title: "Second AR" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Filter list by OWNER as ${USERS[11].name}`, () => {
      cy.alFilterByOwner({ owner: USERS[11].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter list by STATUS as APPROVED", () => {
      cy.alFilterByStatus({ status: "APPROVED" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify filter by STATUS as APPROVED", () => {
      cy.alVerifyFilterByStatus({ status: "APPROVED" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Set time travel to Day 29", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select task TIME_TRAVEL_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 29 days to time travel", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 29 });
    });

    it("On Next Task, SELECT_ALL", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SELECT_ALL });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify the AR is still in APPROVED State", () => {
    it("Navigate to ar list", () => {
      cy.navigToApprovalRequestListWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter AR by title as 'Second AR'", () => {
      cy.alFilterByTitle({ title: "Second AR" });
    });

    it(`Filter list by OWNER as ${USERS[11].name}`, () => {
      cy.alFilterByOwner({ owner: USERS[11].name });
    });

    it("Filter list by STATUS as APPROVED", () => {
      cy.wait(2000);
      cy.alFilterByStatus({ status: "APPROVED" });
    });

    it("Verify filter by STATUS as APPROVED", () => {
      cy.wait(2000);
      cy.alVerifyFilterByStatus({ status: "APPROVED" });
    });
  });

  context("Set time travel to Day 30", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select task TIME_TRAVEL_COMPANY", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it("Select 1 day to time travel", () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("On Next Task, SELECT_ALL", () => {
      cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.SELECT_ALL });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify the time travel will appear in History list as 'Requested'", () => {
      cy.get("tr.k-master-row").should("have.length", 2);
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).eq(0)
        .should("contain.text", "TIME_TRAVEL_COMPANY");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="3"]`).eq(0)
        .should("contain.text", "CLOSE_CR_BY_EFFECTIVE_DATE");
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0).contains(/REQUESTED|COMPLETE/g);
    });

    it("Reload the page and Check status as COMPLETE", { retries: 5 }, () => {
      cy.wait(8000);
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`tr[data-grid-row-index="0"]`).should("have.length", 1);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).eq(0)
        .should("contain.text", "COMPLETE");
    });
  });

  context("Verify the AR is in auto CLOSED State", () => {
    it("Navigate to ar list", () => {
      cy.navigToApprovalRequestListWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter AR by title as 'Second AR'", () => {
      cy.alFilterByTitle({ title: "Second AR" });
    });

    it(`Filter list by OWNER as ${USERS[11].name}`, () => {
      cy.alFilterByOwner({ owner: USERS[11].name });
    });

    it("Filter list by STATUS as CLOSED", () => {
      cy.alFilterByStatus({ status: "CLOSED" });
    });

    it("Verify filter by STATUS as CLOSED", () => {
      cy.alVerifyFilterByStatus({ status: "CLOSED" });
    });
  });
});

export { };
