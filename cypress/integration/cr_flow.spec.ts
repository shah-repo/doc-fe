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

context(`Test: ${path.basename(__filename)}`, () => {
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
          documentTypes: [],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        currentEmployee = createdCompany.employees[0];
        componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
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
        name: "Test Doc Rev",
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
    cy.drSelectFormDocumentType();
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

  it("Navigate to change request list", () => {
    cy.cmpNavigateToChangeRequestList();
  });

  it("Click Create a Change Request button", () => {
    cy.cmpClickCreateChangeRequest();
  });

  it("Choose Initial CR Form template", () => {
    cy.crSelectLastAddedCRForm();
  });

  it("Enter title 'CR from New Change request form template'", () => {
    cy.crEnterChangeRequestTitle({ title: "CR from New Change request form template" });
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

  it("Click Create Change Request", () => {
    cy.crClickSendToReview();
  });

});

export { };
