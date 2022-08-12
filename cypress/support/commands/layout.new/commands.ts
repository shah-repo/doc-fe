/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      verifyTitleDescriptionFields(): Chainable;
      verifyDefaultFields(): Chainable;
      verifyDocumentHeaderDetails(): Chainable;
      verifySelectedTab(params: {tab: string}): Chainable;
      verifyFixedTab(): Chainable;
      verifyApprovalsField(): Chainable;
      verifyExpandCollpase(): Chainable;
      verifyReferencesGeneralInfo(params: {user: string}): Chainable;
      verifyReferencesOtherInfo(): Chainable;
    }
  }
}

Cypress.Commands.add("verifyTitleDescriptionFields", () => {
  cy.get("[data-cy=\"field-name\"]").should("exist");
  cy.get("[data-cy=\"description\"]").should("exist");
});

Cypress.Commands.add("verifyDefaultFields", () => {
  cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
  cy.get("[data-cy=\"field-document.docId\"]").should("exist");
  cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
  cy.get("[data-cy=\"field-retrain\"]").should("exist");
  cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
});

Cypress.Commands.add("verifyDocumentHeaderDetails", () => {
  cy.get("div[data-cy=\"Header-listIcon\"]").should("exist");
  cy.get("div[data-cy=\"Header-listTitle\"]").should("exist");
  cy.get("span[data-cy=\"HeaderInfo-docId\"]").should("exist");
  cy.get("div[data-cy=\"HeaderInfo-Rev\"]").should("exist");
  cy.get("div[data-cy=\"HeaderInfo-status\"]").should("exist");
});

Cypress.Commands.add("verifySelectedTab", (params: {tab: string}) => {
  cy.get(`[data-cy="tabId.${params.tab}"]`).parent().parent().should("have.class", "Mui-selected");
});

Cypress.Commands.add("verifyFixedTab", () => {
  cy.get(".MuiTabs-fixed").should("exist");
});

Cypress.Commands.add("verifyApprovalsField", () => {
  cy.get("[id^=\"fb-approvals-section-fb-approvals\"]").should("exist");
  cy.get("input[data-cy^=\"fb-approvals-fb-approvals\"]").should("exist");
});

Cypress.Commands.add("verifyExpandCollpase", () => {
  cy.get("main span>button").eq(0).should("not.have.class", "maximize").click().should("have.class", "maximize");
  cy.get("main span>button").eq(0).arrowClick();
});

Cypress.Commands.add("verifyReferencesGeneralInfo", (params: {user: string}) => {
  cy.get("[data-cy=\"references-icon\"]").should("be.visible");
  cy.get("[data-cy=\"generalInfo\"]>p").should("contain.text", "General Info");
  cy.get("[data-cy=\"user-avatar\"]").should("exist");
  cy.get("[data-cy=\"user-name\"]").should("contain.text", params.user);
  cy.get("[data-cy=\"secondary-text\"]").should("contain.text", "Owner");
});

Cypress.Commands.add("verifyReferencesOtherInfo", () => {
  cy.get("[data-cy=\"generalInfo\"]")
    .should("contain.text", "Referenced By")
    .and("contain.text", "Training")
    .and("contain.text", "Release Date")
    .and("contain.text", "Form Info");
});
