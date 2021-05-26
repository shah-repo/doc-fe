/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../support/config";
import { addTestContext } from "../utils/context/addTestContext";
import { Screenshot } from "../utils/context/screenshot";

let FE_COMMIT;
let BE_COMMIT;
let REMOTE_JS_COMMIT;

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
    cy.get("[data-cy=\"status-frontend-commit-hash\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        FE_COMMIT = text;
        cy.log(text);
        addTestContext("feCommit", FE_COMMIT);
      });
    cy.get("[data-cy=\"status-backend-commit-hash\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        BE_COMMIT = text;
        cy.log(text);
        addTestContext("backendCommit", BE_COMMIT);
      });
    cy.get("[data-cy=\"status-remote-js-validators-commit-hash\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        REMOTE_JS_COMMIT = text;
        cy.log(text);
        addTestContext("remoteJSCommit", REMOTE_JS_COMMIT);
      });
    Screenshot();
  });

});
