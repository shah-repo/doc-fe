/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

// import { integerType } from "aws-sdk/clients/iam";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      alVerifyStartingFilter(): Chainable<Subject>;
      alClearFilters(): Chainable<Subject>;
      alFilterByArId(params: {arId: string }): Chainable<Subject>;
      alVerifyFilterByArId(params: {arId: string }): Chainable<Subject>;
      alFilterByTitle(params: {title: string }): Chainable<Subject>;
      alVerifyFilterByTitle(params: {title: string }): Chainable<Subject>;
      alFilterByOwner(params: {owner: string }): Chainable<Subject>;
      alVerifyFilterByOwner(params: {owner: string }): Chainable<Subject>;
      alFilterByStatus(params: {status: string }): Chainable<Subject>;
      alVerifyFilterByStatus(params: {status: string }): Chainable<Subject>;
      alVerifyFilterClear(): Chainable<Subject>;
      alVerifyDescriptionOnHover(params: {description: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("alVerifyStartingFilter", () => {
  cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(4)>div")
    .each(($el) => {
      expect($el.text()).to.satisfy((string) =>
        ["DRAFT", "IN_REVIEW"].some((bit) => string.includes(bit))
      );
    });
});

Cypress.Commands.add("alClearFilters", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.PostChangeRequestsSearch, () => {
    cy.get("#clearFilter").arrowClick();
  });
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("alFilterByArId", (params: {arId: string }) => {
  cy.get(`[aria-colindex="1"] .k-filtercell > input`).arrowType(params.arId).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("alVerifyFilterByArId", (params: {arId: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", params.arId);
});

Cypress.Commands.add("alFilterByTitle", (params: {title: string }) => {
  cy.get(`[aria-colindex="2"] .k-filtercell > input`).arrowType(params.title).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("alVerifyFilterByTitle", (params: {title: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", params.title);
});

Cypress.Commands.add("alFilterByOwner", (params: {owner: string }) => {
  cy.get(`[aria-colindex="3"] .k-filtercell>input`).arrowType(params.owner).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("alVerifyFilterByOwner", (params: {owner: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(2).find("span").eq(0).should("have.text", params.owner);
});

Cypress.Commands.add("alFilterByStatus", (params: {status: string }) => {
  cy.get("[class='k-grid-content k-virtual-content']").scrollTo("right");
  cy.landingPageLoadingElementShouldNotExist();
  cy.wait(1000);
  cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick().wait(500);
  cy.get("li").contains(params.status).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("alVerifyFilterByStatus", (params: {status: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", params.status);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("alVerifyFilterClear", () => {
  cy.get(`[aria-colindex="1"] .k-filtercell > input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="2"] .k-filtercell > input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="3"] .k-filtercell > input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="4"] [class="k-input"]`).should("have.text", "All");
});

Cypress.Commands.add("alVerifyDescriptionOnHover", (params: {description: string}) => {
  cy.get("tr.k-master-row>td").eq(1)
    .trigger("mouseover");
  cy.get("div[role=tooltip]>div").should("have.text", params.description);
});
