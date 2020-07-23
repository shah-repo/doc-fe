/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      poAddNewFieldItem(): Chainable<Subject>;
      poCreateNew(): Chainable<Subject>;
      poAddPOButtonClick(): Chainable<Subject>;
      poEnterDocumentDescription(params: {description: string }): Chainable<Subject>;
      poSelectPartNumber(): Chainable<Subject>;
      poEnterQuantityOrdered(params: {quantity: string}): Chainable<Subject>;
      poSelectUnits(): Chainable<Subject>;
      poSelectGLCode(): Chainable<Subject>;
      poEnterSupplierPartNumber(params: {partNumber: string}): Chainable<Subject>;
      poNumberOfUnits(params: {number: string}): Chainable<Subject>;
      poAddDateRequired(): Chainable<Subject>;
      poShippingCost(params: {number: string}): Chainable<Subject>;
      poSelectCurrency(): Chainable<Subject>;
      poCheckAmount(params: {number: string}): Chainable<Subject>;
      poSelectTaxCheckbox(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("poAddNewFieldItem", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-fullWidth\"]").contains("Add item").click();
});

Cypress.Commands.add("poAddPOButtonClick", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary\"]").contains(new RegExp("^Add$", "g")).click();
});

Cypress.Commands.add("poCreateNew", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev").click();
});

Cypress.Commands.add("poEnterDocumentDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").click().type(params.description, { delay: 100 });
  cy.get("[id=\"DocumentRevisionForm-submit\"]").wait(3000).click();
});

Cypress.Commands.add("poSelectPartNumber", () => {
  cy.get("[name=\"partNumber\"]").click();
  cy.get("ul[role=listbox] > li").contains("PRT-00004 - 1").click();
});

Cypress.Commands.add("poEnterQuantityOrdered", (params: {quantity: string}) => {
  cy.get("[name=\"order\"]").click().type(params.quantity);
});

Cypress.Commands.add("poSelectUnits", () => {
  cy.get("[name=\"units\"]").click();
  cy.get("ul[role=listbox] > li").contains("Each").click();
});

Cypress.Commands.add("poSelectGLCode", () => {
  cy.get("[name=\"glCode\"]").click();
  cy.get("ul[role=listbox] > li").contains("code 1").click();
});

Cypress.Commands.add("poEnterSupplierPartNumber", (params: {partNumber: string}) => {
  cy.get("[name=\"description\"]").click().type(params.partNumber);
});

Cypress.Commands.add("poNumberOfUnits", (params: {number: string}) => {
  cy.get("[name=\"unitPrice\"]").click().type(params.number);
});

Cypress.Commands.add("poAddDateRequired", () => {
  cy.xpath("//input[@name]/ ../div/button").click().wait(200);
  cy.xpath("//div[@class=\"MuiPickersCalendar-week\"] [last()]/div[@role=\"presentation\"]/button[not(@tabindex=\"-1\")]").last()
    .click().wait(300);
});

Cypress.Commands.add("poShippingCost", (params: {number: string}) => {
  cy.get("[name*=\"shippingCost\"]").click().wait(2000).type("{leftarrow}{leftarrow}{leftarrow}" + params.number);
});

Cypress.Commands.add("poSelectCurrency", () => {
  cy.get("[id*=\"currency\"]").click();
  cy.get("ul[role=listbox] > li").contains("USD").click();
});

Cypress.Commands.add("poSelectTaxCheckbox", () => {
  cy.get("[name=\"tax\"]").check();
});

Cypress.Commands.add("poCheckAmount", (params: {number: string}) => {
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains(params.number).should("exist");
});

