/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let sessionId;
let multipleCompanies;
let companyId: string;
let emailsFromInbox: IMAPEmail[];

const approvalRequestFormName = "Approval request form template";
const approvalRequestDocumentTitle = "Approval request from newly created form";
const sampleDocOneTitle = "Sample Document One";

const dateOffset = (5 * 1000);
const dateAfterEmailShouldArrive = new Date();
dateAfterEmailShouldArrive.setTime(dateAfterEmailShouldArrive.getTime() - dateOffset);

context("Approval request form scenario", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response: any) => {
        sessionId = response.sessionId as unknown as string;
        multipleCompanies = response.employees.length > 0;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[20].email,
            importerEmail: USERS[24].email,
            users: [USERS[21], USERS[22], USERS[23]],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId,
        }).then((response) => {
          createdCompany = response;
          companyId = createdCompany.id;
          done();
        });
      });
    });

    it("[API]Tester Login to get companies", (done: any) => {
      cy.authApiLogin({
        email: USERS[21].email,
        password: "Tester1!",
      }).then((response: any) => {
        multipleCompanies = response.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Log in user and select company", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[21].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Create new Approval Request form", () => {
    it("Enter title ", () => {
      cy.drEnterDocumentTitle({ name: approvalRequestFormName });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Approval request' outputdocument type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetAvailableApprovers, () => {
        cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
      });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Create sample Document One", () => {
    it("Enter title", () => {
      cy.drEnterDocumentTitle({ name: sampleDocOneTitle });
    });

    it("Enter description ", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Component Specification' outputdocument type", () =>
    {
      cy.drSelectOutputDocumentType({ documentType: "Component Specification" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.cmpClickCreateApprovalRequest();
    });

    it("Choose newly AR Form template", () => {
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
    });

    it("Enter Approval Request title", () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestDocumentTitle });
    });

    it("Enter description ", () => {
      cy.arEnterApprovalRequestDescription({ description: "Description" });
    });

    it("Add sample document one", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: sampleDocOneTitle });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "Document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "Justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    // TODO: data-cy=\"fb-approvers-approvers\"]").should(be.disabled");

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[20].email });
      cy.arAddApproverOnApproverList({ approver: USERS[22].email });
    });

    it("Click send to review", () => {
      cy.arClickSendToReview();
    });

    it("Verify AR status", () => {
      SystemRequirement("REQ-0020");
      cy.arVerifyStatus({ status: "In Review" });
    });
  });

  context("Verify Document is not editable in \"In Review\" status ", () => {
    it("Check title is ineditable and matches", () => {
      SystemRequirement("REQ-0850");
      cy.arCheckTitleInEditableAndMatches({ name: approvalRequestDocumentTitle });
    });

    it("Check non-editable description exists", () => {
      SystemRequirement("REQ-0850");
      cy.log("Existing of this tag means that description is shown in editable view");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]");
    });

    it("Check Document's description is non-editable", () => {
      SystemRequirement("REQ-0850");
      cy.get("div[name$=\"descriptionOfChange\"]").should("have.attr", "disabled");
    });

    it("Check Document's justification is non-editable", () => {
      SystemRequirement("REQ-0850");
      cy.get("div[name$=\"justificationOfChange\"]").should("have.attr", "disabled");
    });

    it("Check 'Add Document' button is disbaled", () => {
      SystemRequirement("REQ-0850");
      cy.get("[data-cy=\"fb.add.document\"]").should("be.disabled");
    });

    //  approvers 'In_review' should be enabled now 'ENC-4797'
    it("Check 'Approvers' are not disabled", () => {
      SystemRequirement("REQ-0850");
      cy.get("input[data-cy=\"fb-approvers-approvers\"]").should("not.be.disabled");
    });
  });

  context("Verify owner can withdraw approval request and that dashboard notifications are not shown", () => {
    context("Withdraw AR", () => {
      it("Withdraw Submission", () => {
        SystemRequirement("REQ-0890");
        cy.arWithdrawSubmission();
        cy.checkToastMessage({ exists: false });
      });
    });

    context("Verify dashboard notification are not shown", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[20].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Verify there is no dashboard notifications", () => {
        SystemRequirement("REQ-2190");
        cy.cmpVerifyNoPendingActions();
      });
    });

    context("Send AR to review again", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[21].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Navigate to AR", () => {
        cy.navigToApprovalRequestList();
        cy.alClearFilters();
        cy.arSelectFirstDocument();
      });

      it("Sending for review again", () => {
        SystemRequirement("REQ-0890");
        cy.arClickSendToReview();
      });
    });
  });

  context("Prevent the addition of documents that are already included on another approval request", () => {
    it("Navigate to approval request list", () => {
      SystemRequirement("REQ-0860");
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      SystemRequirement("REQ-0860");
      cy.cmpClickCreateApprovalRequest();
    });

    it("Choose newly AR Form template", () => {
      SystemRequirement("REQ-0860");
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
    });

    it("Document One already used, it must not be added again.", () => {
      SystemRequirement("REQ-0860");
      cy.arClickAddDocument();
      cy.arIsProposedDocumentEmpty();
      cy.get("[data-cy=\"form.builder.cancel\"]").click().wait(1000);
    });
  });

  context("Reject AR and verify email notification", () => {
    context("Reject AR", () => {
      it("Logout existing user", () => {
        cy.authLogout();
      });

      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[20].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Rejecting request gives prompt", () => {
        cy.arRejectComfirmationAR();
      });

      it("Verify message is shown if e-signature not met", () => {
        SystemRequirement("REQ-0880");
        cy.arVerifySignatureIsNotMet();
        cy.closeAllAlertMessages();
      });

      it("Reject AR from dashboard", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostRejectCR, CyRoutes.ARPreview, CyRoutes.GetPendingActions], () => {
          cy.poRejectAR({ password: "Tester1!" });
        });
      });
    });

    context("Verify dashboard notification are not shown", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[22].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Verify there is no dashboard notifications", () => {
        SystemRequirement("REQ-2190");
        cy.cmpVerifyNoPendingActions();
      });
    });
  });

  context("Send to review again and approve", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[21].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Select first document", () => {
      cy.alClearFilters();
      cy.arSelectFirstDocument();
    });

    it("Click send to review", () => {
      cy.arClickSendToReview();
    });
  });

  context("Approve AR and verify email notifications are received", () => {
    context("Approve AR with first approver", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[20].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Accept Approval Request with password prompt", () => {
        SystemRequirement("REQ-0920");
        cy.arApproveAR();
      });
    });

    context("Approve AR with second approver", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[22].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Accept Approval Request with password prompt", () => {
        SystemRequirement("REQ-0920");
        cy.arApproveAR();
      });
    });
  });

  context("Record the date and time stamp for approval and rejections", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Select first document", () => {
      cy.alClearFilters();
      cy.arSelectFirstDocument();
    });

    it("Verify AR status is 'Approved'", () => {
      cy.arVerifyStatus({ status: "Approved" });
    });

    it("Open history drawer", () => {
      cy.get("[data-cy=\"timeline-icon\"]").click();
    });

    it("Capture Audit date", () => {
      SystemRequirement("REQ-0960");
      cy.get("[data-cy=\"audit-time-0\"]").should("not.be.empty");
    });

    it("Capture Audit timestamp", () => {
      SystemRequirement("REQ-0960");
      cy.get("[data-cy=\"audit-time-0\"]").should("have.attr", "datetime").then(($time) => {
        cy.wrap($time).should("not.be.empty");
      });
    });

    it("Navigate to dashboard", () => {
      SystemRequirement("REQ-2200");
      cy.navigToDashboard();
    });

    it("Verify there is no dashboard notifications", () => {
      SystemRequirement("REQ-2200");
      cy.cmpVerifyNoPendingActions();
    });
  });

  context("Verify emails", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        wait_time_sec: 5,
        max_wait_time_sec: 50,
        include_body: true,
        after: dateAfterEmailShouldArrive,
      };
      cy.wait(20000);
      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
        if (emails) {
          emailsFromInbox = emails;
        }
        else {
          assert.fail("No email found");
        }
      });
    });

    it("Verify 'in review' emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[20].email,
          contains: ["Your approval request <b>ARID: AR00002</b> is in review.", companyId],
        },
        {
          sentToUser: USERS[22].email,
          contains: ["Your approval request <b>ARID: AR00002</b> is in review.", companyId],
        },
      ];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 3,
      });
    });

    it("Verify 'approved' emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[21].email,
          contains: ["Your approval request <b>ARID: AR00002</b> is approved.", companyId],
        },
      ];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Verify 'rejected' emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[21].email,
          contains: ["Your approval request <b>ARID: AR00002</b> is rejected.", companyId],
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

