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
      trApproveAR(): Chainable<Subject>;
      trRejectAR(): Chainable<Subject>;
      trCompleteTraining(): Chainable<Subject>;
      trApproveTraining(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("trVerifyElementByColumnName", (params: { name: string; el: string }) => {
  cy.get(`#${params.el}`).parent().parent().parent().parent().should("contain.text", params.name);
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
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("trApproveTraining", () => {
  cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").click();
  cy.get("input[name=\"password\"]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
    cy.get("[data-cy=\"common.confirm\"]").click();
  });
});
