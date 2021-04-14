/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */

import { CyRoutes } from "../../routes";

/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      filterPO(params: {docId: string; version: string; poStatus: string;
        supplier: string; partNumber: string; amount: string; owner: string; issueDate: string; }): Chainable<Subject>;
      filterCheckHeaderValues(...list: string[]): Chainable<Subject>;
      filterPOVersion(params: { version: string }): Chainable<Subject>;
      filterClear(): Chainable<Subject>;
      filterCheckIfPOFilterPersists(params: {docId: string; version: string; poStatus: string;
        supplier: string; partNumber: string; amount: string; owner: string; issueDate: string; }): Chainable<Subject>;
      filterCheckNumberOfDisplayedRecords(params: { numberOfRecords: string }): Chainable<Subject>;
      filterGetFirstValueFromList(params: { value: string }): Chainable<Subject>;
      filterSupplierTitle(params: {name: string}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("filterPO", (params: {docId: string; version: string; poStatus: string;
  supplier: string; partNumber: string; amount: string; owner: string; issueDate: string; }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"docId\"]").type(params.docId);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.version\"]").type(params.version);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.po_status\"]").type(params.poStatus);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.supplier\"]").type(params.supplier);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.po_partNumber\"]").type(params.partNumber);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.po_amount\"]").type(params.amount);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"owner\"]").type(params.owner);
  });
  cy.get("[id=\"dynamicParams.precalc.issueDate\"]").type(params.issueDate);
});

Cypress.Commands.add("filterCheckIfPOFilterPersists", (params: {docId: string; version: string; poStatus: string;
  supplier: string; partNumber: string; amount: string; owner: string; issueDate: string; }) => {
  cy.get("[id=\"docId\"]").should("have.value", params.docId);
  cy.get("[id=\"dynamicParams.precalc.version\"]").should("have.value", params.version);
  cy.get("[id=\"dynamicParams.precalc.po_status\"]").should("have.value", params.poStatus);
  cy.get("[id=\"dynamicParams.precalc.supplier\"]").should("have.value", params.supplier);
  cy.get("[id=\"dynamicParams.precalc.po_partNumber\"]").should("have.value", params.partNumber);
  cy.get("[id=\"dynamicParams.precalc.po_amount\"]").should("have.value", params.amount);
  cy.get("[id=\"owner\"]").should("have.value", params.owner);
  cy.get("[id=\"dynamicParams.precalc.issueDate\"]").should("have.value", params.issueDate);
});

Cypress.Commands.add("filterPOVersion", (params: { version: string }) => {
  cy.get("[id=\"dynamicParams.precalc.version\"]").type(params.version);
});

Cypress.Commands.add("filterClear", () => {
  cy.get("[id=\"clearFilter\"]").click();
});

Cypress.Commands.add("filterCheckNumberOfDisplayedRecords", (params: { numberOfRecords: string }) => {
  cy.get("[data-testid=\"numberOfRecords\"]").contains(params.numberOfRecords).should("exist");
});

Cypress.Commands.add("filterCheckHeaderValues", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[class*=\"ReactVirtualized__Table__headerRow\"]").contains(item).should("exist");
  });
});

Cypress.Commands.add("filterGetFirstValueFromList", (params: { value: string }) => {
  cy.get("[class*=\"ReactVirtualized__Table__row\"]").first().contains(params.value).should("exist");
});

Cypress.Commands.add("filterSupplierTitle", (params: {name: string}) => {
  cy.get("[id=\"name\"]").click().type(params.name);
});
