// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

import path from "path";

const runId = new Date().valueOf();
let company;
let docId;

context(`Validators Test: ${path.basename(__filename)}`, () => {
  it("Company exists", (done: any) => {
    cy.apiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((response: any) => {

      if ((response.employees || []).length <= 1) {
        // create company
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
          }, sessionId: response.sessionId,
        }).then((response) => {
          company = response;
          done();
        });
      }
      else {
        // use existing company
        company = response.employees[1].company;
        done();
      }
    });
  });

  it("Logs user in", () => {
    cy.login({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
  });

  it("Selects company", () => {
    cy.selectCompany({ name: company.name });
  });

  it("Opens create document page", () => {
    cy.get("[data-cy=\"document.list\"]", { timeout: 10 * 1000 }).click();
    cy.get("[data-cy=\"document.revision.create\"]").click();
  });

  it("Empty form shows errors", () => {
    cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
    cy.get(".MuiFormHelperText-root.Mui-error").its("length")
      .then((length) => length === 4)
  });

  it("type a title", () => {
    cy.get("#Title-field", { timeout: 10000 }).type("Test Title{enter}");
  });

  it("type a description", () => {
    cy.get("[data-cy=\"RichTextEditor.description\"]", { timeout: 10000 }).type("Test Desription");
  });

  it("fill in document type as Form", () => {
    cy.get("[data-cy=\"select.document.documentType.id\"]").click();
    cy.get("[data-cy=\"selectItem.document.documentType.id.Form\"]").click();
  });

  it("create document must give error for Output Document type", () => {
    cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
    cy.get(".MuiFormHelperText-root.Mui-error").its("length")
      .then((length) => length === 1)
  });

  it("fill in output document type", () => {
    cy.get("[data-cy=\"field-outputDocumentTypes\"]").click();
    cy.get("[data-cy=\"field-outputDocumentTypes\"]").type("Document Approval Matrix{enter}");
  });

  it("Store Document Id", () => {
    cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
    cy.get("[data-cy=\"common.docId\"]").then((element) => {
      const text = element.text();
      cy.log(text);
      docId = text.split(":")[1].trim();
      cy.log(docId);
    });
  });

  it("Approve and Release", () => {
    cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 1000 }).click();
    cy.get("#FormList-selectForm").type("Initial AR Form{enter}");
    cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
    cy.get("[data-cy=\"document.list\"]", { timeout: 10 * 1000 }).click();
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

