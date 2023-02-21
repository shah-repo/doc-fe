/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      muiSelect(selectId: string, text: string): Chainable<Subject>;
      rpConfirmReleasedParentPart(isSeparate: boolean, isSubPart?: boolean);
      rpSwitchAndPopulateSpecificationsTabPart();
      rpCheckOptionsLengthAndValues(length: number, names: string[], removeRev?: boolean);
    }
  }
}

Cypress.Commands.add("muiSelect", (selectId, text) => {
  cy.get(selectId, { timeout: 10000 })
    .parent()
    .click()
    .find("div")
    .contains(text)
    .click({ force: true });
});


Cypress.Commands.add("rpConfirmReleasedParentPart", (isSeparate, isSubPart?) => {
  // Check for the Released status
  cy.get("div[data-cy=\"header-section\"]").find("div[data-cy=\"HeaderInfo-status\"]").contains("RELEASED");
  // Check for the green color header
  cy.get("div[data-cy=\"header-section\"]")
    .invoke("css", "background-color")
    .then((background) => {
      expect(background).to.eq("rgb(13, 183, 141)");
    });
  // Check for the Revise Document Button.
  cy.get("button[data-cy=\"updateRecord\"]").should("exist");

  if (isSeparate && !isSubPart) {
    // The Button Add Related Part should still exist.
    cy.get("button[data-cy=\"parentSeparate-addRelatedPartsBtn\"]").should("exist");

    // The Radio button selection must still be present, with the parent_separate selected
    cy.get("#partTypeSelector [type=\"radio\"][checked]").invoke("val").should((value) => value === "parent_separate");
  }

  if (isSeparate && isSubPart) {
    // The Button Add Related Part should not exist.
    cy.get("button[data-cy=\"parentSeparate-addRelatedPartsBtn\"]").should("not.exist");

    // The parent part selector should not exist
    cy.get("#tableTitle").should("not.exist");
  }

  if (!isSeparate) {
    // The Button Add Related Part should not exist.
    cy.get("button[data-cy=\"parentSeparate-addRelatedPartsBtn\"]").should("not.exist");

    // The Radio button selection must still be present, with the parent_separate selected
    cy.get("#partTypeSelector [type=\"radio\"][checked]").invoke("val").should((value) => value === "parent_together");
  }
});


Cypress.Commands.add("rpSwitchAndPopulateSpecificationsTabPart", () => {
  // navigate to Specification Items
  cy.drSelectSpecificationTab();

  // Select make vs buy
  cy.get("[id$=\"make-vs-buy\"]").arrowClick({ force: true });
  cy.get("ul[role=listbox]>li").contains("Make").arrowClick();

  // Select Unit of Measure
  cy.get("[data-cy=\"unit-of-measure\"]").autocompleteSelect("Set(s)");
  cy.unClick();

  // Save document
  cy.drClickSaveWithoutApiCall();

  // navigate to Overview tab
  cy.drSelectOverviewTab();
});

Cypress.Commands.add("rpCheckOptionsLengthAndValues", (length: number, names: string[], removeRev?: boolean) => {
  // partsGenerated also includes the voided subPart
  cy.get("ul>li[role=option]").should("have.length", length);

  // Check that the list has all the parts
  names.forEach((name: string) => {
    cy.get("ul>li[role=option]").contains(removeRev ? name.replace("- rev 1 -", "-") : name);
  });
});
