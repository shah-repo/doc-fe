/* eslint-disable @typescript-eslint/no-namespace */

import { integer } from "aws-sdk/clients/cloudfront";
import { each } from "lodash";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      dashboardToDoTab(): Chainable<Subject>;
      dashboardMyFeedTab(): Chainable<Subject>;
      dashboardRecentTab(): Chainable<Subject>;
      dashVerifyListItemExistsOnDashboard(params: {listItem: string}): Chainable<Subject>;
      dashVerifyListItemNotExistsOnDashboard(params: {listItem: string}): Chainable<Subject>;
      dashGoToListItemFromDashboard(params: {listItem: string}): Chainable<Subject>;
      dashToggleMoreDetailsForListItemNumber(params: {listItemNumb: number}): Chainable<Subject>;
      dashRejectApprovalForListItem(params: {listItem: string}): Chainable<Subject>;
      dashVerifyNoPendingActions(): Chainable<Subject>;
      dashApproverFirstFromList(): Chainable<Subject>;
      dashApproverFirstFromListWithoutApi(): Chainable<Subject>;
      checkStylePropExists(params: {content: string; props: any; elem?: string; index?: integer}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("dashboardToDoTab", () => {
  cy.get(`#scrollable-auto-tab-todo`).arrowClick();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("dashboardMyFeedTab", () => {
  cy.get(`#scrollable-auto-tab-my-feed`).arrowClick();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("dashboardRecentTab", () => {
  cy.get("#scrollable-auto-tab-recent").arrowClick();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("dashVerifyListItemExistsOnDashboard", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div").contains(params.listItem).should("exist");
});

Cypress.Commands.add("dashVerifyListItemNotExistsOnDashboard", (params: { listItem: string}) => {
  cy.get("[data-cy=dashboardFeedList]>div")
    .contains(params.listItem)
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

Cypress.Commands.add("dashApproverFirstFromListWithoutApi", () => {
  cy.contains("needs your approval for").eq(0).trigger("mouseover");
  cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
  cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
  cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

// eslint-disable-next-line max-len
Cypress.Commands.add("checkStylePropExists", (params: {content: string; props: any; elem?: string; index?: integer}) => {
  each( params.props, ( value, name ) => {
    if (params.elem && params.index) {
      cy.get(params.elem).eq(params.index).contains(params.content).should("have.css", name, value);
    } else if (params.elem && !params.index) {
      cy.get(params.elem).contains(params.content).should("have.css", name, value);
    }
    else {
      cy.contains(params.content).should("have.css", name, value);
    }
  });
});

export { };
