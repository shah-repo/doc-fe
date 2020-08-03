/* eslint-disable max-classes-per-file */

import { NavigationItems } from "../../../../src/state/ducks/auth/types";

/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      navigListExistsCheck(...list: NavigationItems[]): Chainable<Subject>;
      navigListNotExistsCheck(...list: NavigationItems[]): Chainable<Subject>;
      navigClickOnExpandButtons(params: { navigItem: NavigationItems }): Chainable<Subject>;
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
  cy.wait(100).get("[data-cy=\"navigation." + params.navigItem + "\"]").wait(100).click();
});

Cypress.Commands.add("navigToDashboard", () => {
  cy.navigClickOnExpandButtons({ navigItem: NavigationItems.DASHBOARD });
});

Cypress.Commands.add("navigToDocumentList", () => {
  cy.navigClickOnExpandButtons({ navigItem: NavigationItems.DOCUMENT_CONTROL });
  cy.navigClickOnExpandButtons({ navigItem: NavigationItems.DOCUMENT_LIST });
});

Cypress.Commands.add("navigToApprovalRequestList", () => {
  cy.navigClickOnExpandButtons({ navigItem: NavigationItems.DOCUMENT_CONTROL });
  cy.navigClickOnExpandButtons({ navigItem: NavigationItems.APPROVAL_REQUEST });
});

Cypress.Commands.add("navigToPurchaseOrder", () => {
  cy.get("[data-cy=\"navigation.purchaseOrder\"]").click();
});
