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
    cy.get("[id=\"docId\"]").arrowType(params.docId).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.version\"]").arrowType(params.version).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.po_status\"]").arrowType(params.poStatus).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.supplier\"]").arrowType(params.supplier).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.po_amount\"]").arrowType(params.amount).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.po_partNumber\"]").arrowType(params.partNumber).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"owner\"]").arrowType(params.owner).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.get("[id=\"dynamicParams.precalc.issueDate\"]").arrowType(params.issueDate).wait(500);
  cy.listLoadingElementShouldNotExist();
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
    cy.get("[id=\"docId\"]").arrowType(params.docId).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.revision\"]").arrowType(params.revision).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id$=\"select-displayStatus\"]").arrowClick();
    cy.get("ul[role=listbox]>li").contains(params.eqState).arrowClick().wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"name\"]").arrowType(params.title).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"owner\"]").arrowType(params.owner).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.get("[id=\"dynamicParams.precalc.cali_due_date\"]").arrowType(params.calDueDate).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[id=\"dynamicParams.precalc.pm_due_date\"]").arrowType(params.pmDueDate).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.formInput.fb-default-eq-status\"]").arrowType(params.eqStatus).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("filterRecords", (params: {docId: string; revision: string; state: string;
  title: string; owner: string; releasedDate: string; formId: string; }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"docId\"]").arrowType(params.docId).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.revision\"]").arrowType(params.revision).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"mui-component-select-displayStatus\"]").arrowClick();
    cy.get("ul[role=listbox] > li").contains(params.state).arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"name\"]").arrowType(params.title).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"owner\"]").arrowType(params.owner).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"mui-component-select-releasedAfter\"]").arrowClick();
    cy.get("ul[role=listbox] > li").contains(params.releasedDate).arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.wrapWithWaitOnApiCall(CyRoutes.DocRevGet, () => {
    cy.get("[id=\"dynamicParams.precalc.formDocId\"]").arrowType(params.formId).wait(500);
  });
  cy.listLoadingElementShouldNotExist();
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
  cy.get("[id=\"dynamicParams.precalc.version\"]").arrowType(params.version);
});

Cypress.Commands.add("filterClear", () => {
  cy.get("[id=\"clearFilter\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
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
  cy.get("[id=\"name\"]").arrowClick().arrowType(params.name);
});
