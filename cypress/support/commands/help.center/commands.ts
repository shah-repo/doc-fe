/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      openHelpCenterNavigation(): Chainable<Subject>;
      openHelpCenterContent(): Chainable<Subject>;
      closeHelpCenterNavigation(): Chainable<Subject>;
      closeHelpCenterContent(): Chainable<Subject>;
      checkIfHelpCenterClosed(): Chainable<Subject>;
      verifyHelpCenterTitle(title: string, compare?: string): Chainable<Subject>;
    }
  }
}
Cypress.Commands.add("openHelpCenterNavigation", () => {
  cy.get("[data-cy='help-center.opener']").arrowClick({ force: true });
  cy.get("[data-cy='help-center.navigation'", { timeout: 500 }).should("be.visible");
});
Cypress.Commands.add("openHelpCenterContent", () => {
  cy.get("[data-cy='help-center.content-opener']").arrowClick({ force: true });
  cy.get("[data-cy='help-center.content'", { timeout: 500 }).should("be.visible");
});
Cypress.Commands.add("closeHelpCenterNavigation", () => {
  cy.unClick({ force: false });
  cy.get("[data-cy='help-center.navigation'", { timeout: 500 }).should("not.exist");
});
Cypress.Commands.add("closeHelpCenterContent", () => {
  cy.get("[data-cy='help-center.content-closer']").arrowClick({ force: true });
  cy.get("[data-cy='help-center.content'", { timeout: 500 }).should("not.exist");
});
Cypress.Commands.add("checkIfHelpCenterClosed", () => {
  cy.get("[data-cy='help-center.content'", { timeout: 500 }).should("not.exist");
  cy.get("[data-cy='help-center.navigation'", { timeout: 500 }).should("not.exist");
});
Cypress.Commands.add("verifyHelpCenterTitle", (title, compare = "have.text") => {
  cy.get("[data-cy='help-center.content'", { timeout: 500 }).should("be.visible");
  cy.get("[data-cy='help-center.content-title']").should(compare, title);
});
