/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      imapGetEmails(): Chainable;
    }
  }
}

Cypress.Commands.add("imapGetEmails", () => cy.task("mail"));
