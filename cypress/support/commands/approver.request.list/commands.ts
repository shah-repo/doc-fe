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
  cy.wrapWithWaitOnApiCall(CyRoutes.GetChangeRequests, () => {
    cy.get("#clearFilter").click();
  });
});

Cypress.Commands.add("alFilterByArId", (params: {arId: string }) => {
  cy.get("input[name=crId]").type(params.arId).wait(300);
});

Cypress.Commands.add("alVerifyFilterByArId", (params: {arId: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(1)>div>a>div>div")
        .should("have.text", params.arId);
    });
});

Cypress.Commands.add("alFilterByTitle", (params: {title: string }) => {
  cy.get("input[name=title]").type(params.title).wait(300);
});

Cypress.Commands.add("alVerifyFilterByTitle", (params: {title: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(2)>div>a>div>div")
        .should("have.text", params.title);
    });
});

Cypress.Commands.add("alFilterByOwner", (params: {owner: string }) => {
  cy.get("input[name=owner]").type(params.owner).wait(300);
});

Cypress.Commands.add("alVerifyFilterByOwner", (params: {owner: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(3)>div>a>div>div")
        .should("have.text", params.owner);
    });
});

Cypress.Commands.add("alFilterByStatus", (params: {status: string }) => {
  cy.get("div[id=\"mui-component-select-state\"]").click().wait(300);
  cy.get("ul[role=listbox]>li").contains(params.status).click().wait(300);
});

Cypress.Commands.add("alVerifyFilterByStatus", (params: {status: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get(" div.ReactVirtualized__Table__rowColumn:nth-child(4)>div>div>div")
        .should("have.text", params.status);
    });
});

Cypress.Commands.add("alVerifyFilterClear", () => {
  cy.get("input[name=crId]").should("have.attr", "value", "");
  cy.get("input[name=title]").should("have.attr", "value", "");
  cy.get("input[name=owner]").should("have.attr", "value", "");
  cy.get("input[name=state]").should("have.attr", "value", "");
});

Cypress.Commands.add("alVerifyDescriptionOnHover", (params: {description: string}) => {
  cy.get("div[aria-rowindex=1]>div.ReactVirtualized__Table__rowColumn:nth-child(2)>div>a>div>div")
    .trigger("mouseover");
  cy.get("div[role=tooltip]>div").should("have.text", params.description);
});
