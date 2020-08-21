/* eslint-disable max-classes-per-file */
// / <reference types="Cypress" />
import { USERS } from "../utils/constants/users";
import { SystemRequirement } from "../utils/context/systemRequirement";

let createdCompany;
let sessionId;
let multipleCompanies;
const approvalRequestFormName = "Approval request form template";
const approvalRequestDocumentTitle = "Approval request from newly created form";
const sampleDocOneTitle = "Sample Document One";

context("Approval request form scenario", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400");
      SystemRequirement("REQ-0440");
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response: any) => {
        sessionId = response.sessionId as unknown as string;
        multipleCompanies = response.employees.length > 0;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            maxRevisionStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP",
                group: "OTHER",
                isQms: true,
              },
            ],
          }, sessionId,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Tester Login to get companies", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
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
        email: USERS[2].email,
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

    it("Click on 'Approval request' outputdocument type",
      () => {
        cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
      });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocument();
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
      cy.wait(5000);
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

    it("Add first approver to approval request on approver list",
      () => {
        cy.arAddApproverOnApproverList({ approver: USERS[1].email });
      });

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
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
      cy.get("[data-cy=\"common.description\"] textarea").should("be.disabled");
    });

    it("Check Document's justification is non-editable", () => {
      SystemRequirement("REQ-0850");
      cy.get("[data-cy=\"cr.justification\"] textarea").should("be.disabled");
    });

    it("Check 'Add Document' button is disbaled", () => {
      SystemRequirement("REQ-0850");
      cy.get("[data-cy=\"fb.add.document\"]").should("be.disabled");
    });

    //  approvers 'In_review' should be enabled now 'ENC-4797'
    it("Check 'Approvers' are not disabled", () => {
      SystemRequirement("REQ-0850");
      cy.get("[data-cy=\"approvers\"] input").should("not.be.disabled");
    });
  });

  context("Verify owner can withdraw approval request", () => {
    it("Withdraw Submission", () => {
      SystemRequirement("REQ-0890");
      cy.arWithdrawSubmission().wait(3000);
    });

    it("Sending for review again", () => {
      SystemRequirement("REQ-0890");
      cy.arClickSendToReview();
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

    it.skip("Document One already used, it must not be added again.", () => {
      SystemRequirement("REQ-0860");
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: sampleDocOneTitle });
      cy.arIsProposedDocumentEmpty();
      cy.get("[data-cy=\"FBButton-label\"]").click().wait(1000);
    });
  });

  context("User prompted to enter their user password when approving or rejecting an AR", () => {
    it("Logout existing user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Rejecting request gives prompt", () => {
      cy.arRejectComfirmationAR();
    });

    it("Accept Approval Request with password prompt", () => {
      SystemRequirement("REQ-0920");

      cy.arApproveAR();
      cy.wait(6000);
    });
  });

  context("Record the date and time stamp for approval and rejections", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Select first document", () => {
      cy.arSelectFirstDocument();
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
  });

});

export { };

