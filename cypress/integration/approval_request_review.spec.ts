/* eslint-disable max-classes-per-file */
// / <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

import { SystemRequirement } from "../utils/context/systemRequirement";

const runId = new Date().valueOf();
let createdCompany;
let sessionId;
let multipleCompanies;
const approvalRequestFormName = "Approval request form template";
const approvalRequestDocumentTitle = "Approval request from newly created form";
const sampleDocOneTitle = "Sample Document One";

context("Approval request form scenario", () => {
  context("[API]Prepare company", () => {

    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response: any) => {
        sessionId = response.sessionId as unknown as string;
        multipleCompanies = response.employees.length > 0;

        cy.cmpCreateCompany({
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: "enlil.testmail+cy1@gmail.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [
              {
                name: "Second Tester",
                email: "enlil.testmail+cy2@gmail.com",
              },
              {
                name: "Third Tester",
                email: "enlil.testmail+cy3@gmail.com",
              },
              {
                name: "Fourth Tester",
                email: "enlil.testmail+cy4@gmail.com",
              }],
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
          }, sessionId
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Tester Login to get companies", (done: any) => {
      cy.authApiLogin({
        email: "enlil.testmail+cy2@gmail.com",
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
        email: "enlil.testmail+cy2@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => cy.cmpNavigateToDocumentList());

    it("Click on 'create a document'", () => cy.cmpClickCreateNewDocument());
  });

  context("Create new Approval Request form", () => {
    it("Enter title ", () => cy.drEnterDocumentTitle({ name: approvalRequestFormName }));

    it("Enter description", () => cy.drEnterDocumentDescription({ description: "Description" }));

    it("Click on 'Form' document type", () => cy.drSelectDocumentType({ documentType: "Form" }));

    it("Click on 'Approval request' outputdocument type",
      () => cy.drSelectOutputDocType({ documentType: "Approval Request" }));

    it("Click create document", () => cy.drClickCreateDocument());

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocument();
      cy.wait(8000);
    });
  });

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => {
      cy.cmpNavigateToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Create sample Document One", () => {
    it("Enter title", () => cy.drEnterDocumentTitle({ name: sampleDocOneTitle }));

    it("Enter description ", () => cy.drEnterDocumentDescription({ description: "Description" }));

    it("Click on 'Form' document type", () => cy.drSelectDocumentType({ documentType: "Form" }));

    it("Click on 'Component Specification' outputdocument type", () =>
      cy.drSelectOutputDocType({ documentType: "Component Specification" }));

    it("Click create document", () => cy.drClickCreateDocument());
  });

  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => cy.cmpNavigateToApprovalRequestList());

    it("Click Create a Approval Request button", () => cy.cmpClickCreateApprovalRequest());

    it("Choose newly AR Form template", () => {
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
      cy.wait(5000);
    });

    it(`Enter Approval Request title`, () => cy.arEnterApprovalRequestTitle({ title: approvalRequestDocumentTitle }));

    it("Enter description ", () => cy.arEnterApprovalRequestDescription({ description: "Description" }));

    it("Add sample document one", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument(sampleDocOneTitle);
      cy.arEnterDescriptionAddDocumentsDialog({ description: "Document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "Justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add first approver to approval request on approver list",
      () => cy.arAddApproverOnApproverList({ approver: "enlil.testmail+cy1@gmail.com" }));

    it("Add date", () => cy.arAddEffectiveDate());

    it("Click Create Approval Request", () => cy.arClickCreateApprovalRequestAfterCompletingForm());

    it("Click send to review", () => cy.arClickSendToReview());

    it("Verify AR status", () => cy.arVerifyStatus({ status: "In Review" }));
  });

  context("Verify Document is not editable in \"In Review\" status ", () => {
    SystemRequirement("REQ-0850");

    it("Check title is ineditable and matches", () =>
      cy.arCheckTitleInEditableAndMatches({ name: approvalRequestDocumentTitle }));

    it("Check non-editable description exists", () => {
      cy.log("Existing of this tag means that description is shown in editable view");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]");
    });

    it("Check Document's description is non-editable", () =>
      cy.get("[data-cy=\"common.description\"] textarea").should("be.disabled"));

    it("Check Document's justification is non-editable", () => cy.get("[data-cy=\"cr.justification\"] textarea").should("be.disabled"));

    it("Check 'Add Document' button is disbaled", () => cy.get("[data-cy=\"fb.add.document\"]").should("be.disabled"));

    it("Check 'Effective Date' is disabled", () => cy.xpath("//input[@name]/ ../div/button").should("be.disabled"))

    it("Check 'Approvers' are disbaled", () => cy.get("[data-cy=\"approvers\"] input").should("be.disabled"));
  });

  context("Verify owner can withdraw approval request", () => {
    SystemRequirement("REQ-0890");

    it("Withdraw Submission", () => cy.arWithdrawSubmission().wait(3000));

    it("Sending for review again", () => cy.arClickSendToReview());
  });

  context("Prevent the addition of documents that are already included on another approval request", () => {
    SystemRequirement("REQ-0860");

    it("Navigate to approval request list", () => cy.cmpNavigateToApprovalRequestList());

    it("Click Create a Approval Request button", () => cy.cmpClickCreateApprovalRequest());

    it("Choose newly AR Form template", () => cy.arSelectARForm({ formTitle: approvalRequestFormName }));

    it("Document One already used, it must not be added again.", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument(sampleDocOneTitle);
      cy.arIsProposedDocumentEmpty();
      cy.get("[data-cy=\"FBButton-label\"]").click().wait(1000);
    });
  });

  context("User prompted to enter their user password when approving or rejecting an AR", () => {
    SystemRequirement("REQ-0920");

    it("Logout existing user", () => cy.authLogout());

    it("Logs user in", () => {
      cy.authLogin({
        email: "enlil.testmail+cy1@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies }));

    it("Rejecting request gives prompt", () => cy.arRejectComfirmationAR());

    it("Accept Approval Request with password prompt", () => {
      cy.arApproveAR();
      cy.wait(6000);
    })
  });

  context("Record the date and time stamp for approval and rejections", () => {
    SystemRequirement("REQ-0960");

    it("Navigate to approval request list", () => cy.cmpNavigateToApprovalRequestList());

    it("Select first document", () => cy.arSelectFirstDocument());

    it("Open history drawer", () => cy.get("[data-cy=\"timeline-icon\"]").click());

    it("Capture Audit date", () => cy.get("[data-cy=\"audit-time-0\"]").should("not.be.empty"));

    it("Capture Audit timestamp", () => {
      cy.get("[data-cy=\"audit-time-0\"]").should('have.attr', 'datetime').then($time => {
        cy.wrap($time).should("not.be.empty");
      });

    });
  });

});

export { };
