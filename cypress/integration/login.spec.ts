// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

const runId = new Date().valueOf();
let createdCompany;

context("Login", () => {
  it("Creates company", () => {
    cy.apiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((sessionId) => {
      cy.createCompany({
        payload: {
          companyAcronym: `T1${runId}`,
          companyAdminEmail: "zoran.kovacevic+ca@codecons.com",
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: `zoran.kovacevic+importer${runId}@codecons.com`,
          maxRevisionStages: 3,
          name: `Test Company ${runId}`,
          numOfDocDigits: 5,
          remoteValidatorBundleName: "default",
          slackIntegrationEnabled: false,
          users: [],
          acctCodes: ["code 1"],
          addresses: ["Address 1"],
          whiteLabeling: null,
          documentTypes: [],
        }, sessionId: sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response as any;
      });
    });
  });

  it("Logs user in", () => {
    cy.login({
      email: "zoran.kovacevic+ca@codecons.com",
      password: "Tester1!",
    });
    console.log({ createdCompany });
    cy.selectCompany({ name: createdCompany.name });
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

