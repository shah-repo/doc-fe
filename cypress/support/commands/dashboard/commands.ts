/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      dashVerifyListItemExistsOnDashboard(params: {listItem: string}): Chainable<Subject>;
      dashVerifyListItemNotExistsOnDashboard(params: {listItem: string}): Chainable<Subject>;
      dashGoToListItemFromDashboard(params: {listItem: string}): Chainable<Subject>;
      dashToggleMoreDetailsForListItemNumber(params: {listItemNumb: number}): Chainable<Subject>;
      dashRejectApprovalForListItem(params: {listItem: string}): Chainable<Subject>;
      dashVerifyNoPendingActions(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("dashVerifyListItemExistsOnDashboard", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div").contains(params.listItem).should("exist");
});

Cypress.Commands.add("dashVerifyListItemNotExistsOnDashboard", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div")
    .contains(params.listItem)
    .should("not.exist");
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

Cypress.Commands.add("dashToggleMoreDetailsForListItemNumber", (params: { listItemNumb: number}) => {
  cy.get("[data-cy=dashboardFeedList]>div>svg").eq(params.listItemNumb).arrowClick();
});

Cypress.Commands.add("dashRejectApprovalForListItem", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div").contains(params.listItem)
    .parent()
    .parent()
    .parent().trigger("mouseover")
    .find(`[data-cy="transition-reject"]`).first()
    .arrowClick();

  cy.wrapWithWaitOnApiCalls([CyRoutes.PostDashboardFeedSearch], () => {
    cy.get("div[role=dialog] button").eq(1).arrowClick();
  });

  cy.progressBarShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

export { };
