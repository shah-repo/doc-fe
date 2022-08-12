/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      verifyDefaultFields(): Chainable;
      verifyDocumentHeaderDetails(): Chainable;
      verifySelectedTab(params: { tab: string }): Chainable;
      verifyExpandCollpase(): Chainable;
      verifyReferencesGeneralInfo(params: {user: string}): Chainable;
      verifyReferencesOtherInfo(): Chainable;
      verifyHistoryScroll(): Chainable;
      verifyFormOptions(params: {visible: string}): Chainable;
    }
  }
}

Cypress.Commands.add("verifyDefaultFields", () => {
  cy.get("[data-cy=\"field-document.documentType.id\"]")
    .parent()
    .should("have.class", "MuiGrid-grid-xs-6")
    .next()
    .should("have.class", "MuiGrid-grid-xs-6")
    .should("contain.text", "Document ID");
  cy.get("[data-cy=\"field-revisionStage\"]")
    .parent()
    .parent()
    .should("have.class", "MuiGrid-grid-xs-6")
    .next()
    .should("have.class", "MuiGrid-grid-xs-6")
    .should("contain.text", "Training Required");
  cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
});

Cypress.Commands.add("verifyDocumentHeaderDetails", () => {
  cy.get("div[data-cy=\"Header-listIcon\"]").should("exist");
  cy.get("div[data-cy=\"Header-listTitle\"]").should("exist");
  cy.get("span[data-cy=\"HeaderInfo-docId\"]").should("exist");
  cy.get("div[data-cy=\"HeaderInfo-Rev\"]").should("exist");
  cy.get("div[data-cy=\"HeaderInfo-status\"]").should("exist");
});

Cypress.Commands.add("verifySelectedTab", (params: { tab: string }) => {
  cy.get(`[data-cy="tabId.${params.tab}"]`).parent().parent().should("have.class", "Mui-selected");
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

Cypress.Commands.add("verifyHistoryScroll", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
    cy.drSelectHistoryTab();
    cy.get(`[data-cy="History-detail"]`).realHover().wait(500).scrollTo("top");
    cy.get("[data-cy=\"History-detail\"]").scrollTo("bottom");
  });
});

Cypress.Commands.add("verifyFormOptions", (params: {visible: string}) => {
  cy.get("button[data-cy=\"FBWorkspace-clickView\"]").should(params.visible);
  cy.get("[data-cy=\"FBWorkspace-importTemplate\"]").should(params.visible);
  cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").should(params.visible);
});
