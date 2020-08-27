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
    cy.visit(`${CONFIG.FE_URL}/status`);
    cy.wait(5000);
    cy.viewport(1024 * 2, 768 * 2);
    Screenshot();
  });
});
