/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      supEnterSuppName(params: {name: string}): Chainable<Subject>;
      supEnterSuppNameWithPatchWrapCall(params: {name: string}): Chainable<Subject>;
      supEnterSuppAddressPhone(params: {address: string}): Chainable<Subject>;
      supCreateNew(): Chainable<Subject>;
      selectSupplierDocument(): Chainable<Subject>;
      supClickOnSpecificSupplierFileFromList(params: {item: string}): Chainable<Subject>;
      supCheckForSuggestedForms(...list: string[]): Chainable<Subject>;
      supFilterByDocTitle(params: {docTitle: string }): Chainable<Subject>;
      supFilterById(params: {docId: string }): Chainable<Subject>;
      supFilterByState(params: {state: string }): Chainable<Subject>;
      supplierSelectSupplierFormFromMultiSelect(params: {supplierType: string; supplierForm?: string}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("supEnterSuppName", (params: {name: string}) => {
  cy.get("[data-cy=\"field-name\"]").arrowClick().arrowType(params.name);
});

Cypress.Commands.add("supEnterSuppNameWithPatchWrapCall", (params: {name: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
    cy.get("[data-cy=\"field-name\"]").arrowClick().arrowType(params.name);
    cy.unClick();
  });
});

Cypress.Commands.add("supEnterSuppAddressPhone", (params: {address: string}) => {
  cy.get("[data-cy=\"RichTextEditor.description\"]").arrowClick().arrowType(params.address);
});

Cypress.Commands.add("supCreateNew", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  cy.progressBarShouldNotExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("selectSupplierDocument", () => {
  cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true });
  cy.get("div[id^=react-select]").contains(new RegExp("^Supplier$", "g")).arrowClick();
});

Cypress.Commands.add("supClickOnSpecificSupplierFileFromList", (params: {item: string}) => {
  cy.get("tr.k-master-row").contains(params.item).arrowClick();
  cy.progressBarShouldAppear();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("supCheckForSuggestedForms", (...list: string[]) => {
  cy.get("[data-cy=field-selectForm]>div:nth-child(2)").arrowClick();
  list.forEach((item) => {
    cy.get("[id^=react-select]").contains(item).should("exist");
  });
});

Cypress.Commands.add("supFilterByDocTitle", (params: {docTitle: string }) => {
  cy.get(`[aria-colindex="2"] input`).clear().arrowType(params.docTitle).wait(500);
});

Cypress.Commands.add("supFilterById", (params: {docId: string }) => {
  cy.get(`[aria-colindex="1"] input`).clear().arrowType(params.docId).wait(500);
});

Cypress.Commands.add("supFilterByState", (params: {state: string}) => {
  cy.get(`[aria-colindex="5"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.state).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("supplierSelectSupplierFormFromMultiSelect", (params: {supplierType: string; supplierForm?: string}) => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocumentType], () => {
    cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
  });
  cy.wrapWithWaitOnApiCalls([
    CyRoutes.DocPreview], () => {
    cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();

    cy.get("div[id^=react-select]").contains(params.supplierType).arrowClick();
    if (params.supplierForm) {
      cy.get("[id=\"MultipleFormTemplate-selectDocType\"]").arrowClick();
      cy.get("div[id^=react-select]").contains(params.supplierForm).arrowClick();
    }
  });
});
