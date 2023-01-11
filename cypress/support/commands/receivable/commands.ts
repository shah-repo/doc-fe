/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { integer } from "aws-sdk/clients/cloudfront";
import { DocumentRevisionEditRequestBody } from "../../../../src/state/ducks/documentRevisions/types";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";
import { PurchaseOrderItem } from "../purchase.order/commands";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      recAPICreateReceivable(params: {payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string }): Chainable<Subject>;
      recVerifyStartingFilter(): Chainable<Subject>;
      recClickOnFirstReceivableOnList(): Chainable<Subject>;
      recFilterByReceivableId(params: {id: string}): Chainable<Subject>;
      recClickUpdateRecord(): Chainable<Subject>;
      recClickSaveBtn(): Chainable<Subject>;
      recCreateNew(): Chainable<Subject>;
      recCreateNewWithoutApi(): Chainable<Subject>;
      recVerifyFilterByReceivableId(params: {recId: string}): Chainable<Subject>;
      recFilterByOwner(params: {owner: string}): Chainable<Subject>;
      recVerifyFilterByOwner(params: {owner: string}): Chainable<Subject>;
      recFilterByState(params: {state: string}): Chainable<Subject>;
      recVerifyFilterByState(params: {state: string}): Chainable<Subject>;
      recFilterByARId(params: {arId: string}): Chainable<Subject>;
      recVerifyFilterByARId(params: {arId: string}): Chainable<Subject>;
      recVerifyFilterClear(): Chainable<Subject>;
      recClickCreateDocumentWithApiCall(): Chainable<Subject>;
      recCheckNumberOfAvailablePo(params: {numberOfOpenPOs: integer}): Chainable<Subject>;
      recSelectPo(params: {poTitle: string}): Chainable<Subject>;
      recSelectReceivable(params: {title: string}): Chainable<Subject>;
      recVerifyPOIsDisplayed(params: {loadedPoItems: PurchaseOrderItem[]}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("recClickCreateDocumentWithApiCall", () => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.PatchDocRev, () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
});

Cypress.Commands.add("recAPICreateReceivable", (params: {
  payload: DocumentRevisionEditRequestBody;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("recCreateNew", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("recCreateNewWithoutApi", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick({ force: true });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("recVerifyStartingFilter", () => {
  cy.get("td[role=gridcell]:nth-child(4)")
    .each(($el) => {
      expect($el).to.have.text("DRAFT");
    });
});

Cypress.Commands.add("recClickOnFirstReceivableOnList", () => {
  cy.get("tr.k-master-row").first().arrowClick();
  cy.progressBarShouldAppear();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("recFilterByReceivableId", (params: {id: string}) => {
  cy.get(`[aria-colindex="1"] input`).arrowType(params.id);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("recClickUpdateRecord", (params: {id: string}) => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.DocPreview, () => {
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
    });
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("recClickSaveBtn", () => {
  cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
});

Cypress.Commands.add("recVerifyFilterByReceivableId", (params: {recId: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", params.recId);
});

Cypress.Commands.add("recFilterByOwner", (params: {owner: string}) => {
  cy.get(`[aria-colindex="3"] input`).arrowType(params.owner).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("recVerifyFilterByOwner", (params: {owner: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(2).find("span").eq(0).should("have.text", params.owner);
});

Cypress.Commands.add("recFilterByState", (params: {state: string}) => {
  cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.state).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("recVerifyFilterByState", (params: {state: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", params.state);
});

Cypress.Commands.add("recFilterByARId", (params: {arId: string}) => {
  cy.get(`[aria-colindex="5"] input`).arrowType(params.arId).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("recVerifyFilterByARId", (params: {arId: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", params.arId);
});

Cypress.Commands.add("recVerifyFilterClear", () => {
  cy.get(`[aria-colindex="1"] input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="3"] input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="5"] input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="4"] [class="k-input"]`).should("have.text", "All");
});

Cypress.Commands.add("recCheckNumberOfAvailablePo", (params: {numberOfOpenPOs: integer}) => {
  cy.get("[data-cy*=receivable]").scrollIntoView().wait(2000);
  cy.get("[data-cy*=receivable]").arrowClick();
  cy.get("ul>li[role=option]").should("have.length", params.numberOfOpenPOs);
});

Cypress.Commands.add("recSelectPo", (params: {poTitle: string}) => {
  cy.get(`input[data-cy^="porec-receivable"]`).scrollIntoView().wait(2000);
  cy.get(`input[data-cy^="porec-receivable"]`).arrowClick();
  cy.get("ul>li[role=option]").contains(params.poTitle).arrowClick();
});

Cypress.Commands.add("recSelectReceivable", (params: {title: string}) => {
  cy.get("[name^=porec-receivable-] svg").eq(1).arrowClick();
  cy.get("ul>li[role=option]").contains(params.title).arrowClick();
});

Cypress.Commands.add("recVerifyPOIsDisplayed", (params: {loadedPoItems: PurchaseOrderItem[]}) => {
  params.loadedPoItems.forEach((loadedItem) => {
    cy.get("[data-cy=poItems]")
      .contains("[data-cy=poItemIndex]", loadedItem.index.toString())
      .siblings("[data-cy=order]")
      .should("have.text", loadedItem.ordered.toString());
    cy.get("[data-cy=poItems]")
      .contains("[data-cy=poItemIndex]", loadedItem.index.toString())
      .siblings("[data-cy=units]")
      .should("have.text", loadedItem.units);
    cy.get("[data-cy=poItems]")
      .contains("[data-cy=poItemIndex]", loadedItem.index.toString())
      .siblings("[data-cy=unitPrice]")
      .should("have.text", loadedItem.unitPrice);
  });
});


