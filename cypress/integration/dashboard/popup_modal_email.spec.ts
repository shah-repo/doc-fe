// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import { TIME_ZONE } from "../../../src/common/utils/date";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { emailDateOffset } from "../../utils/constants/dateHandler";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const ADMIN_USER = USERS[29];
const FIRST_USER = USERS[11];
const SECOND_USER = USERS[12];
const THIRD_USER = USERS[13];
const documentRevisionName = "New document for testing AR";
const approvalRequestTitle = "Approval request from newly created form";

let createdCompany;
let loginResponse;
let secondEmployee;
let thirdEmployee;
let fourthEmployee;
let emailsFromInbox: IMAPEmail[];
let clinicalProtocolDocumentType;
let group;
let dateAfterEmailShouldArrive;
let getEmailSetting;

context("Approval request email popup modal", () => {
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
              ClinicalProtocolNotRedline,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === FIRST_USER.email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === SECOND_USER.email);
          fourthEmployee = createdCompany.employees.find((employee) => employee.user.email === THIRD_USER.email);
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: FIRST_USER.email,
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: FIRST_USER, employeeId: secondEmployee.id });
    });
  });

  context("Create approval request from existing form", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
    });

    it("Add first created document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add second created document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP-00005" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description 2" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document 2" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      cy.arSaveApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.wait(2000);
      cy.arAddApproverOnApproverList({ approver: FIRST_USER.email });
      cy.arAddApproverOnApproverList({ approver: SECOND_USER.email });
      cy.arAddApproverOnApproverList({ approver: THIRD_USER.email });
      cy.wait(2000);
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify AR status is ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Navigate to dashboard and send email to all approvers", () => {
    it("Navigate to dashboard", () => {
      cy.navigToDashboard();
    });

    it("Check if approval request is 'In Review'", () => {
      cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").arrowClick();
    });

    context("Click on approval request status and check the pop-up content", () => {
      it("Check if headline says 'Approval Status'", () => {
        cy.get("[id='simple-modal-title']").should("contain.text", "Approval Status");
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (3)");
        cy.get("[class='MuiCollapse-wrapperInner']")
          .should("contain.text", FIRST_USER.name)
          .and("contain.text", SECOND_USER.name)
          .and("contain.text", THIRD_USER.name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        dateAfterEmailShouldArrive = moment().tz(TIME_ZONE).subtract(emailDateOffset, "milliseconds");
      });
    });
  });

  context("Login with second approver, check email content and approve", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: SECOND_USER, employeeId: thirdEmployee.id });
      cy.wait(5000);
    });
  });

  context("Verify email for pending training notification and approve AR", () => {
    it("Verify emails", () => {
      getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: SECOND_USER.email,
          contains: ["Can you please approve my\r\n                                      request:)",
            `Hi ${SECOND_USER.name}`,
            "I sent a request for approval on",
            "AR-00001 Approval request from newly created form",
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

    it("Get emails and visit AR approval url", () => {
      getEmailSetting =  {
        to: SECOND_USER.email,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetApprovalRequestLink({ userEmail: SECOND_USER.email, options: getEmailSetting });
    });

    it("Approve AR", () => {
      cy.arApproveAR();
    });
  });

  context("Login with owner of approval and check popup modal info for AR", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: FIRST_USER, employeeId: secondEmployee.id });
    });

    it("Check if approval request is 'In Review'", () => {
      cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").arrowClick();
    });

    context("Click on approval request status and check the pop-up content", () => {
      it("Check if headline says 'Approval Status'", () => {
        cy.get("[id='simple-modal-title']").should("contain.text", "Approval Status");
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        SystemRequirement("REQ-2150", "REQ-5020");
        cy.get("h2").should("contain.text", "PENDING (2)");
        cy.get("[class*='MuiListItem-dense MuiListItem-gutters MuiListItem-button']>svg").eq(4).arrowClick();
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", FIRST_USER.name)
          .and("contain.text", SECOND_USER.name)
          .and("contain.text", THIRD_USER.name);
        cy.get("h2").should("contain.text", "APPROVED (1)");
      });

      it("Click on 'EMAIL ALL'", () => {
        SystemRequirement("REQ-5090");
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        dateAfterEmailShouldArrive = moment().tz(TIME_ZONE).subtract(emailDateOffset, "milliseconds");
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
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
      };

      cy.imapGetMails({
        userEmail: SECOND_USER.email,
        options: getEmailSetting,
      }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should not be received", () => {
      const emailsThatShouldNotBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: SECOND_USER.email,
          contains: ["Can you please approve my\r\n                                      request:)",
          ],
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

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: THIRD_USER, employeeId: fourthEmployee.id });
    });
  });

  context("Verify email for pending training notification and approve AR", () => {
    it("Get emails and visit AR approval url", () => {
      getEmailSetting =  {
        to: THIRD_USER.email,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetApprovalRequestLink({ userEmail: THIRD_USER.email, options: getEmailSetting });
    });

    it("Approve AR", () => {
      cy.arApproveAR();
    });
  });

  context("Login with owner of approval and check email link", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: FIRST_USER, employeeId: secondEmployee.id });
      cy.wait(5000);
    });

    it("Get emails and visit AR approval url", () => {
      getEmailSetting =  {
        to: FIRST_USER.email,
        after: dateAfterEmailShouldArrive,
        subject: "Can you please approve my request",
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetApprovalRequestLink({ userEmail: FIRST_USER.email, options: getEmailSetting });
    });

    it("Approve AR", () => {
      cy.arApproveAR();
    });

    it(`Check if AR has status ${STATUS_TYPES_LABEL.APPROVED}`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
    });
  });
});
