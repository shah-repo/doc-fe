/* eslint-disable max-classes-per-file */


/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      imapGetEmails(params: {email: string}): Chainable;
    }
  }
}

Cypress.Commands.add("imapGetEmails", (params: {email: string}) => cy.task("mail", params.email));
