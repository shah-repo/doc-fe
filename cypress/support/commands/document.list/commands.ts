/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { integerType } from "aws-sdk/clients/iam";
import { CyRoutes } from "../../routes";

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
      dlSelectFirstDocument(): Chainable<Subject>;
      dlSelectFirstDocumentWithoutApi(): Chainable<Subject>;
      dlSelectFirstDocumentItem(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("dlVerifyDocIdIsPresentOnFirstDocument", () => {
  cy.get("tr.k-master-row").first().find("td").eq(0).should("not.be.empty");
});

Cypress.Commands.add("dlVerifyRevisionIsPresentOnFirstDocument", () => {
  cy.get("tr.k-master-row").first().find("td").eq(1).should("not.be.empty");
});

Cypress.Commands.add("dlVerifyTitleIsPresentOnFirstDocument", () => {
  cy.get("tr.k-master-row").first().find("td").eq(2).should("not.be.empty");
});

Cypress.Commands.add("dlVerifyTypeIsPresentOnFirstDocument", () => {
  cy.get("tr.k-master-row").first().find("td").eq(3).should("not.be.empty");
});

Cypress.Commands.add("dlVerifyOwnerIsPresentOnFirstDocument", () => {
  cy.get("tr.k-master-row").first().find("td").eq(4).should("not.be.empty");
});

Cypress.Commands.add("dlVerifyARIdIsPresentOnFirstDocument", () => {
  cy.get("tr.k-master-row").first().find("td").eq(5).should("not.be.empty");
});

Cypress.Commands.add("dlVerifyStatusIsPresentOnFirstDocument", () => {
  cy.get("tr.k-master-row").first().find("td").eq(6).should("not.be.empty");
});

Cypress.Commands.add("dlVerifyEffectiveDateIsPresentOnFirstDocument", () => {
  cy.get("tr.k-master-row").first().find("td").eq(7).should("not.be.empty");
});

Cypress.Commands.add("dlClearFilters", () => {
  cy.get("button[data-cy=clearFilter]").arrowClick();
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dlVerifyDocumentCount", (params: {numberOfDoc: integerType }) => {
  cy.get("tr.k-master-row").should("have.length", params.numberOfDoc);
});

Cypress.Commands.add("dlFilterByDocId", (params: {docId: string }) => {
  cy.get(`[aria-colindex="1"] .k-filtercell >input`).arrowType(params.docId).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dlVerifyFilterByDocId", (params: {docId: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", params.docId);
});

Cypress.Commands.add("dlFilterByRev", (params: {revision: string }) => {
  cy.get(`[aria-colindex="2"] .k-filtercell >input`).arrowType(params.revision).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dlVerifyFilterByRev", (params: {revision: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", params.revision);
});

Cypress.Commands.add("dlFilterByDocTitle", (params: {docTitle: string }) => {
  cy.get(`[aria-colindex="3"] .k-filtercell >input`).eq(0).arrowType(params.docTitle);
  cy.landingPageLoadingElementShouldAppear();
});

Cypress.Commands.add("dlVerifyFilterByDocTitle", (params: {docTitle: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(2).should("have.text", params.docTitle);
});

Cypress.Commands.add("dlFilterByType", (params: {type: string }) => {
  cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.type).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dlVerifyFilterByType", (params: {type: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", params.type);
});

Cypress.Commands.add("dlFilterByOwner", (params: {owner: string }) => {
  cy.get(`[aria-colindex="5"] .k-filtercell >input`).arrowType(params.owner).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dlVerifyFilterByOwner", (params: {owner: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(4).find("span").eq(0).should("have.text", params.owner);
});

Cypress.Commands.add("dlFilterByArId", (params: {arId: string }) => {
  cy.get(`[aria-colindex="6"] .k-filtercell >input`).arrowType(params.arId).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dlVerifyFilterByArId", (params: {arId: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", params.arId);
});

Cypress.Commands.add("dlFilterByStatus", (params: {status: string }) => {
  cy.get(`[aria-colindex="7"] [class="k-input"]`).scrollIntoView().arrowClick({ force: true });
  cy.get("li").contains(params.status).arrowClick({ force: true }).wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dlVerifyFilterByStatus", (params: {status: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", params.status);
});

Cypress.Commands.add("dlFilterByEffectiveDate", (params: {effectiveDate: string }) => {
  cy.get(`[aria-colindex="8"] [class="k-input"]`).arrowClick();
  cy.get("li").contains(params.effectiveDate).arrowClick().wait(500);
  cy.landingPageLoadingElementShouldNotExist();
});

Cypress.Commands.add("dlVerifyFilterByEffectiveDate", (params: {effectiveDate: string }) => {
  cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", params.effectiveDate);
});

Cypress.Commands.add("dlVerifyFilterClear", () => {
  cy.get(`[aria-colindex="1"] .k-filtercell >input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="2"] .k-filtercell >input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="3"] .k-filtercell >input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="4"] [class="k-input"]`).should("have.text", "All");
  cy.get(`[aria-colindex="5"] .k-filtercell >input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="6"] .k-filtercell >input`).should("have.attr", "value", "");
  cy.get(`[aria-colindex="7"] [class="k-input"]`).should("have.text", "All");
  cy.get(`[aria-colindex="8"] [class="k-input"]`).should("have.text", "All");
});

function getListItemNumber(text: string) {
  const elementText = text;
  const numberOfItems = elementText.match(/\d{1,2}/g);

  return numberOfItems ? numberOfItems?.pop() : "error";
}

Cypress.Commands.add("dlVerifyDocCounter", (params: {docCounterNumber: integerType}) => {
  cy.get("div.k-pager-info").then(($el) => {
    cy.wrap({ getListItemNumber }).invoke("getListItemNumber", $el.text())
      .should("eq", params.docCounterNumber.toString());
  });
});

Cypress.Commands.add("dlVerifyDescriptionOnHover", (params: {description: string}) => {
  cy.get("tr.k-master-row>td").eq(2)
    .trigger("mouseover");
  cy.get("div[role=tooltip]>div").should("have.text", params.description);
});

Cypress.Commands.add("dlSelectFirstDocument", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
    cy.get("tr.k-master-row").first().arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("dlSelectFirstDocumentWithoutApi", () => {
  cy.get("tr.k-master-row").first().arrowClick();
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("dlSelectFirstDocumentItem", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
    cy.get("tr.k-master-row").first().children("td").first().arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
  cy.progressBarShouldNotExist();
});
