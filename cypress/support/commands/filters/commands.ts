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
      filterRecords(params: {docId: string; revision: string; state: string;
        title: string; owner: string; releasedDate: string; formId: string; }): Chainable<Subject>;
      filterCheckHeaderValues(...list: string[]): Chainable<Subject>;
      filterPOVersion(params: { version: string }): Chainable<Subject>;
      filterClear(): Chainable<Subject>;
      filterCheckIfPOFilterPersists(params: {docId: string; version: string; poStatus: string;
        supplier: string; partNumber: string; amount: string; owner: string; issueDate: string; }): Chainable<Subject>;
      filterCheckIfRecordsFilterPersists(params: {docId: string; revision: string; state: string;
        title: string; owner: string; releasedDate: string; formId: string; }): Chainable<Subject>;
      filterCheckNumberOfDisplayedRecords(params: { numberOfRecords: string }): Chainable<Subject>;
      filterGetFirstValueFromList(params: { value: string }): Chainable<Subject>;
      filterSupplierTitle(params: {name: string}): Chainable<Subject>;
      filterEquip(params: {docId: string; revision: string; eqState: string;
        title: string; owner: string; calDueDate: string; pmDueDate: string; eqStatus: string; }): Chainable<Subject>;
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

Cypress.Commands.add("filterEquip", (params: {docId: string; revision: string; eqState: string;
  title: string; owner: string; calDueDate: string; pmDueDate: string; eqStatus: string; }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"docId\"]").type(params.docId);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.revision\"]").type(params.revision);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id$=\"select-displayStatus\"]").click();
    cy.get("ul[role=listbox]>li").contains(params.eqState).click();
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"name\"]").type(params.title);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"owner\"]").type(params.owner);
  });
  cy.get("[id=\"dynamicParams.precalc.cali_due_date\"]").type(params.calDueDate);
  cy.get("[id=\"dynamicParams.precalc.pm_due_date\"]").type(params.pmDueDate);
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.formInput.fb-default-eq-status\"]").type(params.eqStatus);
  });
});

Cypress.Commands.add("filterRecords", (params: {docId: string; revision: string; state: string;
  title: string; owner: string; releasedDate: string; formId: string; }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"docId\"]").type(params.docId);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.revision\"]").type(params.revision);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"mui-component-select-displayStatus\"]").click();
    cy.get("ul[role=listbox] > li").contains(params.state).click();
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"name\"]").type(params.title);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"owner\"]").type(params.owner);
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"mui-component-select-releasedAfter\"]").click();
    cy.get("ul[role=listbox] > li").contains(params.releasedDate).click();
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.formDocId\"]").type(params.formId);
  });
});

Cypress.Commands.add("filterCheckIfRecordsFilterPersists", (params: {docId: string; revision: string; state: string;
  title: string; owner: string; releasedDate: string; formId: string; }) => {
  cy.get("[id=\"docId\"]").should("have.value", params.docId);
  cy.get("[id=\"dynamicParams.precalc.revision\"]").should("have.value", params.revision);
  cy.get("[id=\"mui-component-select-displayStatus\"]").should("have.text", params.state);
  cy.get("[id=\"name\"]").should("have.value", params.title);
  cy.get("[id=\"owner\"]").should("have.value", params.owner);
  cy.get("[id=\"mui-component-select-releasedAfter\"]").should("have.text", params.releasedDate);
  cy.get("[id=\"dynamicParams.precalc.formDocId\"]").should("have.value", params.formId);
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
