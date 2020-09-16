/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      recCreateRecordFromLandingPage(): Chainable<Subject>;
      recCheckIfMultilpeFormsAreAvailable(...list: string[]): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("recCreateRecordFromLandingPage", () => {
  cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]").click();
});

Cypress.Commands.add("recCheckIfMultilpeFormsAreAvailable", (...list: string[]) => {
  cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").click();
  list.forEach((item) => {
    cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").contains(item);
  });
});
