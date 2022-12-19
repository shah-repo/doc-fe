
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      dtmClickAddDocumentType(): Chainable<Subject>;
      dtmClearFilters(): Chainable<Subject>;
      dtmSelectPrivateNumber(): Chainable<Subject>;
      dtmSelectRedline(): Chainable<Subject>;
      dtmSelectQMS(): Chainable<Subject>;
      dtmSelectNeedsSignature(): Chainable<Subject>;
      dtmSelectTraining(): Chainable<Subject>;
      dtmUncheckPrivateNumber(): Chainable<Subject>;
      dtmUncheckRedline(): Chainable<Subject>;
      dtmUncheckQMS(): Chainable<Subject>;
      dtmUncheckNeedsSignature(): Chainable<Subject>;
      dtmUncheckTraining(): Chainable<Subject>;
      dtmCloseDialogButton(): Chainable<Subject>;
      dtmSelectGroup(params: { group: string }): Chainable;
      dtmSelectUsersWithoutTags(params: { usersWithoutTags: string }): Chainable;
      dtmSelectRevisionStage(params: { revisionStage: string }): Chainable;
      dtmAddDocType(params: { docType: string }): Chainable;
      dtmAddAcronym(params: { acronym: string }): Chainable;
      dtmAddStartingNumber(params: { startingNumber: string }): Chainable;
      dtmAddCategory(params: { category: string }): Chainable;
      dtmEditSchema(params: { index: number }): Chainable;
      dtmUpdateTextField(params: { FilePath: string }): Chainable;
      filterDocTypeManagement(params: {status: string; documentType: string; acronym: string;
        privateNumber: string; redline: string; qms: string; needsSignature: string; training: string;
        startingNumber: string; revisionStage: string; usersWithoutTags?: string; group: string;
        equipmentProdEnforce: string; category: string;}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("dtmClickAddDocumentType", () => {
  cy.get("button").contains("Add Document Type").scrollIntoView();
  cy.get("button").contains("Add Document Type").arrowClick();
});

Cypress.Commands.add("dtmUpdateTextField", (params: { FilePath: string }) => {
  cy.fixture(params.FilePath).then((text)  => {
    cy.get("textarea").eq(0).clear().arrowType(text, {
      parseSpecialCharSequences: false,
      delay: 1,
    }).wait(2000);
  });
});

Cypress.Commands.add("dtmEditSchema", (params: { index: number }) => {
  cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span")
    .eq(params.index).scrollIntoView().arrowClick().wait(1000);
  cy.get("[data-grid-row-index='0']>td[data-grid-col-index='14']>span")
    .eq(params.index).scrollIntoView().arrowClick().wait(1000);
});

Cypress.Commands.add("dtmSelectPrivateNumber", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(0).check();
});

Cypress.Commands.add("dtmSelectRedline", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(1).check();
});

Cypress.Commands.add("dtmSelectQMS", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(2).check();
});

Cypress.Commands.add("dtmSelectNeedsSignature", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(3).check();
});

Cypress.Commands.add("dtmSelectTraining", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(4).check();
});

Cypress.Commands.add("dtmUncheckPrivateNumber", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(0).uncheck();
});

Cypress.Commands.add("dtmUncheckRedline", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(1).uncheck();
});

Cypress.Commands.add("dtmUncheckQMS", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(2).uncheck();
});

Cypress.Commands.add("dtmUncheckNeedsSignature", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(3).uncheck();
});

Cypress.Commands.add("dtmUncheckTraining", () => {
  cy.get("[data-grid-row-index='0']>td>span>input").eq(4).uncheck();
});

Cypress.Commands.add("dtmCloseDialogButton", () => {
  cy.get("#DialogContent-close").arrowClick();
});

Cypress.Commands.add("dtmSelectGroup", (params: { group: string }) => {
  cy.get(`tr>td span[role="listbox"] span.k-input`).eq(3).scrollIntoView().arrowClick();
  cy.get("li").contains(new RegExp("^" + params.group + "$", "g")).arrowClick();
});

Cypress.Commands.add("dtmSelectRevisionStage", (params: { revisionStage: string }) => {
  cy.get("[data-grid-row-index='0']>td>span>span>span").eq(3).contains("Select Item").arrowClick();
  cy.get("li").contains(params.revisionStage).arrowClick();
});

Cypress.Commands.add("dtmSelectUsersWithoutTags", (params: { usersWithoutTags: string }) => {
  cy.get("[data-grid-row-index='0']>td>span>span>span").eq(5).contains("Select Item").arrowClick();
  cy.get("li").contains(params.usersWithoutTags).arrowClick();
});

Cypress.Commands.add("dtmAddStartingNumber", (params: { startingNumber: string }) => {
  cy.get("[data-grid-row-index='0']>td>span>span>input").arrowType(params.startingNumber);
});

Cypress.Commands.add("dtmAddDocType", (params: { docType: string }) => {
  cy.get("[data-grid-row-index='0']>td>input").eq(0).clear().arrowType(params.docType);
});

Cypress.Commands.add("dtmAddAcronym", (params: { acronym: string }) => {
  cy.get("[data-grid-row-index='0']>td>input").eq(1).clear().arrowType(params.acronym);
});

Cypress.Commands.add("dtmAddCategory", (params: { category: string }) => {
  cy.get("[data-grid-row-index='0']>td>input").eq(2).clear().arrowType(params.category);
});

Cypress.Commands.add("dtmClearFilters", () => {
  cy.get("button").contains("Clear Filters").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dtmCloseDialogButton", () => {
  cy.get("#DialogContent-close").arrowClick();
});

Cypress.Commands.add("filterDocTypeManagement", (params: {status: string; documentType: string; acronym: string;
  privateNumber: string; redline: string; qms: string; needsSignature: string; training: string;
  startingNumber: string; revisionStage: string; usersWithoutTags?: string; group: string;
  equipmentProdEnforce: string; category: string; }) => {
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(0).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get("li").contains(params.status).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType(params.documentType).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(1).arrowType(params.acronym).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(3).arrowClick();
  cy.get("li").contains(params.privateNumber).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(4).arrowClick();
  cy.get("li").contains(params.redline).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(5).arrowClick();
  cy.get("li").contains(params.qms).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(6).arrowClick();
  cy.get("li").contains(params.needsSignature).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(7).arrowClick();
  cy.get("li").contains(params.training).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.wait(1000);
  cy.get("[class='k-grid-content k-virtual-content']").scrollTo("center").wait(1000);
  cy.get(`div>div>span>span [class*='k-input k-formatted']`).clear().arrowType(params.startingNumber).wait(500);
  cy.listLoadingElementShouldNotExist();
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(9).arrowClick();
  cy.get("li").contains(params.revisionStage).arrowClick();
  cy.listLoadingElementShouldNotExist();
  if (params !== undefined && params.usersWithoutTags !== undefined)
  {
    cy.get(`tr>th span[role="listbox"] span.k-input`).eq(10).arrowClick();
    cy.get("li").contains(params.usersWithoutTags).arrowClick();
  }
  cy.listLoadingElementShouldNotExist();
  cy.get("[class='k-grid-content k-virtual-content']").scrollTo("right").wait(1000);
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(11).arrowClick();
  cy.get("li").contains(params.group).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get(`tr>th span[role="listbox"] span.k-input`).eq(12).arrowClick();
  cy.get("li").contains(params.equipmentProdEnforce).arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType(params.category).wait(500);
  cy.listLoadingElementShouldNotExist();
});
