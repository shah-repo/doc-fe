/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../support/config";
import { Screenshot } from "../utils/context/screenshot";

context("Server", () => {
  it("Info", () => {
    cy.authLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
    cy.wait(2000);
    cy.visit(`${CONFIG.FE_URL}/status`);
    cy.get("[data-cy=\"status-fe-branch\"]").should("exist");
    cy.get("[data-cy=\"status-be-branch\"]").should("exist");
    cy.get("[data-cy=\"status-remote-branch\"]").should("exist");
    Screenshot();
  });
});
