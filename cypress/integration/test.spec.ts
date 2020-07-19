// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

import path from "path";

const runId = new Date().valueOf();
let createdCompany;

context(`Test: ${path.basename(__filename)}`, () => {
  /* it("Creates company", (done: any) => {
    cy.apiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((response: any) => {
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
        createdCompany = response;
        done();
      });
    });
  }); */

  it("Logs user in", () => {
    cy.login({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
  });

  it("Selects company", () => {
    // cy.selectCompany({ name: createdCompany.name });
    cy.selectCompany({ name: 'Test Company 1594952860030' });
  });

  it("Opens document list", () => {
    cy.get("[data-cy=\"document.list\"]", { timeout: 10 * 1000 }).click();
  });

  it("Check error is shown for no records", () => {

    cy.get('.ReactVirtualized__Grid', { timeout: 1000 }).then($container => {
      if (!$container.html().includes('ReactVirtualized__Grid__innerScrollContainer')) {
        cy.get("[data-cy=\"no.results.found\"]").contains('No results found');
      }
    })
  });

  it("Opens create document page", () => {
    cy.get("[data-cy=\"document.revision.create\"]").click();
  });

  it("Opens approval request list", () => {
    cy.get("[data-cy=\"approval.request.list\"]", { timeout: 1000 }).click();
  });

  it("Open create approval request dialogue", () => {
    cy.get("[data-cy=\"change.request.create\"]").click();
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

