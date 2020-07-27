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
      poCheckCurrency(): Chainable<Subject>;
      poCheckAmount(params: {number: string}): Chainable<Subject>;
      poSelectTaxCheckbox(): Chainable<Subject>;
      poSelectOption(params: {optionName: string}): Chainable<Subject>;
      poEnterServiceID(params: {serviceId: string}): Chainable<Subject>;
      poEnterDescription(params: {description: string}): Chainable<Subject>;
      poSelectCurrency(params: { currencyValue: string }): Chainable<Subject>;
      poCheckMessageForConversionSite(): Chainable<Subject>;
      poCheckStatus(...list: string[]): Chainable<Subject>;
      poClickOnSpecificPOFromList(params: {item: string}): Chainable<Subject>;
      poCheckForSpecificPOItemValue(params: {itemValue: string}): Chainable<Subject>;
      poConvertedToDollarsMessage(): Chainable<Subject>;
      poCheckIfFormPopUpIsActive(...list: string[]): Chainable<Subject>;
      poCloseFormPopUpOnLandingPage(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("poAddNewFieldItem", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-fullWidth\"]").contains("Add item").click().wait(300);
});

Cypress.Commands.add("poAddPOButtonClick", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary\"]").contains(new RegExp("^Add$", "g")).click();
});

Cypress.Commands.add("poCreateNew", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev").click();
});

Cypress.Commands.add("poEnterDocumentDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").click().type(params.description);
  cy.get("[id=\"DocumentRevisionForm-submit\"]").wait(3000).click();
});

Cypress.Commands.add("poSelectPartNumber", () => {
  cy.get("[name=\"partNumber\"]").click().wait(300);
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
  cy.get("[name*=\"shippingCost\"]").click().wait(1000).type("{leftarrow}{leftarrow}{leftarrow}" + params.number);
});

Cypress.Commands.add("poCheckCurrency", () => {
  cy.get("[id*=\"currency\"]").click();
  cy.get("ul[role=listbox] > li").contains("USD").should("exist");
  cy.get("ul[role=listbox] > li").contains("EUR").should("exist");
  cy.get("ul[role=listbox] > li").contains("GBP").should("exist");
  cy.get("ul[role=listbox] > li").contains("AU").should("exist");
  cy.get("ul[role=listbox] > li").contains("C").should("exist");
});

Cypress.Commands.add("poSelectCurrency", (params: { currencyValue: string }) => {
  cy.get("ul[role=listbox] > li").contains(params.currencyValue).click();
});

Cypress.Commands.add("poSelectTaxCheckbox", () => {
  cy.get("[name=\"tax\"]").check();
});

Cypress.Commands.add("poCheckAmount", (params: {number: string}) => {
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains(params.number).should("exist");
});

Cypress.Commands.add("poSelectOption", (params: {optionName: string}) => {
  cy.get("input[value=" + params.optionName + "]").click();
});

Cypress.Commands.add("poEnterServiceID", (params: {serviceId: string}) => {
  cy.get("[name=\"serviceId\"]").click().type(params.serviceId);
});

Cypress.Commands.add("poEnterDescription", (params: {description: string}) => {
  cy.get("[name=\"description\"]").click().type(params.description);
});

Cypress.Commands.add("poClickOnSpecificPOFromList", (params: {item: string}) => {
  cy.get("[class*=\"ReactVirtualized__Table__row \"]").contains(params.item).click();
});

Cypress.Commands.add("poCheckForSpecificPOItemValue", (params: {itemValue: string}) => {
  cy.get("[class*=\"ReactVirtualized__Table__row \"]").contains(params.itemValue).should("exist");
});

Cypress.Commands.add("poCheckMessageForConversionSite", () => {
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains("Exchange rate according to ").should("exist");
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains("fixer.io").should("exist");
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains("as of").should("exist");
});

Cypress.Commands.add("poConvertedToDollarsMessage", () => {
  cy.get("[class*=\"FBTotal-root MuiTableCell-alignRight\"]").contains("Total in US dollars:").should("exist");
});

Cypress.Commands.add("poCheckStatus", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[class=\"MuiList-root MuiList-padding\"] > div > a > div").contains(item).should("exist");
  });
});

Cypress.Commands.add("poCheckIfFormPopUpIsActive", (...list: string[]) => {
  list.forEach((item) => {
    cy.get("[id=\"FormListDialog-selectForm\"]").contains(item).should("exist");
  });
});

Cypress.Commands.add("poCloseFormPopUpOnLandingPage", () => {
  cy.get("[id=\"FormListDialog-cancelButton\"]").click();
});
