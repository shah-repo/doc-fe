/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      recCreateRecordFromLandingPage(): Chainable<Subject>;
      recCheckIfMultilpeFormsAreAvailable(params: {recordType: string; recordForms: string[]}): Chainable<Subject>;
      recSelectRecordFormFromMultiSelect( params: {recordType: string; recordForm?: string} ): Chainable<Subject>;
      recCheckRevisionStage(params: {stage: string}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("recCreateRecordFromLandingPage", () => {
  cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]").click();
});

Cypress.Commands.add("recCheckIfMultilpeFormsAreAvailable", (params: {recordType: string; recordForms: string[]}) => {
  cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
  cy.wait(500);
  cy.get("div[id^=react-select]").contains(params.recordType).click();
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").click();
  params.recordForms.forEach((item) => {
    cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").contains(item);
  });
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").click();
  cy.get("[data-cy=\"suggestFormCancelBtn\"]").click();
});

Cypress.Commands.add("recSelectRecordFormFromMultiSelect", (params: {recordType: string; recordForm: string}) => {
  cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").click();
  cy.wait(500);
  cy.get("div[id^=react-select]").contains(params.recordType).click();
  if (params.recordForm) {
    cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").type(params.recordForm + "{downarrow}{enter}");
  }
});

Cypress.Commands.add("recCheckRevisionStage", (params: {stage: string}) => {
  cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains(params.stage);
});

