/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../support/config";
import { Screenshot } from "../utils/context/screenshot";

context("Server", () => {
  it("Info", () => {
    cy.authLogin({
      email: CONFIG.SUPERADMIN_EMAIL,
      password: CONFIG.SUPERADMIN_PASSWORD,
    });
    cy.intercept({ method: "GET", url: "/api/v1/remoteValidators/status" }).as("status");
    cy.visit(`${CONFIG.FE_URL}/status`);
    cy.wait("@status").its("response.statusCode").should("eq", 200);
    cy.get("[data-cy=\"status-frontend-branch\"]").should("exist");
    cy.get("[data-cy=\"status-backend-branch\"]").should("exist");
    cy.get("[data-cy=\"status-remote-js-validators-branch\"]").should("exist");
    Screenshot();
  });
});
