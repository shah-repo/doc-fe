// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import path from "path";
import { Screenshot } from "../../../utils/context/screenshot";

// const runId = new Date().valueOf();
// let createdCompany;

context(`Test: ${path.basename(__filename)}`, () => {
  // it("Creates company", (done: any) => {
  //   cy.apiLogin({
  //     email: "zoran.kovacevic+admin@codecons.com",
  //     password: "Tester1!",
  //   }).then((sessionId) => {
  //     cy.createCompany({
  //       payload: {
  //         companyAcronym: `T1${runId}`,
  //         companyAdminEmail: "zoran.kovacevic+admin@codecons.com",
  //         helloSignIntegrationEnabled: false,
  //         helloSignTestMode: false,
  //         importerEmail: `zoran.kovacevic+importer${runId}@codecons.com`,
  //         maxRevisionStages: 3,
  //         name: `Test Company ${runId}`,
  //         numOfDocDigits: 5,
  //         remoteValidatorBundleName: "default",
  //         slackIntegrationEnabled: false,
  //         users: [{
  //           name: "Zoran 1",
  //           email: `zoran.kovacevic+1_${runId}@codecons.com`,
  //         }, {
  //           name: "Zoran 2",
  //           email: `zoran.kovacevic+2_${runId}@codecons.com`,
  //         }, {
  //           name: "Zoran 3",
  //           email: `zoran.kovacevic+3_${runId}@codecons.com`,
  //         }, {
  //           name: "Zoran 4",
  //           email: `zoran.kovacevic+4_${runId}@codecons.com`,
  //         }],
  //         acctCodes: ["code 1"],
  //         addresses: ["Address 1"],
  //         whiteLabeling: null,
  //         documentTypes: [],
  //       }, sessionId: sessionId as unknown as string,
  //     }).then((response) => {
  //       createdCompany = response;
  //       done();
  //     });
  //   });
  // });

  it("Logs user in2", () => {
    cy.authLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
    Screenshot()
  });
  it("the one which fails", () => {
    Screenshot()
    expect(true).to.eql(false)
  });
  // it("Selects company", () => {
  //   cy.selectCompany({ name: createdCompany.name });
  // });

  // it("Opens document list", () => {
  //   cy.get("[data-cy=\"Navigation.document.list\"]", { timeout: 10 * 1000 }).click();
  // });
  // it("Opens create document page", () => {
  //   cy.get("[data-cy=\"document.revision.create\"]").click();
  // });
  // it("fills in description", () => {
  //   cy.get("[data-cy=\"RichTextEditor.description\"]", { timeout: 10000 }).type("Desription");
  // });
  // it("fills in document type", () => {
  //   cy.get("[data-cy=\"select.document.documentType.id\"]").click();
  //   cy.get("[data-cy=\"selectItem.document.documentType.id.Dynamic Form\"]").click();
  // });

  // it("fills in revision stage", () => {
  //   cy.get("[data-cy=\"select.revisionStage\"]").click();
  //   cy.get("[data-cy=\"selectItem.revisionStage.common.Alpha\"]").click();
  // });
  // it("adds attachment", () => {
  //   cy.get("[data-cy=\"AttachmentFieldPresenter-field\"] > input[type=file]").attachFile("image.jpg");
  //   cy.get("#AttachmentIconPresenter-fileTitle").then(($div) => {
  //     expect($div).to.have.text("image.jpg");
  //   });
  // });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

