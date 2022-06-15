/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable cypress.eslint.rules/cy.pause */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { momentInPST } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let clinicalProtocolDocumentType;
let group;
let adminEmployee;
let asyncTasksGroup;
let formDocumentType;
let maintenanceRecordDocumentType;
let approvalRequestDocumentType;

const approvalRequestName = "Approval request form";
const aRID = "AR-00001";
const documentRevisionName = "New document for testing AR";

context("Approval request form", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API]Login first tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create approval request", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Enter title AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "Approval request form" });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
    });

    it("Add document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[1].email, noWait: true });
      cy.arAddApproverOnApproverList({ approver: USERS[2].email, noWait: true });
      cy.arAddApproverOnApproverList({ approver: USERS[3].email, noWait: true });
    });

    it("Save AR", () => {
      cy.arSaveApiCall();
    });

    it("Send to review", () => {
      cy.arClickSendToReview();
    });
  });
  context("Verify In My Feed that AR is pending the approval of 3 users", () => {
    it("Goto dashboard", () => {
      cy.navigToDashboard();
    });

    it("AR in review present on dashboard for all 3 users", () => {
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[1].name}`)
        .and("contain.text", `${USERS[2].name}`)
        .and("contain.text", `${USERS[3].name}`);
    });
  });

  context(`Check ${USERS[1].name} AR request should display on dashboard`, () => {
    it("AR in review present on dashboard with 2 approvers", () => {
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[2].name}`)
        .and("contain.text", `${USERS[3].name}`);
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
    });

    it("For User 2 dashboard, it should appear in their My Feed as 'needs your approval'", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
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
    });

    it("For User 3 dashboard, it should appear in their My Feed as 'needs your approval'", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
    });
  });

  context("Set the QA tool to Day 5", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Select 5 day to back in future", () => {
      cy.arSetTimeTravelInDays({ days: 5 });
    });

    it("Goto dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Have ${USERS[1].name} approve the AR`, () => {
      cy.arApproveARFromDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Line item for the AR should be back on top", () => {
      SystemRequirement("REQ-4990");
      cy.get("#scrollable-auto-tab-1").arrowClick();
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiGrid-container").should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
    });

    it("It should update to show that its only pending the approval of User 2 and 3'", () => {
      cy.get("#scrollable-auto-tab-0").arrowClick();
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[2].name}`)
        .and("contain.text", `${USERS[3].name}`);
    });
  });

  context("Set the QA tool to Day 10", () => {
    it("Select 5 day to back in future", () => {
      cy.arSetTimeTravelInDays({ days: 5 });
    });

    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it(`Have ${USERS[2].name} approve the AR`, () => {
      cy.arApproveARFromDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Line item for the AR should be back on top", () => {
      SystemRequirement("REQ-4990");
      cy.get("#scrollable-auto-tab-1").arrowClick();
      cy.get("#scrollable-auto-tabpanel-1").find(".MuiGrid-container").should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form");
    });

    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("It should update to show that its only pending the approval of User 3'", () => {
      cy.get("#scrollable-auto-tab-0").arrowClick();
      cy.contains("IN REVIEW").parent().parent().parent().parent()
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[3].name}`);
    });
  });

  context("Have User 3 approve the AR", () => {
    it("Select 20 day to back in future", () => {
      cy.arSetTimeTravelInDays({ days: 20 });
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
      cy.arApproveARFromDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
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
  });

  context("close AR and set effective date to 40 days from now", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
    });

    it("Filter list by status", () => {
      cy.alFilterByStatus({ status: "APPROVED" });
    });

    it("Verify filter by TITLE", () => {
      cy.alVerifyFilterByTitle({ title: approvalRequestName });
    });

    it(`Verify AR ID as ${aRID}`, () => {
      cy.dlVerifyFilterByDocId({ docId: aRID });
    });

    it(`Open AR filtered request`, () => {
      cy.get("#root").contains(approvalRequestName).arrowClick();
    });

    it("Click Close button", () => {
      cy.get("[data-cy=\"transition-closed\"]").first().arrowClick();
    });

    it("Select option No", () => {
      cy.get("button[id=\"AlertDialog-cancelButton\"]").contains("No").arrowClick();
    });

    it("Advance Effective Date to 10 days from now", () => {
      const effectiveDate = momentInPST().add(10, "days");
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

      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostCloseAR, CyRoutes.ARPreview], () => {
          cy.get("#confirmEffectiveDate").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Set the QA tool to Day 31/32", () => {
    it("Select 2 day to back in future", () => {
      cy.arSetTimeTravelInDays({ days: 1 });
      cy.navigToDashboard();
      cy.get("[data-cy=dashboardFeedList]>div").contains("AR-00001Approval request formisAPPROVED")
        .trigger("mouseover");
      // validation need to be add//
    });
  });

  context("Set the QA tool to Day 40", () => {
    it("Select 8 day to back in future", () => {
      cy.arSetTimeTravelInDays({ days: 9 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check that the AR was CLOSED", () => {
      cy.navigToApprovalRequestList();
      cy.arClearFilters();
      cy.alFilterByArId({ arId: "AR-00001" });
      cy.alFilterByTitle({ title: approvalRequestName });
      cy.alVerifyFilterByStatus({ status: "CLOSED" });
    });

    it("verify that Doc is released", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drFilterDocListByDocIdAndName({ docId: "CP-00004", title: "New document for testing AR" });
      cy.arVerifyStatus({ status: "Released" });
    });

    it("You should get a dashboard notification that AR was closed", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Approval request form")
        .and("contain.text", "CLOSED");
    });
  });

  context("Set the QA tool to Day 41/42", () => {
    it("Select 2 day to back in future", () => {
      cy.arSetTimeTravelInDays({ days: 2 });
      cy.navigToDashboard();
      cy.get("[data-cy=dashboardFeedList]>div").contains("AR-00001Approval request formisCLOSED")
        .trigger("mouseover");
    });
  });
});

