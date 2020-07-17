/* eslint-disable max-classes-per-file */
// / <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});
import path from "path";
import { RevisionChangeType } from "../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../support/commands/company/commands";

const runId = new Date().valueOf();
let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
const documentRevisionName = "New document for testing AR";
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";

context(`Test: ${path.basename(__filename)}`, () => {
  context("Create company and log in it", () => {
    it("Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;

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
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.name === "Second Tester");
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("API login second tester", (done: any) => {
      cy.authApiLogin({
        email: "enlil.testmail+cy2@gmail.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("Gets group by name", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => group = response);
    });

    it("Creates document revision", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test Doc Rev Description</p>",
          document: {
            docId: "CS-00004",
            documentType: {
              id: componentSpecificationDocumentType[0].id,
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
      }).then((response) => {
        done();
      });
    });

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

  context("Create new AR form", () => {
    it("Navigate to document list", () => {
      cy.cmpNavigateToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Approval request form template'", () => {
      cy.drEnterDocumentTitle({ name: approvalRequestFormName });
    });

    it("Enter description 'New form template for approval request'", () => {
      cy.drEnterDocumentDescription({ description: "New form template for approval request" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Approval request' outputdocument type", () => {
      cy.drSelectApprovalRequestOutputDocType();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocument();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => {
      cy.cmpNavigateToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.cmpClickCreateApprovalRequest();
    });

    it("Choose newly AR Form template", () => {
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
    });

    it("Add created document revision", () => {
      cy.arClickAddDocument();
      cy.arChoseProposedDocument();
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add first approver to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: "enlil.testmail+cy2@gmail.com" });
    });

    it("Add date", () => {
      cy.arAddEffectiveDate();
    });

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Click send to review", () => {
      cy.arClickSendToReview();
    });

    it("Verify AR status", () => {
      cy.arVerifyStatus({ status: "In Review" });
    });
  });

  context("Check document revision is in review", () => {
    it("Navigate to added document in AR", () => {
      cy.cmpNavigateToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "In Review" });
    });

    it("Check document revision status", () => {
      cy.drCheckDocumentStatus({ status: "In Review" });
    });
  });

  context("Approve created AR", () => {
    it("Navigate to added document in AR", () => {
      cy.cmpNavigateToApprovalRequestList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatus({ title: approvalRequestTitle, status: "In Review" });
    });

    it("Approve AR", () => {
      cy.arApproveAR();
    });

    it("Check approval request status is approved", () => {
      cy.arVerifyStatus({ status: "Approved" });
    });
  });

  context("Check document revision is Released", () => {
    it("Navigate to added document in AR", () => {
      cy.cmpNavigateToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "Released" });
    });

    it("Check document revision status is released", () => {
      cy.drCheckDocumentStatus({ status: "Released" });
    });
  });

});

export { };
