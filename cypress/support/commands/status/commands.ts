/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { CONFIG } from "../../config";

export { };


declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      status(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("status", () => {
  cy.visit(`${CONFIG.FE_URL}/status`);
});

