/* eslint-disable max-len */

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
      filterEquipmentTitle(params: {name: string}): Chainable<Subject>;
      filterEquip(params: {docId: string; revision: string; eqState: string;
        title: string; owner: string; calDueDate: string; pmDueDate: string; eqStatus: string; }): Chainable<Subject>;
      filterEquipByOwnerAndLocation(params: { location: string; owner: string }): Chainable<Subject>;
      filterRecordState(params: {state: string}): Chainable<Subject>;
      filterRecordVerifyRevisionFilter(params: {revision: string}): Chainable<Subject>;
      filterLandingPageColumnFilter(params: { colIndex: number; input: string }): Chainable<Subject>;
      filterVerifyLandingPageColumnFilterAttr(params: { colIndex: number; input: string }): Chainable<Subject>;
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
  cy.get(`th[aria-colindex="1"] .k-filtercell > input`).arrowType(params.docId).wait(500);
  cy.get(`th[aria-colindex="2"] .k-filtercell > input`).arrowType(params.revision).wait(500);
  cy.get(`th[aria-colindex="3"] .k-filtercell > span.k-input`).arrowClick();
  cy.get("ul>li").contains(params.eqState).arrowClick().wait(500);
  cy.get(`th[aria-colindex="4"] .k-filtercell > input`).arrowType(params.title).wait(500);
  cy.get(`th[aria-colindex="5"] .k-filtercell > input`).arrowType(params.owner).wait(500);
  cy.get(`th[aria-colindex="6"] .k-filtercell > input`).arrowType(params.calDueDate).wait(500);
  cy.get(`th[aria-colindex="7"] .k-filtercell > input`).arrowType(params.pmDueDate).wait(500);
  cy.get(`th[aria-colindex="8"] .k-filtercell > input`).arrowType(params.eqStatus).wait(500);
});

Cypress.Commands.add("filterEquipByOwnerAndLocation", (params: { location: string; owner: string }) => {
  cy.get(`th[aria-colindex="5"] .k-filtercell > input`).arrowType(params.owner).wait(500);
  cy.get(`th[aria-colindex="9"] .k-filtercell > input`).arrowType(params.location).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("filterRecords", (params: {docId: string; revision: string; state: string;
  title: string; owner: string; releasedDate: string; formId: string; }) => {
  cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType(params.docId).wait(500);
  cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType(params.revision).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`[aria-colindex="3"] [class="k-input"]`).scrollIntoView().arrowClick();
  cy.get("li").contains(params.state).arrowClick().wait(500);
  cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType(params.title).wait(500);
  cy.get("[class=\"k-textbox\"]").eq(3).clear().arrowType(params.owner).wait(500);
  cy.get(`[aria-colindex="6"] [class="k-input"]`).scrollIntoView().arrowClick();
  cy.get("li").contains(params.releasedDate).arrowClick().wait(500);
  cy.get("[class=\"k-textbox\"]").eq(4).clear().arrowType(params.formId).wait(500);
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
  cy.landingPageLoadingElementShouldNotExist();
  cy.landingPageLoadingElementShouldNotExist();
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

Cypress.Commands.add("filterEquipmentTitle", (params: {name: string}) => {
  cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType(params.name);
});

Cypress.Commands.add("filterRecordState", (params: {state: string}) => {
  cy.get(`[aria-colindex="3"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.state).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("filterRecordVerifyRevisionFilter", (params: {revision: string}) => {
  cy.get(`td[role="gridcell"][data-grid-col-index="1"]`).each(($el) => {
    expect($el.text()).to.equal(params.revision);
  });
});

Cypress.Commands.add("filterLandingPageColumnFilter", (params: { colIndex: number; input: string }) => {
  cy.get(`th[aria-colindex="${params.colIndex}"] .k-filtercell > input`).arrowType(params.input).wait(500);
});

Cypress.Commands.add("filterVerifyLandingPageColumnFilterAttr", (params: { colIndex: number; input: string }) => {
  cy.get(`th[aria-colindex="${params.colIndex}"] .k-filtercell > input`).should("have.attr", "value", params.input);
});
