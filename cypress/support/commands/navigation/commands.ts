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
      navigToNestedItem(params: {navigItems: NavigationItems[]}): Chainable<Subject>;
      navigToDashboard(): Chainable<Subject>;
      navigToDocumentList(): Chainable<Subject>;
      navigToApprovalRequestList(): Chainable<Subject>;
      navigToPurchaseOrder(): Chainable<Subject>;
      navigToSuppliers(): Chainable<Subject>;
      navigToReceivableList(): Chainable<Subject>;
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

Cypress.Commands.add("navigToReceivableList", () => {
  cy.navigClickOnItem({ navigItem: NavigationItems.RECEIVING });
});

Cypress.Commands.add("navigToDocumentList", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.DOCUMENT_CONTROL,
      NavigationItems.DOCUMENT_LIST,
    ],
  });
});

Cypress.Commands.add("navigToApprovalRequestList", () => {
  cy.navigToNestedItem({
    navigItems: [
      NavigationItems.DASHBOARD,
      NavigationItems.DOCUMENT_CONTROL,
      NavigationItems.APPROVAL_REQUEST,
    ],
  });
});

Cypress.Commands.add("navigToPurchaseOrder", () => {
  cy.get("[data-cy=\"navigation.purchaseOrder\"]").click({ force: true });
});

Cypress.Commands.add("navigToSuppliers", () => {
  cy.navigClickOnItem({ navigItem: NavigationItems.SUPPLIERS });
});


Cypress.Commands.add("navigToNestedItem", (params: {navigItems: NavigationItems[]}) => {
  if (params.navigItems.length === 1) {
    cy.navigClickOnItem({ navigItem: params.navigItems[0] });
  } else {
    const [first, second, ...other] = params.navigItems;
    cy.get("body").then(($body) => {
      if ($body.find("[data-cy=\"navigation." + second + "\"]").length === 0) {

        cy.navigClickOnItem({ navigItem: first });
        cy.navigToNestedItem({ navigItems: [second, ...other] });
      } else {
        cy.navigToNestedItem({ navigItems: [second, ...other] });
      }
    });
  }
});
