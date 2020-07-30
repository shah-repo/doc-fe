/* eslint-disable max-classes-per-file */

import { NavigationItems } from "../../../../src/state/ducks/auth/types";

/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      navigListExistsCheck(...list: NavigationItems[]): Chainable<Subject>;
      navigListNotExistsCheck(...list: NavigationItems[]): Chainable<Subject>;
      navigClickOnExpandButtons(params: { navigItem: string }): Chainable<Subject>;
      navigToDashboard(): Chainable<Subject>;
      navigToDocumentList(): Chainable<Subject>;
      navigToApprovalRequestList(): Chainable<Subject>;
      navigToPurchaseOrder(): Chainable<Subject>;
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

Cypress.Commands.add("navigClickOnExpandButtons", (params: { navigItem: string }) => {
  cy.get("[data-cy=\"navigation." + params.navigItem + "\"] > svg").click();
});

Cypress.Commands.add("navigToDashboard", (params: { navigItem: string }) => {
  cy.get("[data-cy=\"navigation.dashboard\"]").click();
});

Cypress.Commands.add("navigToDocumentList", () => {
  cy.navigToDashboard();
  cy.wait(200).navigClickOnExpandButtons({ navigItem: NavigationItems.DOCUMENT_CONTROL });
  cy.get("[data-cy=\"navigation.documentList\"]").click();
});

Cypress.Commands.add("navigToApprovalRequestList", () => {
  cy.navigToDashboard();
  cy.wait(200).navigClickOnExpandButtons({ navigItem: NavigationItems.DOCUMENT_CONTROL });
  cy.get("[data-cy=\"navigation.approvalRequests\"]").click();
});

Cypress.Commands.add("navigToPurchaseOrder", () => {
  cy.get("[data-cy=\"navigation.purchaseOrder\"]").click();
});
