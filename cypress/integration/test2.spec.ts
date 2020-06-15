// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

const runId = new Date().valueOf();
let createdCompany;

context("Test", () => {
  it("Creates company", (done: any) => {
    cy.apiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((sessionId) => {
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
        }, sessionId: sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        done();
      });
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
    // cy.get("[data-cy=\"Navigation.dashboard\"]").click();
    // cy.get("[data-cy=\"Navigation.document.list\"]").click();
    // cy.get("[data-cy=\"Navigation.change.list\"]").click();
    // cy.get("[data-cy=\"Navigation.user.management\"]").click();
    // cy.get("[data-cy=\"Navigation.group.management\"]").click();
    // cy.get("[data-cy=\"Navigation.document_type.Receivable\"]").click();
    // cy.get("[data-cy=\"Navigation.document_type.Purchase Order\"]").click();
    // cy.get("[data-cy=\"Navigation.document_type.Suppliers\"]").click();

    // cy.visit('http://localhost:4213/document_revision/create');
  });

  it("Opens document list", () => {
    cy.get("[data-cy=\"Navigation.document.list\"]", { timeout: 10 * 1000 }).click();
  });
  it("Opens create document page", () => {
    cy.get("[data-cy=\"document.revision.create\"]").click();
  });
  it("fills in description", () => {
    cy.get("[data-cy=\"RichTextEditor.description\"]", { timeout: 10000 }).type("Desription");
  });
  it("fills in document type", () => {
    cy.get("[data-cy=\"select.document.documentType.id\"]").click();
    cy.get("[data-cy=\"selectItem.document.documentType.id.Dynamic Form\"]").click();
  });
  it("adds attachment", () => {
    cy.get("[data-cy=\"AttachmentFieldPresenter-field\"] > input[type=file]").attachFile("image.jpg");
  });
  it("fills in revision stage", () => {
    cy.get("[data-cy=\"select.revisionStage\"]").click();
    cy.get("[data-cy=\"selectItem.revisionStage.common.Alpha\"]").click();
    // cy.get("[data-cy=\"Navigation.dashboard\"]").click();
    // cy.get("[data-cy=\"Navigation.document.list\"]").click();
    // cy.get("[data-cy=\"Navigation.change.list\"]").click();
    // cy.get("[data-cy=\"Navigation.user.management\"]").click();
    // cy.get("[data-cy=\"Navigation.group.management\"]").click();
    // cy.get("[data-cy=\"Navigation.document_type.Receivable\"]").click();
    // cy.get("[data-cy=\"Navigation.document_type.Purchase Order\"]").click();
    // cy.get("[data-cy=\"Navigation.document_type.Suppliers\"]").click();


    // cy.get("[data-cy=\"field.name\"]").type("Title");

    // cy.get("[data-cy=\"field.description\"]").type("Description");

    // cy.get("[data-cy=\"field-securityEmployees\"]", { timeout: 10000 }).click();
    // cy.get("[data-cy=\"field-securityEmployees\"] > div:contains('Zoran Second')").click();
    // cy.get("[data-cy=\"field-securityEmployees\"]", { timeout: 10000 }).click();
    // cy.get("[data-cy=\"field-securityEmployees\"] > div:contains('Zoran First')").click();
    // cy.get("[data-cy=\"field-securityEmployees\"]", { timeout: 10000 }).click();
    // cy.get("[data-cy=\"field-securityEmployees\"] > div:contains('Zoran Second')").click();

  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

