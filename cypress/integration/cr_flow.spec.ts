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
let currentEmployee;
let componentSpecificationDocumentType;
let group;
const documentRevisionName = "New document for testing CR";
const changeRequestTitle = "Change request from newly created form";

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
            companyAdminEmail: "zoran.kovacevic+admin@codecons.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: `zoran.kovacevic+importer${runId}@codecons.com`,
            maxRevisionStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [{
              name: "Zoran 1",
              email: `zoran.kovacevic+1_${runId}@codecons.com`,
            }, {
              name: "Zoran 2",
              email: `zoran.kovacevic+2_${runId}@codecons.com`,
            }, {
              name: "Zoran 3",
              email: `zoran.kovacevic+3_${runId}@codecons.com`,
            }, {
              name: "Zoran 4",
              email: `zoran.kovacevic+4_${runId}@codecons.com`,
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
          currentEmployee = createdCompany.employees[0];
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          done();
        });
      });
    });

    it("Gets group by name", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: currentEmployee.id,
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
        employeeId: currentEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        done();
      });
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name });
    });
  });

  context("Create new CR form", () => {
    it("Navigate to document list", () => {
      cy.cmpNavigateToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Change request form template'", () => {
      cy.drEnterDocumentTitle({ name: "New Change request form template" });
    });

    it("Enter description 'New form template for change request'", () => {
      cy.drEnterDocumentDescription({ description: "New form template for change request" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Change request' outputdocument type", () => {
      cy.drSelectChangeRequestOutputDocType();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocument();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context("Create change request with newly created form", () => {
    it("Navigate to change request list", () => {
      cy.cmpNavigateToChangeRequestList();
    });

    it("Click Create a Change Request button", () => {
      cy.cmpClickCreateChangeRequest();
    });

    it("Choose Initial CR Form template", () => {
      cy.crSelectLastAddedCRForm();
    });

    it("Enter title CR title: " + changeRequestTitle, () => {
      cy.crEnterChangeRequestTitle({ title: changeRequestTitle });
    });

    it("Enter description 'CR from New form template for change request'", () => {
      cy.crEnterChangeRequestDescription({ description: "CR from New form template for change request" });
    });

    it("Add created document revision", () => {
      cy.crClickAddDocument();
      cy.crChoseProposedDocument();
      cy.crEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.crEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.crClickAddBtnOnAddDocumentsDialog();
    });

    it("Add first approver to change request on approver list", () => {
      cy.crAddFirstApproverOnChangeRequestApproverList();
    });

    it("Add date", () => {
      cy.crAddEffectiveDate();
    });

    it("Click Create Change Request", () => {
      cy.crClickCreateChangeRequestAfterCompletingForm();
    });

    it("Click send to review", () => {
      cy.crClickSendToReview();
    });

    it("Verify CR status", () => {
      cy.crVerifyStatus({ status: "In Review" });
    });
  });

  context("Check document revision is in review", () => {
    it("Navigate to added document in CR", () => {
      cy.cmpNavigateToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: documentRevisionName, status: "In Review" });
    });

    it("Check document revision status", () => {
      cy.drCheckDocumentStatus({ status: "In Review" });
    });
  });

  context("Approve created CR", () => {
    it("Navigate to added document in CR", () => {
      cy.cmpNavigateToChangeRequestList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.crFilterCRListByNameAndStatus({ title: changeRequestTitle, status: "In Review" });
    });

    it("Approve CR", () => {
      cy.crApproveCR();
    });

    it("Check change request status is approved", () => {
      cy.crVerifyStatus({ status: "Approved" });
    });
  });

  context("Check document revision is Released", () => {
    it("Navigate to added document in CR", () => {
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
