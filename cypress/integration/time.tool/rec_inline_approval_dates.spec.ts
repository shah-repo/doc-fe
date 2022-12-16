// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { momentInPST } from "../../utils/constants/dateHandler";
import { LegalRecord } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let secondEmployee;
let inlineRecordForm;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let formDocumentType;
let legalRecordDocumentType;
let adminEmployee;
let asyncTasksGroup;
let emailsFromInbox;
let dateAfterEmailShouldArrive;
const approvalNotificationToday = momentInPST().format("MMM D, YYYY");
const approvalNotificationYesterday = momentInPST().subtract({ day: 1 }).format("MMM D, YYYY");

context("Record inline approval dates flow", { tags: ["@timetool"] }, () => {
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
            documentTypes: [
              LegalRecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          legalRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, LegalRecord.documentTypeName);
          done();
        });
      });
    });

    it("[API]Login admin user", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
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
          employees: [
            {
              id: adminEmployee.id,
            },
            {
              id: secondEmployee.id,
            },
          ],
        },
      });
    });

    it("[API]Create record inline form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
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
              name: "API record inline form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: legalRecordDocumentType[0].id,
                }],
                schema: [
                  {
                    index: 0,
                    type: "textfield",
                    tabId: "details",
                    name: "textfield-for-inline-l39qj0uv",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Textfield for inline",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    placeholder: "",
                    rows: 1,
                    label: "Textfield for inline",
                  },
                  {
                    index: 1,
                    type: "inlineapproval",
                    tabId: "details",
                    name: "inline-field-l39qj2f2",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Inline field",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    label: "Inline field",
                    editorConfig: {
                      approvers: [
                        adminEmployee.id,
                      ],
                    },
                  },
                  {
                    index: 2,
                    type: "textfield",
                    tabId: "details",
                    name: "second-textfield-for-inline-l39qj3i5",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Second textfield for inline",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    placeholder: "",
                    rows: 1,
                    label: "Second textfield for inline",
                  },
                  {
                    index: 3,
                    type: "inlineapproval",
                    tabId: "details",
                    name: "second-inline-field-l39qj5nh",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Second inline field",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    label: "Second inline field",
                    editorConfig: {
                      approvers: [
                        secondEmployee.id,
                      ],
                    },
                  },
                ],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            inlineRecordForm = response;
            cy.drAPIApproveAndRelease({
              documentId: inlineRecordForm.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]Create Legal record inline", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Record inline</p>",
          document: {
            docId: "LR-00003",
            documentType: {
              id: legalRecordDocumentType[0].id,
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
          name: "API record inline",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: {
            id: inlineRecordForm.id,
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Request approval for first inline", () => {
    context("Navigate to record inline", () => {
      it("Navigate to records list", () => {
        cy.navigToRecords();
      });

      it("Click on first record", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Fill first textfield and add inline approval", () => {
      it("Navigate to details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter text 'First entry' in textfield for inline", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[data-cy^=\"textfield-for-inline\"] input").arrowType("First entry");
          cy.unClick();
        });
      });

      it("Select approver for first inline", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
          cy.get("input[data-cy*=\"fb-ia-inline-field\"]").arrowClick().wait(1000);
          cy.get("ul>li[role=option]").contains(USERS[1].email).arrowClick();
          cy.unClick();
        });
      });

      context("Request for approval and send notification to email", () => {
        it("Verify no PENDING FOR APPROVAL text is present on first inline", () => {
          cy.get(`button[data-cy="fb-control-btn"]`).contains("Approve")
            .parentsUntil("button").parent().parent().parent()
            .should("not.contain.text", "PENDING APPROVAL");
        });

        it("Click request for approval on first inline", () => {
          cy.get(`div[data-cy="form.builder.request.approval"]`).arrowClick();
        });

        it("Verify PENDING FOR APPROVAL text is present on first inline", () => {
          cy.get(`button[data-cy="fb-control-btn"]`).contains("Approve")
            .parentsUntil("button").parent().parent().parent()
            .should("contain.text", "PENDING APPROVAL");
        });

        it("Navigate to dashboard", () => {
          cy.navigToDashboard();
        });

        it("Check if Approval Request is 'In Review'", () => {
          cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").arrowClick();
        });

        it("Check if pop-up modal has pending with all the approvers", () => {
          cy.get("h2").should("contain.text", "PENDING (1)");
          cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
          cy.get("h2").should("contain.text", "APPROVED (0)");
        });

        it("Click on 'EMAIL ALL'", () => {
          dateAfterEmailShouldArrive = new Date(new Date().getTime());
          cy.get("button").contains("EMAIL ALL").arrowClick();
        });

        it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
          cy.contains("EMAIL SENT TO ALL").should("exist");
          cy.get("button[aria-label=close]").eq(1).arrowClick();
          cy.get("button[aria-label=close]").eq(0).arrowClick();
        });
      });
    });
  });

  context("Time travel one day back to the future", () => {
    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it(`Select 1 day to back in future`, () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context("Request approval for second inline", () => {
    context("Navigate to record inline", () => {
      it("Navigate to records list", () => {
        cy.navigToRecords();
      });

      it("Click on first record", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Fill second textfield and add inline approval", () => {
      it("Navigate to details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter text 'First entry' in second textfield for inline", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAggregatedAudit], () => {
          cy.get("[data-cy^=\"second-textfield-for-inline\"] input")
            .type("First entry");
          cy.unClick();
        });
      });

      it("Select approver for second inline", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostApprovals, () => {
          cy.get("input[data-cy*=\"fb-ia-second-inline-field\"]").arrowClick().wait(1000);
          cy.get("ul>li[role=option]").contains(USERS[2].email).arrowClick();
          cy.unClick();
        });
      });

      context("Request for approval and send notification to email", () => {
        it("Verify no PENDING FOR APPROVAL text is present on first inline", () => {
          cy.get(`[data-cy="form.builder.request.approval"]`).eq(1)
            .parentsUntil("button").parent().parent().parent()
            .should("not.contain.text", "PENDING APPROVAL");
        });

        it("Click request for approval on first inline", () => {
          cy.get(`div[data-cy="form.builder.request.approval"]`).eq(1).arrowClick();
        });

        it("Verify PENDING FOR APPROVAL text is present on first inline", () => {
          cy.get(`[data-cy="form.builder.request.approval"]`).eq(1)
            .parentsUntil("button").parent().parent().parent()
            .should("contain.text", "PENDING APPROVAL");
        });

        it("Navigate to dashboard", () => {
          cy.navigToDashboard();
        });

        it("Check if Approval Request is 'In Review'", () => {
          cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").arrowClick();
        });

        it("Check if pop-up modal has pending with all the approvers", () => {
          cy.get("h2").should("contain.text", "PENDING (2)");
          cy.get("[class='MuiCollapse-wrapperInner']")
            .should("contain.text", USERS[1].name)
            .and("contain.text", USERS[2].name);
          cy.get("h2").should("contain.text", "APPROVED (0)");
        });

        it("Click on 'EMAIL ALL'", () => {
          cy.get("button").contains("EMAIL ALL").arrowClick();
        });

        it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
          cy.contains("EMAIL SENT TO ALL").should("exist");
          cy.get("button[aria-label=close]").eq(1).arrowClick();
          cy.get("button[aria-label=close]").eq(0).arrowClick();
        });
      });
    });
  });

  context("Verify received emails", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
      };
      cy.wait(10000);
      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify 'in review' emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [approvalNotificationToday, "LR-00003"],
        },
        {
          sentToUser: USERS[2].email,
          contains: [approvalNotificationToday, "LR-00003"],
        },
        {
          sentToUser: USERS[1].email,
          contains: [approvalNotificationYesterday, "LR-00003"],
        },
      ];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });
});

export { };
