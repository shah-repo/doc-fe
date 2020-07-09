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

context(`Test: ${path.basename(__filename)}`, () => {
  it("Creates company", (done: any) => {
    cy.apiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;
      currentEmployee = loginResponse.employees[loginResponse.employees.length - 1];
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
        componentSpecificationDocumentType = createdCompany.documentTypes.filter((type) => type.documentTypeName === "Component Specification");
        done();
      });
    });
  });
  /* it("Creates document revision", (done: any) => {
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
                id: "039ed5b2-ef7a-4d9d-8541-2afac1114861",
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
  }); */
  it("Creates company", () => {
    cy.getGroupByName({
      sessionId: loginResponse.sessionId,
      employeeId: currentEmployee.id,
      groupName: "Everyone",
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
  it("Opens document list", () => {
    cy.get("[data-cy=\"navigation.documentList\"]").click();
  });
  it("Opens create document page", () => {
    cy.get("[data-cy=\"document.revision.create\"]").click();
  });
  it("Enter title 'New Change request form template'", () => {
    cy.get("[data-cy=\"field-name\"]").type("New Change request form template");
  });
  it("Enter description 'New form template for change request'", () => {
    cy.get("[data-cy=\"field-description\"]").click().type("New form template for change request");
  });
  it("Click on 'Form' document type", () => {
    cy.get("[data-cy=\"select.document.documentType.id\"]").click().get("[data-cy=\"selectItem.document.documentType.id.Form\"]").click();
  });
  it("Click on 'Change request' outputdocument type", () => {
    cy.get("[id=\"formTemplate.outputDocumentTypes").click().get("[id=\"react-select-6-option-0").click();
  });
  it("Click on Create Document", () => {
    cy.get("#DocumentRevisionForm-submit").click();
  });
  it("Click on Approve and Release", () => {
    cy.get("#ApproveAndRelease-button").click();
  });
  it("Choose Initial CR Form template", () => {
    cy.get("#FormList-selectForm").click().get("#FormList-selectForm>div:nth-child(3)>div>div:nth-child(1)").click().get("#ApproveAndRelease-submit").click();
  });
  it("Opens Change Request", () => {
    cy.get("[data-cy=\"navigation.changeRequestList\"]").click();
  });
  it("Click Create a Change Request", () => {
    cy.get("#ChangeRequest-create").click();
  });
  it("Choose Initial CR Form template", () => {
    cy.get("[type=\"radio\"]").last().check().get("#FormList-continueButton").click();
  });
  it("Enter title 'CR from New Change request form template'", () => {
    cy.get("[data-cy=\"field-title\"]").type("CR from New Change request form template");
  });
  it("Enter description 'CR from New form template for change request'", () => {
    cy.get("[data-cy=\"field-description\"]").type("CR from New form template for change request");
  });
  it("Add document to CR Details", () => {
    cy.get("[data-cy=\"fb.add.document\"]").click();
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };
