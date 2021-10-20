/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */


export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      supEnterSuppName(params: {name: string}): Chainable<Subject>;
      supEnterSuppAddressPhone(params: {address: string}): Chainable<Subject>;
      supCreateNew(): Chainable<Subject>;
      supClickOnSpecificSupplierFileFromList(params: {item: string}): Chainable<Subject>;
      supCheckForSuggestedForms(...list: string[]): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("supEnterSuppName", (params: {name: string}) => {
  cy.get("[data-cy=\"field-name\"]").arrowClick().arrowType(params.name);
});

Cypress.Commands.add("supEnterSuppAddressPhone", (params: {address: string}) => {
  cy.get("[data-cy=\"RichTextEditor.description\"]").arrowClick().arrowType(params.address);
});

Cypress.Commands.add("supCreateNew", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev]").arrowClick();
});

Cypress.Commands.add("supClickOnSpecificSupplierFileFromList", (params: {item: string}) => {
  cy.get("[class*=\"ReactVirtualized__Table__row \"]").contains(params.item).arrowClick();
});

Cypress.Commands.add("supCheckForSuggestedForms", (...list: string[]) => {
  cy.get("[data-cy=field-selectForm]>div:nth-child(2)").arrowClick();
  list.forEach((item) => {
    cy.get("[id^=react-select]").contains(item).should("exist");
  });
});
