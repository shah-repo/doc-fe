/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];

let employeeLoginFirst;
let recordDocumentType;
let approvalRequestDocumentType;
let formDocumentType;
let group;
let initialArDocument;
let createdRecordFormDocument;
let createdCompany;
let loginResponse;
let secondEmployee;
let thirdEmployee;
let emailsFromInbox: IMAPEmail[];

const dateOffset = (5 * 1000);
const dateAfterEmailShouldArrive = new Date();
dateAfterEmailShouldArrive.setTime(dateAfterEmailShouldArrive.getTime() - dateOffset);
const currentDate = moment().tz("America/Los_Angeles").format("MMM D, YYYY");

context("Records Inline approval email popup modal", () => {
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
              RecordDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === FIRST_USER.email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === SECOND_USER.email);
          recordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create and release inline form for Record", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Record inline form</p>",
              document: {
                docId: "FM-00003",
                documentType: {
                  id: formDocumentType[0].id,
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
              name: "Record inline form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: recordDocumentType[0].id,
                }],
                schema: [
                  {
                    label: "form.builder.approvals",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l02u8tzp",
                    uniqueSchemaItem: true,
                    index: 0,
                  },
                  {
                    index: 1,
                    type: "section",
                    name: "textfield-kn7fc209",
                    validationMode: "default",
                    label: "Section 1",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 2,
                    type: "textfield",
                    name: "textfield1-kn7fc7w4",
                    rows: 1,
                    validationMode: "default",
                    label: "textfield 1",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 3,
                    type: "inlineapproval",
                    name: "inline-approval-kw6gbxwm",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Inline approval",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    label: "Inline approval",
                    editorConfig: {
                      groups: [
                        group.body[0].id,
                      ],
                    },
                  },
                  {
                    index: 4,
                    type: "section",
                    name: "textfield-kn7fc208",
                    validationMode: "default",
                    label: "Section 2",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 5,
                    type: "textfield",
                    name: "textfield2-kn7fc7w5",
                    rows: 1,
                    validationMode: "default",
                    label: "textfield 2",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 6,
                    type: "inlineapproval",
                    name: "inline-approval-kw6gbxwn",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Inline approval",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    label: "Inline approval",
                    editorConfig: {
                      groups: [
                        group.body[0].id,
                      ],
                    },
                  },
                ],
              },
            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdRecordFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdRecordFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a record from inline form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Record inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "Record inline form" });

      cy.dlSelectFirstDocument();
    });

    it("Click on Create New button", () => {
      cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Record inline form" });
    });

    it("Enter text in textfield", () => {
      cy.get("[name^=\"textfield1\"]").arrowType("Test one");
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Add inline approver for first section", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").eq(0).autocompleteSelect(`${FIRST_USER.name}`);
    });

    it("Click Request Approval button", () => {
      cy.contains("Request approval").arrowClick();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
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
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", FIRST_USER.name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        cy.wait(10000);
      });
    });
  });

  context("Login with first approver, check email content and approve", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: FIRST_USER, employeeId: secondEmployee.id });
    });
  });

  context("Verify email for pending notification and approve Record", () => {
    it("Verify emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: FIRST_USER.email,
          contains: ["Can you please approve my\r\n                                      request:)",
            `Hi ${FIRST_USER.name}`,
            "I sent a request for approval on\r\n",
            `${currentDate}`,
            "RD-00002 Record inline form",
            "Thank you,",
          ],
        }];

      // eslint-disable-next-line no-console
      console.log("emailsFromInbox", emailsFromInbox);
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Get emails and visit Record approval url", () => {
      cy.imapGetRecordRequestLink({ userEmail: FIRST_USER.email });
    });

    it("Approve Record", () => {
      cy.inlineApproval();
    });
  });

  context("Login with owner and add second approver", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: employeeLoginFirst.id });
    });
  });

  context("Open record and and second approver", () => {
    it("Open record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocRevPreview], () => {
        cy.contains("Record inline form").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview, CyRoutes.DocRevPreview], () => {
        cy.contains("Revision 2").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    it("Add inline approver for last section", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").eq(1).autocompleteSelect(`${SECOND_USER.name}`);
    });

    it("Click Request Approval button", () => {
      cy.contains("Request approval").arrowClick();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Check if Record is 'In Review'", () => {
      cy.navigToDashboard();
      cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").arrowClick();
    });

    context("Click on Record status and check the pop-up content", () => {
      it("Check if headline says 'Approval Status'", () => {
        cy.get("[id='simple-modal-title']").should("contain.text", "Approval Status");
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", SECOND_USER.name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        cy.wait(10000);
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

  context("Verify email for pending notification and approve Record", () => {
    it("Verify emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
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
            "I sent a request for approval on\r\n",
            `${currentDate}`,
            "RD-00002 Record inline form",
            "Thank you,",
          ],
        }];

      // eslint-disable-next-line no-console
      console.log("emailsFromInbox", emailsFromInbox);
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Get emails and visit Record approval url", () => {
      cy.imapGetRecordRequestLink({ userEmail: SECOND_USER.email });
    });

    it("Approve Record", () => {
      cy.inlineApproval();
    });
  });

  context("Login with owner and check approvers", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: employeeLoginFirst.id });
    });

    it("Record is in approved state on dashboard", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "RD-00002")
        .and("contain.text", SECOND_USER.name)
        .and("contain.text", "APPROVED");

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(1).find(".MuiGrid-container").eq(0)
        .should("contain.text", "RD-00002")
        .and("contain.text", FIRST_USER.name)
        .and("contain.text", "APPROVED");
    });
  });

});

export { };

