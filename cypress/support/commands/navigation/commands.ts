/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      navigListExistsCheck(list: string[]): Chainable<Subject>;
      navigListNotExistsCheck(list: string[]): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("navigListExistsCheck", (list: string[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"navigation." + item + "\"]").should("be.visible");
  });
});

Cypress.Commands.add("navigListNotExistsCheck", (list: string[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"navigation." + item + "\"]").should("not.be.visible");
  });
});

