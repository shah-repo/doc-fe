/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */

import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      trVerifyElementByColumnName(params: { name: string; el: string }): Chainable<Subject>;
      trFilterDocListByNameAndSelect(params: { title: string }): Chainable<Subject>;
      trApproveAR(): Chainable<Subject>;
      trClearFilters(): Chainable<Subject>;
      trClearFiltersNoWait(): Chainable<Subject>;
      trRejectAR(): Chainable<Subject>;
      trCompleteTraining(): Chainable<Subject>;
      trApproveTraining(): Chainable<Subject>;
      trSelectFirstDocument(): Chainable<Subject>;
      trLandingPageUsername(params: { username: string }): Chainable<Subject>;
      trLandingPageDocRevTitle(params: { title: string }): Chainable<Subject>;
      trLandingPageDocId(params: { docId: string }): Chainable<Subject>;
      trLandingPageCompletedOn(params: { completed: string }): Chainable<Subject>;
      trLandingPageClearFilter(): Chainable<Subject>;
      trLandingPageOwner(params: { owner: string }): Chainable<Subject>;
      trLandingPageName(params: { name: string }): Chainable<Subject>;
      trLandingPagetrId(params: { trId: string }): Chainable<Subject>;
      trLandingPageDynamicParams(params: { dynamicParams: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("trVerifyElementByColumnName", (params: { name: string; el: string }) => {
  cy.get(`#${params.el}`).parent().parent().parent().parent().should("contain.text", params.name);
});

Cypress.Commands.add("trSelectFirstDocument", () => {
  cy.get("div[aria-rowindex=1]>div.ReactVirtualized__Table__rowColumn:nth-child(3)>div>div>div").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trFilterDocListByNameAndSelect", (params: { title: string }) => {
  cy.trClearFiltersNoWait();
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.GetTrainingRecord, () => {
    cy.get("#docRevTitle").arrowType(params.title);
    cy.listLoadingElementShouldAppear();
  });
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).arrowClick();
});

Cypress.Commands.add("trClearFilters", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetTrainingRecord, () => {
    cy.get("button[data-cy=clearFilter]").arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trClearFiltersNoWait", () => {
  cy.get("button[data-cy=clearFilter]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trApproveAR", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostApproveAR, CyRoutes.ARPreview], () => {
      cy.get("button[aria-label=approve]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("trRejectAR", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostRejectCR], () => {
      cy.get("button[aria-label=reject]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("trCompleteTraining", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostCompleteTraining], () => {
      cy.get("[data-cy=training-complete]").click();
      cy.get("[data-cy=\"training.acknowladge.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldAppear();
    });
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("trApproveTraining", () => {
  cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").click();
  cy.get("input[name=\"password\"]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
    cy.get("[data-cy=\"common.confirm\"]").click();
    cy.progressBarShouldAppear();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageUsername", (params: {username}) => {
  cy.get("#userName").clear().arrowType(params.username).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageDocRevTitle", (params: {title}) => {
  cy.get("#docRevTitle").clear().arrowType(params.title).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageDocId", (params: {docId}) => {
  cy.get("#docId").clear().arrowType(params.docId).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageCompletedOn", (params: {completed}) => {
  cy.get("#mui-component-select-completedAtAfter").arrowClick();
  cy.get("ul[role=listbox] > li").contains(params.completed).arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageOwner", (params: {owner}) => {
  cy.get("#owner").clear().arrowType(params.owner).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageClearFilter", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetTrainingRecord, () => {
    cy.get("[data-cy=\"clearFilter\"]").arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageName", (params: {name}) => {
  cy.get("#name").clear().arrowType(params.name).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPagetrId", (params: {trId}) => {
  cy.get("#trId").clear().arrowType(params.trId).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageDynamicParams", (params: {dynamicParams}) => {
  cy.get("[name^=dynamicParams]").clear().arrowType(params.dynamicParams).wait(500);
  cy.listLoadingElementShouldNotExist();
});
