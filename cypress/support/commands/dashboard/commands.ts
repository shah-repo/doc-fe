/* eslint-disable @typescript-eslint/no-namespace */

import { CONFIG } from "../../config";
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
      dashApproverFirstFromList(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("dashVerifyListItemExistsOnDashboard", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div").contains(params.listItem).should("exist");
});

Cypress.Commands.add("dashVerifyListItemNotExistsOnDashboard", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div")
    .should("not.exist");
});

Cypress.Commands.add("dashGoToListItemFromDashboard", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div").contains(params.listItem).find("a").first().arrowClick();
  cy.progressBarShouldAppear();
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

Cypress.Commands.add("dashApproverFirstFromList", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostApprovalsApprove], () => {
      cy.contains("needs your approval for").eq(0).trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

export { };
