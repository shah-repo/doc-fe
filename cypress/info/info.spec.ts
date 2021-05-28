/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../support/config";
import { addTestContext } from "../utils/context/addTestContext";
import { Screenshot } from "../utils/context/screenshot";

let ENV;

switch (CONFIG.FE_URL) {
  case "https://dev.enlil.io":
    ENV = "dev";
    break;
  case "https://demo.enlil.io":
    ENV = "demo";
    break;
  case "https://sandbox.enlil.io":
    ENV = "sandbox";
    break;
  case "https://enlil.io":
    ENV = "prod";
    break;
  case "https://prod2.enlil.io":
    ENV = "prod2";
    break;
  default:
    ENV = "unknown";
}

context("Server", () => {
  it("Info", () => {
    cy.intercept({ method: "GET", url: "/api/v1/remoteValidators/status" }).as("status");
    cy.visit(`${CONFIG.FE_URL}/status`);
    cy.wait("@status").its("response.statusCode").should("eq", 200);
    cy.get("[data-cy=\"status-frontend-branch\"]").should("exist");
    cy.get("[data-cy=\"status-backend-branch\"]").should("exist");
    cy.get("[data-cy=\"status-remote-js-validators-branch\"]").should("exist");
    cy.get("[data-cy=\"status-frontend-commit-hash\"]>td").eq(1)
      .invoke("text")
      .then((feCommit) => {
        cy.log(feCommit);
        addTestContext("feCommit", feCommit);
      });
    cy.get("[data-cy=\"status-backend-commit-hash\"]>td").eq(1)
      .invoke("text")
      .then((backendCommit) => {
        cy.log(backendCommit);
        addTestContext("backendCommit", backendCommit);
      });
    cy.get("[data-cy=\"status-remote-js-validators-commit-hash\"]>td").eq(1)
      .invoke("text")
      .then((remoteJSCommit) => {
        cy.log(remoteJSCommit);
        addTestContext("remoteJSCommit", remoteJSCommit);
      });
    cy.get("[data-cy=\"status-frontend-branch\"]>td").eq(1)
      .invoke("text")
      .then((feBranch) => {
        cy.log(feBranch);
        addTestContext("feBranch", feBranch);
      });
    cy.get("[data-cy=\"status-backend-branch\"]>td").eq(1)
      .invoke("text")
      .then((backendBranch) => {
        cy.log(backendBranch);
        addTestContext("backendBranch", backendBranch);
      });
    cy.get("[data-cy=\"status-remote-js-validators-branch\"]>td").eq(1)
      .invoke("text")
      .then((remoteJSBranch) => {
        cy.log(remoteJSBranch);
        addTestContext("remoteJSBranch", remoteJSBranch);
      });
    cy.get("[data-cy=\"status-frontend-date\"]>td").eq(1)
      .invoke("text")
      .then((feDate) => {
        cy.log(feDate);
        addTestContext("feDate", feDate);
      });
    cy.get("[data-cy=\"status-backend-date\"]>td").eq(1)
      .invoke("text")
      .then((backendDate) => {
        cy.log(backendDate);
        addTestContext("backendDate", backendDate);
      });
    cy.get("[data-cy=\"status-remote-js-validators-date\"]>td").eq(1)
      .invoke("text")
      .then((remoteJSDate) => {
        cy.log(remoteJSDate);
        addTestContext("remoteJSDate", remoteJSDate);
      });
    addTestContext("env", ENV);
    Screenshot();
  });

});
