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
      recVerifyPOIsDisplayed(params: {loadedPoItems: PurchaseOrderItem[]}): Chainable<Subject>;
      recClearFilter(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("recClickCreateDocumentWithApiCall", () => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.PatchDocRev, () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
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
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").click();
  });
});

Cypress.Commands.add("recVerifyStartingFilter", () => {
  cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(4)>div")
    .each(($el) => {
      expect($el).to.have.text("DRAFT");
    });
});

Cypress.Commands.add("recClickOnFirstReceivableOnList", () => {
  cy.get("div[aria-rowindex=1]>div[aria-colindex=1]").click();
});

Cypress.Commands.add("recFilterByReceivableId", (params: {id: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevs, () => {
    cy.get("input[name=docId]").type(params.id).wait(300);
  });
});

Cypress.Commands.add("recClickUpdateRecord", (params: {id: string}) => {
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.DocPreview,
    CyRoutes.GetRequiredApproversDocRev,
    CyRoutes.GetAutocompleteOptions], () => {
    cy.get("[data-cy=\"updateRecord\"]").click();
  });
});

Cypress.Commands.add("recClickSaveBtn", () => {
  cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
});

Cypress.Commands.add("recVerifyFilterByReceivableId", (params: {recId: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(1)>div>a>div>div")
        .should("have.text", params.recId);
    });
});

Cypress.Commands.add("recFilterByOwner", (params: {owner: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevs, () => {
    cy.get("input[name=owner]").type(params.owner).wait(300);
  });
});

Cypress.Commands.add("recVerifyFilterByOwner", (params: {owner: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(3)>div>a>div>div")
        .should("have.text", params.owner);
    });
});

Cypress.Commands.add("recFilterByState", (params: {state: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevs, () => {
    cy.get("div[id=\"mui-component-select-displayStatus\"]").click().wait(300);
    cy.get("ul[role=listbox]>li").contains(params.state).click().wait(300);
  });
});

Cypress.Commands.add("recVerifyFilterByState", (params: {state: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(4)>div")
        .should("have.text", params.state);
    });
});

Cypress.Commands.add("recFilterByARId", (params: {arId: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevs, () => {
    cy.get("input[name=crId]").type(params.arId).wait(300);
  });
});

Cypress.Commands.add("recVerifyFilterByARId", (params: {arId: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(5)>div>a>div>div")
        .should("have.text", params.arId);
    });
});

Cypress.Commands.add("recVerifyFilterClear", () => {
  cy.get("input[name=docId]").should("have.attr", "value", "");
  cy.get("input[name=owner]").should("have.attr", "value", "");
  cy.get("input[name=crId]").should("have.attr", "value", "");
  cy.get("input[name=\"displayStatus\"").should("have.attr", "value", "");
});

Cypress.Commands.add("recCheckNumberOfAvailablePo", (params: {numberOfOpenPOs: integer}) => {
  cy.get("[data-cy*=receivable]").scrollIntoView().wait(2000);
  cy.get("[data-cy*=receivable]").click();
  cy.get("ul[role=listbox]>li").should("have.length", params.numberOfOpenPOs);
});

Cypress.Commands.add("recSelectPo", (params: {poTitle: string}) => {
  cy.get("[data-cy*=receivable]");
  cy.get("ul[role=listbox]>li").contains(params.poTitle).click();
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


