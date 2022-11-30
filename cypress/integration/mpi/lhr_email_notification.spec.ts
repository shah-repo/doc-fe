/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { lotDateSuffix } from "../../utils/constants/dateHandler";
import { LHRT } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";


let createdCompany;
let loginResponse;
let adminEmployee;
let secondApprover;
let thirdApprover;
let approvalRequestDocumentType;
let initialArDocument;
let group;

let partDocumentType;
let createdPartDocument;

let lhr1DocUrl;
let lhr2DocUrl;
let lhr3DocUrl;
let lhrtDocUrl;

enum BUILD_TYPE {
  RD = "R&D",
  Production = "Production"
}
const LHRTTitle = "LHRt document";
const CSPartDocumentTitle = "Part Document";
const MPIDocumentTitle =  "MPI document";

const dataCyFbApprovals = "[data-cy^=\"fb-approvals-fb-approvals\"]";
const dataCyOptions = "ul>li[role=option]";
const lhrInitialQuantityName = "[name=\"lhr_initial_quantity\"]";

const dateAfterEmailShouldArrive = new Date();
let emailsFromInbox: IMAPEmail[];

const LHR4 = "LHR-00004";
const LHR6 = "LHR-00006";
const LHR7 = "LHR-00007";

context("LHRs email notifications", () => {
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
              LotHistoryRecordTest,
              MPITest,
              LHRT,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondApprover = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdApprover = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create part document", (done: any) => {
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
              description: "<p>Part document</p>",
              document: {
                docId: "CS-00005",
                documentType: {
                  id: partDocumentType[0].id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [{ id: group.body[0].id }],
                },
              },
              name: CSPartDocumentTitle,
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });


  context("Create MPI document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the MPI attributes", () => {
      it("Enter title 'MPI document", () => {
        cy.drEnterDocumentTitle({ name: MPIDocumentTitle });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Manufacturing Process Instructions Test' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      context("Release MPI", () => {
        it("Approve and release MPI document", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });
  });


  context("Create LHRt document", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.unClick();
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill LHRt document attributes", () => {
      it("Enter document title 'LHRt document'", () => {
        cy.drEnterDocumentTitle({ name: LHRTTitle });
      });

      it("Fill LHRt document description", () => {
        cy.drEnterDocumentDescription({ description: "LHRt document description" });
      });

      it("Select 'LHRt' document type", () => {
        cy.drSelectDocumentType({ documentType: "LHR template" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Lot History Record Test' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Lot History Record Test" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select 'Part document' for Part to be Manufactured", () => {
        cy.get("[data-cy=\"lhr-selected-part\"]").arrowType(CSPartDocumentTitle);
        cy.get(dataCyOptions).contains(CSPartDocumentTitle).arrowClick();
      });

      context("Select created MPI in LHR template", () => {
        it("Select Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Click 'LHR Step'", () => {
          cy.get("[data-cy^=\"LHR Step\"]").arrowClick();
        });

        it("Select MPI document for step #1 in LHRt", () => {
          cy.get("div[class^=\"MuiExpansionPanelSummary\"]").eq(0).arrowClick({ force: true });
          cy.get("input[data-cy=\"lhrstep-built-in\"]").autocompleteSelect(MPIDocumentTitle, { force: true });
        });
      });

      context("Release LHRt", () => {
        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
          cy.url().then((url: any) => {
            lhrtDocUrl = url;
          });
        });

        it("Approve and release LHRt document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });
  });


  context(`Create LHR A - Build Type '${BUILD_TYPE.Production}'`, () => {
    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Enter initial quantity", () => {
      cy.get(lhrInitialQuantityName).arrowType("10");
    });

    it(`Select '${BUILD_TYPE.Production}' build type`, () => {
      cy.unClick();
      cy.get(`[value=\"${BUILD_TYPE.Production}\"]`).check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.url().then((url: any) => {
        lhr1DocUrl = url;
      });
    });

    context("Start and Release LHRs #1", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy^=\"LHR Step\"]").arrowClick();
      });
      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });
      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });
      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
      });
      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8");
      });
      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
      });
      it("Save changes in LHRs", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });
      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });
      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
      it("Click 'Submit for Approval' button", () => {
        cy.wait(5000);
        cy.pmSubmitForApproval();
      });
      it("Click 'Approve' button", () => {
        cy.ebApprove();
      });
    });

    context("Add approvers to LHR A", () => {
      it("Navigate to LHR A Document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhr1DocUrl);
        });
      });

      it("Add a first Approval", () => {
        cy.get(dataCyFbApprovals).arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get(dataCyOptions).contains(USERS[2].name).arrowClick();
        });
      });

      it("Add a second Approval", () => {
        cy.get(dataCyFbApprovals).arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get(dataCyOptions).contains(USERS[3].name).arrowClick();
        });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.wait(5000);
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });
    });
  });


  context(`Create LHR B - Build Type '${BUILD_TYPE.RD}'`, () => {
    it("Navigate to LHRt Document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
        cy.visit(lhrtDocUrl);
      });
    });

    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Enter initial quantity", () => {
      cy.get(lhrInitialQuantityName).arrowType("10");
    });

    it(`Select '${BUILD_TYPE.RD}' build type`, () => {
      cy.unClick();
      cy.get(`[value=\"${BUILD_TYPE.RD}\"]`).check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.url().then((url: any) => {
        lhr2DocUrl = url;
      });
    });

    context("Start and Release LHRs #1", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy^=\"LHR Step\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });
      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });
      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
      });
      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8");
      });
      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
      });
      it("Save changes in LHRs", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });
      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });
      it("Click 'Submit for Approval' button", () => {
        cy.wait(5000);
        cy.pmSubmitForApproval();
      });
      it("Click 'Approve' button", () => {
        cy.ebApprove();
      });
    });

    context("Add approvers to LHR B", () => {
      it("Navigate to LHR B Document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhr2DocUrl);
        });
      });

      it("Add a first Approval", () => {
        cy.get(dataCyFbApprovals).arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get(dataCyOptions).contains(USERS[2].name).arrowClick();
        });
      });

      it("Add a second Approval", () => {
        cy.get(dataCyFbApprovals).arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get(dataCyOptions).contains(USERS[3].name).arrowClick();
        });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.wait(5000);
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });
    });
  });


  context(`Create LHR C - Build Type '${BUILD_TYPE.Production}' switch to Build Type '${BUILD_TYPE.RD}'`, () => {
    it("Navigate to LHRt Document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
        cy.visit(lhrtDocUrl);
      });
    });

    it("Click create new document from LHRt", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetRequiredApproversDocRev,
        CyRoutes.GetAutocompleteOptions], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });

    it("Enter initial quantity", () => {
      cy.get(lhrInitialQuantityName).arrowType("10");
    });

    it(`Select '${BUILD_TYPE.Production}' build type`, () => {
      cy.unClick();
      cy.get(`[value=\"${BUILD_TYPE.Production}\"]`).check();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
    });

    it("Click save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it(`Select '${BUILD_TYPE.RD}' build type`, () => {
      cy.unClick();
      cy.get(`[value=\"${BUILD_TYPE.RD}\"]`).check();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.url().then((url: any) => {
        lhr3DocUrl = url;
      });
    });

    context("Start and Release LHRs #1", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'LHR Step'", () => {
        cy.get("[data-cy^=\"LHR Step\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });
      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });
      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
      });
      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8");
      });
      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
      });
      it("Save changes in LHRs", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });
      it("Add an Approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });
      it("Click 'Submit for Approval' button", () => {
        cy.wait(5000);
        cy.pmSubmitForApproval();
      });
      it("Click 'Approve' button", () => {
        cy.ebApprove();
      });
    });

    context("Add approvers to LHR C", () => {
      it("Navigate to LHR C Document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhr3DocUrl);
        });
      });

      it("Add a first Approval", () => {
        cy.get(dataCyFbApprovals).arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get(dataCyOptions).contains(USERS[2].name).arrowClick();
        });
      });

      it("Add a second Approval", () => {
        cy.get(dataCyFbApprovals).arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get(dataCyOptions).contains(USERS[3].name).arrowClick();
        });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.wait(5000);
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });
        cy.listLoadingElementShouldNotExist();
      });
    });
  });


  context("Verify emails for submitted LHR", () => {
    it("Verify emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
      };

      cy.wait(10000);
      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify emails for LHR A", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[2].email,
          contains: [
            `Hello <b>${USERS[2].name},</b><br/><br/>`,
            `<b>${LHR4}, LOT #${lotDateSuffix()}01</b> is in review and you are an approver.`,
          ],
        },
        {
          sentToUser: USERS[3].email,
          contains: [
            `Hello <b>${USERS[3].name},</b><br/><br/>`,
            `<b>${LHR4}, LOT #${lotDateSuffix()}01</b> is in review and you are an approver.`,
          ],
        },

      ];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Verify emails for LHR B", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[2].email,
          contains: [
            `Hello <b>${USERS[2].name},</b><br/><br/>`,
            `<b>${LHR6}, LOT #${lotDateSuffix()}02RD</b> is in review and you are an approver.`,
          ],
        },
        {
          sentToUser: USERS[3].email,
          contains: [
            `Hello <b>${USERS[3].name},</b><br/><br/>`,
            `<b>${LHR6}, LOT #${lotDateSuffix()}02RD</b> is in review and you are an approver.`,
          ],
        },
      ];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Verify emails for LHR C", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[2].email,
          contains: [
            `Hello <b>${USERS[2].name},</b><br/><br/>`,
            `<b>${LHR7}, LOT #${lotDateSuffix()}03RD</b> is in review and you are an approver.`,
          ],
        },
        {
          sentToUser: USERS[3].email,
          contains: [
            `Hello <b>${USERS[3].name},</b><br/><br/>`,
            `<b>${LHR7}, LOT #${lotDateSuffix()}03RD</b> is in review and you are an approver.`,
          ],
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

  context("Confirm Emails for revised LHR", () => {
    context("Approve LHRs as Approver 1", () => {
      it(`Login approver 1 to dashboard`, () => {
        cy.authLogout();
        cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondApprover.id });
      });

      ["C", "B", "A"].forEach((lhrName) => {
        it(`Click approve for the LHR ${lhrName}`, () => {
          cy.wait(2000);
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.PostApprovalsApprove], () => {
              cy.contains("needs your approval for").eq(0).trigger("mouseover");
              cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
              cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
              cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
              cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
            });

          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.checkToastMessage({ exists: false });
        });
      });
    });

    context("Approve LHRs as Approver 2", () => {
      it(`Login approver 2 to dashboard`, () => {
        cy.authLogout();
        cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdApprover.id });
      });

      ["C", "B", "A"].forEach((lhrName) => {
        it(`Click approve for the LHR ${lhrName}`, () => {
          cy.wait(2000);
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.PostApprovalsApprove], () => {
              cy.contains("needs your approval for").eq(0).trigger("mouseover");
              cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
              cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
              cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
              cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
            });

          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.checkToastMessage({ exists: false });
        });
      });
    });

    context("Login as LHR owner", () => {
      it(`Login owner to dashboard`, () => {
        cy.authLogout();
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });
    });

    context(`Submit for approval revised LHR A - Build Type: ${BUILD_TYPE.RD}`, () => {
      it("Navigate to LHR A Document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhr1DocUrl);
        });
      });

      it("Revise LHR", () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
      });

      it(`Select '${BUILD_TYPE.RD}' build type`, () => {
        cy.unClick();
        cy.get(`[value=\"${BUILD_TYPE.RD}\"]`).check();
      });

      it("Click save document", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
          });
        cy.checkToastMessage({ exists: false });
        cy.listLoadingElementShouldNotExist();
      });

      context("Add approvers to LHR A", () => {
        it("Add a first Approval", () => {
          cy.get(dataCyFbApprovals).arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get(dataCyOptions).contains(USERS[2].name).arrowClick();
          });
        });

        it("Add a second Approval", () => {
          cy.get(dataCyFbApprovals).arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get(dataCyOptions).contains(USERS[3].name).arrowClick();
          });
        });

        it("Click 'Submit for Approval' button", () => {
          cy.wait(5000);
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
          });
          cy.listLoadingElementShouldNotExist();
        });
      });
    });

    context(`Submit for approval revised LHR B - Build Type: ${BUILD_TYPE.RD}`, () => {
      it("Navigate to LHR B Document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhr2DocUrl);
        });
      });

      it("Revise LHR", () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
        cy.wait(5000);
      });

      context("Add approvers to LHR B", () => {
        it("Add a first Approval", () => {
          cy.get(dataCyFbApprovals).arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get(dataCyOptions).contains(USERS[2].name).arrowClick();
          });
        });

        it("Add a second Approval", () => {
          cy.get(dataCyFbApprovals).arrowClick();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get(dataCyOptions).contains(USERS[3].name).arrowClick();
          });
        });

        it("Click 'Submit for Approval' button", () => {
          cy.wait(5000);
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
            cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
          });
          cy.listLoadingElementShouldNotExist();
        });
      });
    });

    context("Verify emails for submitted LHR", () => {
      it("Verify emails", () => {
        const getEmailSetting =  {
          to: CONFIG.TEST_EMAIL,
          after: dateAfterEmailShouldArrive,
        };

        cy.wait(10000);
        cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
          emailsFromInbox = emails;
        });
      });

      it("Verify emails for LHR A", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: USERS[2].email,
            contains: [
              `Hello <b>${USERS[2].name},</b><br/><br/>`,
              `<b>${LHR4}, LOT #${lotDateSuffix()}01RD</b> is in review and you are an approver.`,
            ],
          },
          {
            sentToUser: USERS[3].email,
            contains: [
              `Hello <b>${USERS[3].name},</b><br/><br/>`,
              `<b>${LHR4}, LOT #${lotDateSuffix()}01RD</b> is in review and you are an approver.`,
            ],
          },

        ];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 1,
        });
      });

      it("Verify emails for LHR B", () => {
        const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
          {
            sentToUser: USERS[2].email,
            contains: [
              `Hello <b>${USERS[2].name},</b><br/><br/>`,
              `<b>${LHR6}, LOT #${lotDateSuffix()}02RD</b> is in review and you are an approver.`,
            ],
          },
          {
            sentToUser: USERS[3].email,
            contains: [
              `Hello <b>${USERS[3].name},</b><br/><br/>`,
              `<b>${LHR6}, LOT #${lotDateSuffix()}02RD</b> is in review and you are an approver.`,
            ],
          },
        ];

        cy.imapVerifyEmailsInList({
          receivedEmails: emailsFromInbox,
          emailsToTest: emailsThatShouldBeReceived,
          getEmailsSincedate: dateAfterEmailShouldArrive,
          assertNumberOfEmailsFoundInList: 2,
        });
      });
    });
  });
});
