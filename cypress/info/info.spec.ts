/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../support/config";
import { Screenshot } from "../utils/context/screenshot";

context("Server", () => {
  it("Info", () => {
    cy.server();
    cy.authLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
    cy.route({ method: "GET", url: "/api/v1/remoteValidators", status: 200 }).as("status");
    cy.visit(`${CONFIG.FE_URL}/status`);
    cy.wait("@status");
    cy.get("[data-cy=\"status-frontend-branch\"]").should("exist");
    cy.get("[data-cy=\"status-backend-branch\"]").should("exist");
    cy.get("[data-cy=\"status-remote-js-validators-branch\"]").should("exist");
    Screenshot();
  });
});
