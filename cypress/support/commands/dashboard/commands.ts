/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      dashVerifyListItemExistsOnDashboard(params: {listItem: string}): Chainable<Subject>;
      dashGoToListItemFromDashboard(params: {listItem: string}): Chainable<Subject>;
      dashVerifyNoPendingActions(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("dashVerifyListItemExistsOnDashboard", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div").should("contain.text", params.listItem);
});

Cypress.Commands.add("dashGoToListItemFromDashboard", (params: { listItem: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.SessionDetails, () => {
    cy.get("[data-cy=dashboardFeedList]>div").contains(params.listItem).find("a").first().arrowClick();
    cy.progressBarShouldAppear();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("dashVerifyNoPendingActions", () => {
  cy.get("[data-cy='dashboard.noPendingActions']").should("exist");
});

export { };
