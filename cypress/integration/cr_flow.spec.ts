// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

import path from "path";

const runId = new Date().valueOf();
let createdCompany;
let loginResponse;
let currentEmployee;
let documentRevision;
let componentSpecificationDocumentType;
let group;

context(`Test: ${path.basename(__filename)}`, () => {
  it("Creates company", (done: any) => {
    cy.apiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;

      cy.createCompany({
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
          whiteLabeling: null,
          documentTypes: [],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        currentEmployee = createdCompany.employees[0];
        componentSpecificationDocumentType = createdCompany.documentTypes.filter((type) => type.documentTypeName === "Component Specification");
        done();
      });
    });
  });

  it("Gets group by name", () => {
    cy.getGroupByName({
      sessionId: loginResponse.sessionId,
      employeeId: currentEmployee.id,
      groupName: "Everyone",
    }).then((response) => {
      group = response.body;
      console.log(group);

    });
  });

  it("Creates document revision", (done: any) => {
    cy.createDocumentRevision({
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
                id: group[0].id,
              },
            ],
          },
        },
        name: "Test Doc Rev",
        referenceTo: [],
        retrain: false,
        revisionChangeType: "NEXT_REVISION",
        revisionStage: 1,

      },
      employeeId: currentEmployee.id as unknown as string,
      sessionId: loginResponse.sessionId as unknown as string,
    }).then((response) => {
      documentRevision = response;
      done();
    });
  });

  it("Logs user in", () => {
    cy.login({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
  });
  it("Selects company", () => {
    cy.selectCompany({ name: createdCompany.name });
  });
  //Create new form template for change request and release it"
  it("Navigate to document list", () => {
    cy.navigateToDocumentList();
  });
  it("Click on 'create a document'", () => {
    cy.clickCreateNewDocument();
  });
  it("Enter title 'New Change request form template'", () => {
    cy.enterDocumentTitle({ name: "New Change request form template" });
  });
  it("Enter description 'New form template for change request'", () => {
    cy.enterDocumentDescription({ description: "New form template for change request" });
  });
  it("Click on 'Form' document type", () => {
    cy.selectFormDocumentType();
  });
  it("Click on 'Change request' outputdocument type", () => {
    cy.selectChangeRequestOutputDocType();
  });
  it("Click create document after filling document", () => {
    cy.clickCreateDocument();
  });
  it("Approve and release document", () => {
    cy.approveAndReleaseDocument();
  });
  //Create change request with newly added form"
  it("Navigate to change request list", () => {
    cy.navigateToChangeRequestList();
  });
  it("Click Create a Change Request button", () => {
    cy.clickCreateChangeRequest();
  });
  it("Choose Initial CR Form template", () => {
    cy.selectLastAddedCRForm();
  });
  it("Enter title 'CR from New Change request form template'", () => {
    cy.enterChangeRequestTitle({ title: "CR from New Change request form template" });
  });
  it("Enter description 'CR from New form template for change request'", () => {
    cy.enterChangeRequestDescription({ description: "CR from New form template for change request" });
  });
  it("Add created document revision", () => {
    cy.clickAddDocument();
    cy.choseProposedDocument();
    cy.enterDescriptionAddDocumentsDialog({ description: "added document description"});
    cy.enterJustificationAddDocumentsDialog({ justification: "justification for added document"});
    cy.clickAddBtnOnAddDocumentsDialog();
  });
  it("Add first approver to change request on approver list", () => {
    cy.addFirstApproverOnChangeRequestApproverList();
  });
  it("Click Create Change Request", () => {
    cy.clickCreateChangeRequestAfterCompletingForm();
  });
  it("Add date", () => {
    cy.addEffectiveDate();
  });
  it("Click Create Change Request", () => {
    cy.clickSendToReview();
  });
  
});
// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };
