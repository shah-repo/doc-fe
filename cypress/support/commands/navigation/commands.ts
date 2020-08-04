/* eslint-disable max-classes-per-file */

import { NavigationItems } from "../../../../src/state/ducks/auth/types";

/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      navigListExistsCheck(...list: NavigationItems[]): Chainable<Subject>;
      navigListNotExistsCheck(...list: NavigationItems[]): Chainable<Subject>;
      navigClickOnItem(params: { navigItem: NavigationItems }): Chainable<Subject>;
      navigToDashboard(): Chainable<Subject>;
      navigToDocumentList(): Chainable<Subject>;
      navigToApprovalRequestList(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("navigListExistsCheck", (...list: NavigationItems[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"navigation." + item + "\"]").should("be.visible");
  });
});

Cypress.Commands.add("navigListNotExistsCheck", (...list: NavigationItems[]) => {
  list.forEach((item) => {
    cy.get("[data-cy=\"navigation." + item + "\"]").should("not.be.visible");
  });
});

Cypress.Commands.add("navigClickOnItem", (params: { navigItem: string }) => {
  cy.wait(200).get("[data-cy=\"navigation." + params.navigItem + "\"]").click({ force: true });
});

Cypress.Commands.add("navigToDashboard", () => {
  cy.navigClickOnItem({ navigItem: NavigationItems.DASHBOARD });
});

Cypress.Commands.add("navigToDocumentList", () => {
  cy.navigClickOnItem({ navigItem: NavigationItems.DASHBOARD });
  cy.navigClickOnItem({ navigItem: NavigationItems.DOCUMENT_CONTROL });
  cy.navigClickOnItem({ navigItem: NavigationItems.DOCUMENT_LIST });
});

Cypress.Commands.add("navigToApprovalRequestList", () => {
  cy.navigClickOnItem({ navigItem: NavigationItems.DASHBOARD });
  cy.navigClickOnItem({ navigItem: NavigationItems.DOCUMENT_CONTROL });
  cy.navigClickOnItem({ navigItem: NavigationItems.APPROVAL_REQUEST });
});

