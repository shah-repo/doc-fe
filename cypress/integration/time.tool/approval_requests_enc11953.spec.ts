/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable cypress.eslint.rules/cy.pause */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { momentInPST } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

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
      cy.arSelectDocumentTab();
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      cy.arSaveApiCall();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.drSelectChangeDetailsTab();
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

  context(`Verify ${USERS[1].name} received notification as 'needs your approval for'`, () => {
    it("Goto dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify for ${USERS[1].name} notification as 'needs your approval for'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${USERS[1].name}needs your approval for${aRID}Approval request form`,
      });
    });

    it(`Verify 'IN REVIEW' notification received for all 3 users`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${aRID}Approval request formIN REVIEWpending approvals from`,
      });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${USERS[1].name}` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${USERS[2].name}` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${USERS[3].name}` });
    });
  });

  context(`Verify ${USERS[1].name} AR list for status as 'IN_REVIEW'`, () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
    });

    it("Filter AR by title as 'Approval request form'", () => {
      cy.alFilterByTitle({ title: "Approval request form" });
    });

    it(`Filter list by OWNER as ${USERS[1].name}`, () => {
      cy.alFilterByOwner({ owner: USERS[1].name });
    });

    it("Filter list by STATUS as IN_REVIEW", () => {
      cy.alFilterByStatus({ status: "IN_REVIEW" });
    });

    it("Verify filter by STATUS as IN_REVIEW", () => {
      cy.alVerifyFilterByStatus({ status: "IN_REVIEW" });
    });
  });

  context(`Verify ${USERS[2].name} received notification as 'needs your approval for'`, () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it(`Verify for ${USERS[2].name} notification as '${USERS[1].name} needs your approval for'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${USERS[1].name}needs your approval for${aRID}Approval request form`,
      });
    });
  });

  context(`Verify ${USERS[2].name} AR list for status as 'IN_REVIEW'`, () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
    });

    it("Filter AR by title as 'Approval request form'", () => {
      cy.alFilterByTitle({ title: "Approval request form" });
    });

    it(`Filter list by OWNER as ${USERS[1].name}`, () => {
      cy.alFilterByOwner({ owner: USERS[1].name });
    });

    it("Filter list by STATUS as IN_REVIEW", () => {
      cy.alFilterByStatus({ status: "IN_REVIEW" });
    });

    it("Verify filter by STATUS as IN_REVIEW", () => {
      cy.alVerifyFilterByStatus({ status: "IN_REVIEW" });
    });
  });

  context(`Verify ${USERS[3].name} received notification as '${USERS[1].name} needs your approval for'`, () => {
    it(`Login as ${USERS[3].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[3].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it(`Verify for ${USERS[3].name} notification as '${USERS[1].name} needs your approval for'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${USERS[1].name}needs your approval for${aRID}Approval request form`,
      });
    });
  });

  context(`Verify ${USERS[3].name} AR list for status as 'IN_REVIEW'`, () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear filters", () => {
      cy.alClearFilters();
    });

    it("Filter AR by title as 'Approval request form'", () => {
      cy.alFilterByTitle({ title: "Approval request form" });
    });

    it(`Filter list by OWNER as ${USERS[1].name}`, () => {
      cy.alFilterByOwner({ owner: USERS[1].name });
    });

    it("Filter list by STATUS as IN_REVIEW", () => {
      cy.alFilterByStatus({ status: "IN_REVIEW" });
    });

    it("Verify filter by STATUS as IN_REVIEW", () => {
      cy.alVerifyFilterByStatus({ status: "IN_REVIEW" });
    });
  });

  context("Set time travel to Day 5", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Select 5 day to time travel", () => {
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

    it("Verify AR notification status as 'APPROVED'", () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${USERS[1].name}APPROVED${aRID}Approval request form`,
      });
    });

    it(`Verify for ${USERS[2].name} and ${USERS[3].name} notifications as 'pending approvals from'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${aRID}Approval request formIN REVIEWpending approvals from`,
      });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${USERS[2].name}` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${USERS[3].name}` });
    });
  });

  context("Set time travel to Day 10", () => {
    it("Select 5 days to time travel", () => {
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

    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it(`Verify for ${USERS[1].name} AR notification status as 'APPROVED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${USERS[1].name}APPROVED${aRID}Approval request form`,
      });
    });

    it(`Verify for ${USERS[2].name} AR notification status as 'APPROVED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${USERS[2].name}APPROVED${aRID}Approval request form`,
      });
    });

    it(`Verify for ${USERS[3].name} notifications as 'pending approvals from'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${aRID}Approval request formIN REVIEWpending approvals from${USERS[3].name}`,
      });
    });
  });

  context("Set time travel to Day 30", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Select 20 days to time travel", () => {
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

    it(`Verify for ${USERS[1].name} AR notification status as 'APPROVED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${USERS[1].name}APPROVED${aRID}Approval request form`,
      });
    });

    it(`Verify for ${USERS[2].name} AR notification status as 'APPROVED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${USERS[2].name}APPROVED${aRID}Approval request form`,
      });
    });

    it(`Verify for ${USERS[3].name} AR notification status as 'APPROVED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${USERS[3].name}APPROVED${aRID}Approval request form`,
      });
    });
  });

  context("close AR and set effective date to 40 days", () => {
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

  context("Set time travel to Day 31", () => {
    it("Select 1 day to time travel", () => {
      cy.arSetTimeTravelInDays({ days: 1 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Goto dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify for ${USERS[1].name} AR notification status as 'APPROVED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
            `${USERS[1].name}APPROVED${aRID}Approval request form`,
      });
    });

    it(`Verify for ${USERS[2].name} AR notification status as 'APPROVED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
            `${USERS[2].name}APPROVED${aRID}Approval request form`,
      });
    });

    it(`Verify for ${USERS[3].name} AR notification status as 'APPROVED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
            `${USERS[3].name}APPROVED${aRID}Approval request form`,
      });
    });

    it(`Verify for notification for 'APPROVED' AR will appear`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
            `${aRID}Approval request formisAPPROVED`,
      });
    });
  });

  context("Set time travel to Day 40", () => {
    it("Select 9 days to time travel", () => {
      cy.arSetTimeTravelInDays({ days: 9 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(20000);
    });

    it("Reload the page and Check status as COMPLETE", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
          CyRoutes.GetAvailableApprovers], () => {
          cy.reload();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "TIME_TRAVEL_COMPANY");
      cy.get(`td[data-grid-col-index="2"]`).eq(0).should("contain.text", "9 days");
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "CLOSE_CR_BY_EFFECTIVE_DATE");
      cy.get(`td[data-grid-col-index="4"]`).eq(0).should("contain.text", "COMPLETE");
    });

    it("Check that the AR was CLOSED", () => {
      cy.navigToApprovalRequestList();
      cy.arClearFilters();
      cy.alFilterByArId({ arId: `${aRID}` });
      cy.alFilterByTitle({ title: "Approval request form" });
      cy.alVerifyFilterByStatus({ status: "CLOSED" });
    });

    it("verify that Doc is released", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drFilterDocListByDocIdAndName({ docId: "CP-00004", title: "New document for testing AR" });
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("You should get a dashboard notification as CLOSED", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
            `${aRID}Approval request formisCLOSED`,
      });
    });
  });

  context("Set time travel to Day 42", () => {
    it("Select 2 days to time travel", () => {
      cy.arSetTimeTravelInDays({ days: 2 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(30000);
    });

    it("Reload the page and Check status as COMPLETE", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.GetDocumentTypes, CyRoutes.GroupsGetClearFilter,
          CyRoutes.GetAvailableApprovers], () => {
          cy.reload();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "TIME_TRAVEL_COMPANY");
      cy.get(`td[data-grid-col-index="2"]`).eq(0).should("contain.text", "2 days");
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "CLOSE_CR_BY_EFFECTIVE_DATE");
      cy.get(`td[data-grid-col-index="4"]`).eq(0).should("contain.text", "COMPLETE");
    });

    it("Goto dashboard", () => {
      cy.navigToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify for ${USERS[1].name} AR notification status as 'CLOSED'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
            `${aRID}Approval request formisCLOSED`,
      });
    });
  });
});
