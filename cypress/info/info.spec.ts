/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../support/config";
import { Screenshot } from "../utils/context/screenshot";

context("Server", () => {
  it("Info", () => {
    cy.viewport(800, 800 * 1.7);
    cy.authLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
    cy.wait(2000);
    cy.visit(`${CONFIG.FE_URL}/status`);
    cy.wait(1000);
    Screenshot({ scale: true });
  });
});
