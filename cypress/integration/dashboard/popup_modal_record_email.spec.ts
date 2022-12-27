// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import { TIME_ZONE } from "../../../src/common/utils/date";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const ADMIN_USER = USERS[33];
const FIRST_USER = USERS[11];
const SECOND_USER = USERS[12];
const THIRD_USER = USERS[13];
const recordTitle = "Record document from newly created form";
const dateOffset = (5 * 1000);

let createdCompany;
let loginResponse;
let secondEmployee;
let thirdEmployee;
let fourthEmployee;
let emailsFromInbox: IMAPEmail[];
let adminEmployee;
let adminSessionId;
let developersGroup;
let dateAfterEmailShouldArrive;
let getEmailSetting;

context("Records email popup modal", () => {
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
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              RecordDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === FIRST_USER.email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === SECOND_USER.email);
          fourthEmployee = createdCompany.employees.find((employee) => employee.user.email === THIRD_USER.email);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
      });
    });

    context("[API]Add employee to developers group", () => {
      it("[API]Get group", (done: any) => {
        cy.grpGetGroupByName({
          groupName: "Developers",
          sessionId: adminSessionId,
          employeeId: adminEmployee.id,
        }).then((response) => {
          developersGroup = response;
          done();
        });
      });

      it("[API]Patch group", () => {
        cy.grpPatchGroup({
          groupId: developersGroup.body[0].id,
          sessionId: adminSessionId,
          employeeId: adminEmployee.id,
          payload: {
            employees: [{ id: secondEmployee.id }],
          },
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: FIRST_USER, employeeId: secondEmployee.id });
    });
  });

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
    it("Enters title 'Record'", () => {
      cy.drEnterDocumentTitle({ name: "Record" });
    });

    it("Enters description 'Record description'", () => {
      cy.drEnterDocumentDescription({ description: "Record description" });
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
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create record with newly created form", () => {
    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Click Create a Record button", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Record Document' form", () => {
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Record Document" });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title Record title: " + recordTitle, () => {
      cy.drEnterDocumentTitle({ name: recordTitle });
    });

    it("Enter description 'Record from New form template for approval'", () => {
      cy.drEnterDocumentDescription({ description: "Record from New form template for approval" });
    });

    it("Select approver", () => {
      cy.pmAddApproverOnApproverList({ approver: FIRST_USER.name });

      cy.pmAddApproverOnApproverList({ approver: SECOND_USER.name });

      cy.pmAddApproverOnApproverList({ approver: THIRD_USER.name });

      cy.unClick();
    });

    it("Save Record'", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Finalize and release button click'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
    });
  });

  context("Navigate to dashboard and send email to all approvers", () => {
    it("Navigate to dashboard", () => {
      cy.navigToDashboard();
    });

    it("Check if Record is 'In Review'", () => {
      cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").arrowClick();
    });

    context("Click on Record status and check the pop-up content", () => {
      it("Check if headline says 'Approval Status'", () => {
        cy.get("[id='simple-modal-title']").should("contain.text", "Approval Status");
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (3)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", FIRST_USER.name)
          .and("contain.text", SECOND_USER.name)
          .and("contain.text", THIRD_USER.name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        SystemRequirement("REQ-5080");
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        dateAfterEmailShouldArrive = moment().tz(TIME_ZONE).subtract(dateOffset, "milliseconds");
      });
    });
  });

  context("Login with second approver, check email content and approve", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: SECOND_USER, employeeId: thirdEmployee.id });
    });
  });

  context("Verify email for pending training notification and approve Record", () => {
    it("Verify emails", () => {
      getEmailSetting =  {
        to: SECOND_USER.email,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };

      cy.imapGetMails({ userEmail: SECOND_USER.email, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: SECOND_USER.email,
          contains: ["Can you please approve my\r\n                                      request:)",
            `Hi ${SECOND_USER.name}`,
            "I sent a request for approval on\r\n",
            "RD-00003 Record document from newly created form",
            "Thank you,",
          ],
        }];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Get emails and visit Record approval url", () => {
      getEmailSetting =  {
        to: SECOND_USER.email,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetRecordRequestLink({ userEmail: SECOND_USER.email, options: getEmailSetting });
    });

    it("Approve Record", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").eq(1).arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(2000);
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Login with owner of approval and check popup modal info for Record", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: FIRST_USER, employeeId: secondEmployee.id });
    });

    it("Check if Record is 'In Review'", () => {
      cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").arrowClick();
    });

    context("Click on approval status and check the pop-up content", () => {
      it("Check if headline says 'Approval Status'", () => {
        cy.get("[id='simple-modal-title']").should("contain.text", "Approval Status");
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (2)");
        cy.get("[class*='MuiListItem-dense MuiListItem-gutters MuiListItem-button']")
          .find(`[data-cy="expand-icon"]`).arrowClick();
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", FIRST_USER.name)
          .and("contain.text", SECOND_USER.name)
          .and("contain.text", THIRD_USER.name);
        cy.get("h2").should("contain.text", "APPROVED (1)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        dateAfterEmailShouldArrive = moment().tz(TIME_ZONE).subtract(dateOffset, "milliseconds");
      });
    });
  });

  context("Login with second approver, check there was not email sent for user that already approved", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: SECOND_USER, employeeId: thirdEmployee.id });
    });

    it("Get emails", () => {
      getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };

      cy.imapGetMails({ userEmail: SECOND_USER.email, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify emails that should not be received", () => {
      const emailsThatShouldNotBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: SECOND_USER.email,
          contains: ["Can you please approve my\r\n                                      request:)"],
        },
      ];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldNotBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 0,
      });
    });
  });

  context("Login with third approver, check there was not email sent for user that already approved", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it(`Login as user ${THIRD_USER.name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: THIRD_USER, employeeId: fourthEmployee.id });
    });
  });

  context("Verify email for pending training notification and approve Record", () => {
    it("Get emails and visit Record approval url", () => {
      getEmailSetting =  {
        to: THIRD_USER.email,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetRecordRequestLink({ userEmail: THIRD_USER.email, options: getEmailSetting });
    });

    it("Approve Record", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").eq(1).arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(2000);
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Login with owner of approval and check email link", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it(`Login user as ${FIRST_USER.name} to dashboard`, () => {
      cy.authLoginToDashboard({ USER: FIRST_USER, employeeId: secondEmployee.id });
    });

    it("Get emails and visit Record approval url", () => {
      getEmailSetting =  {
        to: FIRST_USER.email,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetRecordRequestLink({ userEmail: FIRST_USER.email, options: getEmailSetting });
    });

    it("Approve Record", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").eq(1).arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(2000);
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
    });

    it(`Check if Record has status ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });
});
