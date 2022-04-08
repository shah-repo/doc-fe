/* eslint-disable @typescript-eslint/no-namespace */

import { CyRoutes } from "../../routes";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      verifyColumnSort(params: {columnIndex: string}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("verifyColumnSort", (params: { columnIndex: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
    cy.get(`th[aria-colindex=${params.columnIndex}] span.k-column-title`).arrowClick();
  });
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`th[aria-colindex=${params.columnIndex}] span.k-i-sort-asc-sm`).should("exist");
  cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
    cy.get(`th[aria-colindex=${params.columnIndex}] span.k-column-title`).arrowClick();
  });
  cy.landingPageLoadingElementShouldNotExist();
  cy.get(`th[aria-colindex=${params.columnIndex}] span.k-i-sort-desc-sm`).should("exist");
});

export { };
