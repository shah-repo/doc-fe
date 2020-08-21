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
  cy.get("[data-cy=\"field-name\"]").click().type(params.name);
});

Cypress.Commands.add("supEnterSuppAddressPhone", (params: {address: string}) => {
  cy.get("[data-cy=\"RichTextEditor.description\"]").click().type(params.address);
});

Cypress.Commands.add("supCreateNew", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev]").click().wait(3000);
});

Cypress.Commands.add("supClickOnSpecificSupplierFileFromList", (params: {item: string}) => {
  cy.get("[class*=\"ReactVirtualized__Table__row \"]").contains(params.item).click();
});

Cypress.Commands.add("supCheckForSuggestedForms", (...list: string[]) => {
  cy.get("[id=\"FormListDialog-selectForm\"]").click();
  list.forEach((item) => {
    cy.get("[id=\"FormListDialog-selectForm\"] > div > div > div").contains(item).should("exist");
  });
});
