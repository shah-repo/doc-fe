/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
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
    }
  }
}

Cypress.Commands.add("filterPO", (params: {docId: string; version: string; poStatus: string;
  supplier: string; partNumber: string; amount: string; owner: string; issueDate: string; }) => {
  cy.get("[id=\"docId\"]").type(params.docId);
  cy.get("[id=\"dynamicParams.precalc.version\"]").type(params.version);
  cy.get("[id=\"dynamicParams.precalc.po_status\"]").type(params.poStatus);
  cy.get("[id=\"dynamicParams.precalc.supplier\"]").type(params.supplier);
  cy.get("[id=\"dynamicParams.precalc.po_partNumber\"]").type(params.partNumber);
  cy.get("[id=\"dynamicParams.precalc.po_amount\"]").type(params.amount);
  cy.get("[id=\"owner\"]").type(params.owner);
  cy.get("[id=\"dynamicParams.precalc.issueDate\"]").type(params.issueDate);
});

Cypress.Commands.add("filterCheckIfPOFilterPersists", (params: {docId: string; version: string; poStatus: string;
  supplier: string; partNumber: string; amount: string; owner: string; issueDate: string; }) => {
  cy.get("[id=\"docId\"]").contains(params.docId);
  cy.get("[id=\"dynamicParams.precalc.version\"]").contains(params.version).should("exist");
  cy.get("[id=\"dynamicParams.precalc.po_status\"]").contains(params.poStatus).should("exist");
  cy.get("[id=\"dynamicParams.precalc.supplier\"]").contains(params.supplier).should("exist");
  cy.get("[id=\"dynamicParams.precalc.po_partNumber\"]").contains(params.partNumber).should("exist");
  cy.get("[id=\"dynamicParams.precalc.po_amount\"]").contains(params.amount).should("exist");
  cy.get("[id=\"owner\"]").contains(params.owner).should("exist");
  cy.get("[id=\"dynamicParams.precalc.issueDate\"]").contains(params.issueDate).should("exist");
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
