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
  cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType(params.docId).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType(params.version).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType(params.poStatus).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(3).clear().arrowType(params.supplier).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(4).clear().arrowType(params.partNumber).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(5).clear().arrowType(params.amount).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(6).clear().arrowType(params.owner).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(7).clear().arrowType(params.issueDate).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("filterCheckIfPOFilterPersists", (params: {docId: string; version: string; poStatus: string;
  supplier: string; partNumber: string; amount: string; owner: string; issueDate: string; }) => {
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(0).should("have.value", params.docId);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(1).should("have.value", params.version);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(2).should("have.value", params.poStatus);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(3).should("have.value", params.supplier);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(4).should("have.value", params.partNumber);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(5).should("have.value", params.amount);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(6).should("have.value", params.owner);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(7).should("have.value", params.issueDate);
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
  cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType(params.docId).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType(params.revision).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="3"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.state).arrowClick().wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType(params.title).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(3).clear().arrowType(params.owner).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="6"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.releasedDate).arrowClick().wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(4).clear().arrowType(params.formId).wait(500);
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("filterCheckIfRecordsFilterPersists", (params: {docId: string; revision: string; state: string;
  title: string; owner: string; releasedDate: string; formId: string; }) => {
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(0).should("have.value", params.docId);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(1).should("have.value", params.revision);
  cy.get("[class=\"k-filter-row\"]").first().find("th").eq(2).should("have.text", params.state);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(2).should("have.value", params.title);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(3).should("have.value", params.owner);
  cy.get("[class=\"k-filter-row\"]").first().find("th").eq(5).should("have.text", params.releasedDate);
  cy.get("[class=\"k-filter-row\"]>th>div>div>input").eq(4).should("have.value", params.formId);
});

Cypress.Commands.add("filterPOVersion", (params: { version: string }) => {
  cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType(params.version);
});

Cypress.Commands.add("filterClear", () => {
  cy.get("[id=\"clearFilter\"]").arrowClick();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("filterCheckNumberOfDisplayedRecords", (params: { numberOfRecords: string }) => {
  cy.get("[class*=\"k-pager-info\"]").contains(params.numberOfRecords + " items").should("exist");
});

Cypress.Commands.add("filterCheckHeaderValues", (...list: string[]) => {
  list.forEach((item) => {
    cy.get(`[aria-rowindex="1"]>th>span>span`).contains(item).should("exist");
  });
});

Cypress.Commands.add("filterGetFirstValueFromList", (params: { value: string }) => {
  cy.get("tr.k-master-row").first().contains(params.value).should("exist");
});

Cypress.Commands.add("filterSupplierTitle", (params: {name: string}) => {
  cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType(params.name);
});
