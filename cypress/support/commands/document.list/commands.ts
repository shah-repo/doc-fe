/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { integerType } from "aws-sdk/clients/iam";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      dlVerifyDocIdIsPresentOnFirstDocument(): Chainable<Subject>;
      dlVerifyRevisionIsPresentOnFirstDocument(): Chainable<Subject>;
      dlVerifyTitleIsPresentOnFirstDocument(): Chainable<Subject>;
      dlVerifyTypeIsPresentOnFirstDocument(): Chainable<Subject>;
      dlVerifyOwnerIsPresentOnFirstDocument(): Chainable<Subject>;
      dlVerifyARIdIsPresentOnFirstDocument(): Chainable<Subject>;
      dlVerifyStatusIsPresentOnFirstDocument(): Chainable<Subject>;
      dlVerifyEffectiveDateIsPresentOnFirstDocument(): Chainable<Subject>;
      dlFilterByName(params: {title: string }): Chainable<Subject>;
      dlClearFilters(): Chainable<Subject>;
      dlVerifyDocumentCount(params: {numberOfDoc: integerType }): Chainable<Subject>;
      dlFilterByDocId(params: {docId: string }): Chainable<Subject>;
      dlVerifyFilterByDocId(params: {docId: string }): Chainable<Subject>;
      dlFilterByRev(params: {revision: string }): Chainable<Subject>;
      dlVerifyFilterByRev(params: {revision: string }): Chainable<Subject>;
      dlFilterByDocTitle(params: {docTitle: string }): Chainable<Subject>;
      dlVerifyFilterByDocTitle(params: {docTitle: string }): Chainable<Subject>;
      dlFilterByType(params: {type: string }): Chainable<Subject>;
      dlVerifyFilterByType(params: {type: string }): Chainable<Subject>;
      dlFilterByOwner(params: {owner: string }): Chainable<Subject>;
      dlVerifyFilterByOwner(params: {owner: string }): Chainable<Subject>;
      dlFilterByArId(params: {arId: string }): Chainable<Subject>;
      dlVerifyFilterByArId(params: {arId: string }): Chainable<Subject>;
      dlFilterByStatus(params: {status: string }): Chainable<Subject>;
      dlVerifyFilterByStatus(params: {status: string }): Chainable<Subject>;
      dlFilterByEffectiveDate(params: {effectiveDate: string }): Chainable<Subject>;
      dlVerifyFilterByEffectiveDate(params: {effectiveDate: string }): Chainable<Subject>;
      dlVerifyFilterClear(): Chainable<Subject>;
      dlVerifyDocCounter(params: {docCounterNumber: integerType }): Chainable<Subject>;
      dlVerifyDescriptionOnHover(params: {description: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("dlVerifyDocIdIsPresentOnFirstDocument", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(1)>div>a>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("dlVerifyRevisionIsPresentOnFirstDocument", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(2)>div>a>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("dlVerifyTitleIsPresentOnFirstDocument", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(3)>div>a>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("dlVerifyTypeIsPresentOnFirstDocument", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(4)>div>a>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("dlVerifyOwnerIsPresentOnFirstDocument", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(5)>div>a>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("dlVerifyARIdIsPresentOnFirstDocument", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(6)>div>a>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("dlVerifyStatusIsPresentOnFirstDocument", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(7)>div>a>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("dlVerifyEffectiveDateIsPresentOnFirstDocument", () => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(8)>div>a>div>div").should("not.be.empty");
    });
});

Cypress.Commands.add("dlClearFilters", () => {
  cy.get("button[data-cy=clearFilter]").click().wait(500);
});

Cypress.Commands.add("dlVerifyDocumentCount", (params: {numberOfDoc: integerType }) => {
  cy.get("div[aria-rowindex]").should("have.length", params.numberOfDoc);
});

Cypress.Commands.add("dlFilterByDocId", (params: {docId: string }) => {
  cy.get("input[name=docId]").type(params.docId).wait(500);
});

Cypress.Commands.add("dlVerifyFilterByDocId", (params: {docId: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(1)>div>a>div>div")
        .should("have.text", params.docId);
    });
});

Cypress.Commands.add("dlFilterByRev", (params: {revision: string }) => {
  cy.get("input[name=displayRevision]").type(params.revision).wait(500);
});

Cypress.Commands.add("dlVerifyFilterByRev", (params: {revision: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(2)>div>a>div>div")
        .should("have.text", params.revision);
    });
});

Cypress.Commands.add("dlFilterByDocTitle", (params: {docTitle: string }) => {
  cy.get("#name").type(params.docTitle).wait(500);
});

Cypress.Commands.add("dlVerifyFilterByDocTitle", (params: {docTitle: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(3)>div>a>div>div")
        .should("have.text", params.docTitle);
    });
});

Cypress.Commands.add("dlFilterByType", (params: {type: string }) => {
  cy.get("#mui-component-select-documentTypeId").click().wait(500);
  cy.get("ul[role=listbox]>li").contains(params.type).click().wait(500);
});

Cypress.Commands.add("dlVerifyFilterByType", (params: {type: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(4)>div>a>div>div")
        .should("have.text", params.type);
    });
});

Cypress.Commands.add("dlFilterByOwner", (params: {owner: string }) => {
  cy.get("input[name=owner]").type(params.owner).wait(500);
});

Cypress.Commands.add("dlVerifyFilterByOwner", (params: {owner: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(5)>div>a>div>div")
        .should("have.text", params.owner);
    });
});

Cypress.Commands.add("dlFilterByArId", (params: {arId: string }) => {
  cy.get("input[name=crId]").type(params.arId).wait(500);
});

Cypress.Commands.add("dlVerifyFilterByArId", (params: {arId: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(6)>div>a>div>div")
        .should("have.text", params.arId);
    });
});

Cypress.Commands.add("dlFilterByStatus", (params: {status: string }) => {
  cy.get("div[id=\"mui-component-select-displayStatus\"]").click().wait(500);
  cy.get("ul[role=listbox]>li").contains(params.status).click().wait(500);
});

Cypress.Commands.add("dlVerifyFilterByStatus", (params: {status: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(7)>div>div>div")
        .should("have.text", params.status);
    });
});

Cypress.Commands.add("dlFilterByEffectiveDate", (params: {effectiveDate: string }) => {
  cy.get("#mui-component-select-effectiveDate").click().wait(500);
  cy.get("ul[role=listbox]>li").contains(params.effectiveDate).click().wait(500);
});

Cypress.Commands.add("dlVerifyFilterByEffectiveDate", (params: {effectiveDate: string }) => {
  cy.get("div[aria-rowindex=1]")
    .within(() => {
      cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(8)>div>a>div>div")
        .should("have.text", params.effectiveDate);
    });
});

Cypress.Commands.add("dlVerifyFilterClear", () => {
  cy.get("input[name=docId]").should("have.attr", "value", "");
  cy.get("input[name=displayRevision]").should("have.attr", "value", "");
  cy.get("input[name=name]").should("have.attr", "value", "");
  cy.get("input[name=documentTypeId]").should("have.attr", "value", "");
  cy.get("input[name=owner]").should("have.attr", "value", "");
  cy.get("input[name=crId]").should("have.attr", "value", "");
  cy.get("input[name=displayStatus]").should("have.attr", "value", "");
  cy.get("input[name=effectiveDate]").should("have.attr", "value", "");
});

Cypress.Commands.add("dlVerifyDocCounter", (params: {docCounterNumber: integerType}) => {
  cy.get("[data-cy=numberOfDocuments]").should("have.text", params.docCounterNumber);
});

Cypress.Commands.add("dlVerifyDescriptionOnHover", (params: {description: string}) => {
  cy.get("div[aria-rowindex=1]>div.ReactVirtualized__Table__rowColumn:nth-child(3)>div>a>div>div")
    .trigger("mouseover");
  cy.get("div[role=tooltip]>div").should("have.text", params.description);
});
