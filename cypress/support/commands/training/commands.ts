/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */

import { SQS_TYPES } from "../../../../src/ui/async.tasks/types";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      trVerifyElementByColumnName(params: { name: string }): Chainable<Subject>;
      trFilterDocListByNameAndSelect(params: { title: string }): Chainable<Subject>;
      trApproveAR(): Chainable<Subject>;
      trClearFilters(): Chainable<Subject>;
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
      trSetTimeTravelInDays(params: { days: number }): Chainable<Subject>;
      setTimeTravelToComplete(params: { tasktype: string; days: string; status: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("trVerifyElementByColumnName", (params: { name: string}) => {
  cy.get(`[aria-rowindex="1"]>th>span>span`).should("contain.text", params.name);
});

Cypress.Commands.add("trSelectFirstDocument", () => {
  cy.get(`[data-grid-row-index="0"]`).arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trFilterDocListByNameAndSelect", (params: { title: string }) => {
  cy.trClearFilters();
  cy.listLoadingElementShouldNotExist();
  cy.trLandingPageDocRevTitle({ title: params.title });
  cy.get(`[data-grid-row-index]`).contains(params.title).arrowClick();
});

Cypress.Commands.add("trClearFilters", () => {
  cy.get("button[data-cy=clearFilter]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trApproveAR", () => {
  cy.wrapWithWaitOnApiCalls(
    [CyRoutes.PostApproveAR, CyRoutes.ARPreview], () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-approve"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-approve"]`).first().arrowClick();
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
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover").wait(500);
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
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
      cy.get("button[data-cy=training-complete]").click();
      cy.get("[data-cy=\"training.acknowladge.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
    });
  cy.listLoadingElementShouldNotExist();
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("trApproveTraining", () => {
  cy.get("[data-cy=\"form.builder.request.approve\"]").click();
  cy.get("input[name=\"password\"]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
    cy.get("[data-cy=\"common.confirm\"]").click();
    cy.progressBarShouldNotExist();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageUsername", (params: {username}) => {
  cy.get("[class=\"k-textbox\"]").eq(4).clear().arrowType(params.username).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageDocRevTitle", (params: {title}) => {
  cy.get("[class=\"k-textbox\"]").eq(3).clear().arrowType(params.title).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageDocId", (params: {docId}) => {
  cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType(params.docId).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageCompletedOn", (params: {completed: string }) => {
  cy.get(`[aria-colindex="8"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.completed).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageOwner", (params: {owner}) => {
  cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType(params.owner).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageClearFilter", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetTrainingRecord, () => {
    cy.get("[data-cy=\"clearFilter\"]").arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageName", (params: {name}) => {
  cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType(params.name).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPagetrId", (params: {trId}) => {
  cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType(params.trId).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trLandingPageDynamicParams", (params: {dynamicParams}) => {
  cy.get("[class=\"k-textbox\"]").eq(3).clear().arrowType(params.dynamicParams).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("trSetTimeTravelInDays", (params: {days: number}) => {
  cy.navigToAsyncTasks();
  cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
  cy.asyncSelectBackToTheFutureTime({ day: params.days });
  cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_REFRESH });
  cy.asyncTaskSelectNextTaskType({ taskType: SQS_TYPES.TRAINING_RECORDS_STATUS });
  cy.asyncTaskClickSubmit();
  cy.progressBarShouldNotExist();
  cy.wait(1000);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add(
  "setTimeTravelToComplete",
  (params: { tasktype: string; days: string; status: string }) => {
    cy.reload();
    cy.progressBarShouldNotExist();
    cy.listLoadingElementShouldNotExist();
    cy.get(`tr[data-grid-row-index="0"]`)
      .find("td")
      .should("contain.text", params.tasktype)
      .and("contain.text", params.days)
      .and("contain.text", params.status);
  }
);
