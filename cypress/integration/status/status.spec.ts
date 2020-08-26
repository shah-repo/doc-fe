/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { Screenshot } from "../../utils/context/screenshot";

context("Status", () => {
  it("[Screenshot] Status", () => {
    cy.status().then(() => {
      cy.wait(5000);
      Screenshot();
    });
  });
});
