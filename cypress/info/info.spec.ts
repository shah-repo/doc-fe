/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG, RUN_ENVIRONMENT_OPTIONS } from "../support/config";
import { addTestContext } from "../utils/context/addTestContext";
import { Screenshot } from "../utils/context/screenshot";

let env;
let feCommit;
let feBranch;
let feDate;

let beCommit;
let beBranch;
let beDate;

let remoteJSBranch;
let remoteJSCommit;
let remoteJSDate;

switch (CONFIG.FE_URL) {
  case "https://dev.enlil.io":
    env = "dev";
    break;
  case "https://demo.enlil.io":
    env = "demo";
    break;
  case "https://sandbox.enlil.io":
    env = "sandbox";
    break;
  case "https://enlil.io":
    env = "prod";
    break;
  case "https://prod2.enlil.io":
    env = "prod2";
    break;
  default:
    env = "unknown";
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
      .then((text) => {
        feCommit = text;
        addTestContext("feCommit", feCommit);
      });
    cy.get("[data-cy=\"status-backend-commit-hash\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        beCommit = text;
        addTestContext("backendCommit", beCommit);
      });
    cy.get("[data-cy=\"status-remote-js-validators-commit-hash\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        remoteJSCommit = text;
        addTestContext("remoteJSCommit", remoteJSCommit);
      });
    cy.get("[data-cy=\"status-frontend-branch\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        feBranch = text;
        addTestContext("feBranch", feBranch);
      });
    cy.get("[data-cy=\"status-backend-branch\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        beBranch = text;
        addTestContext("backendBranch", beBranch);
      });
    cy.get("[data-cy=\"status-remote-js-validators-branch\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        remoteJSBranch = text;
        addTestContext("remoteJSBranch", remoteJSBranch);
      });
    cy.get("[data-cy=\"status-frontend-date\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        feDate = text;
        addTestContext("feDate", feDate);
      });
    cy.get("[data-cy=\"status-backend-date\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        beDate = text;
        addTestContext("backendDate", beDate);
      });
    cy.get("[data-cy=\"status-remote-js-validators-date\"]>td").eq(1)
      .invoke("text")
      .then((text) => {
        remoteJSDate = text;
        addTestContext("remoteJSDate", remoteJSDate);
      });
    addTestContext("env", env);
    Screenshot();
  });

  it("Add env info", () => {
    if (CONFIG.RUN_ENVIRONMENT === RUN_ENVIRONMENT_OPTIONS.PIPELINE ||
      CONFIG.RUN_ENVIRONMENT === RUN_ENVIRONMENT_OPTIONS.SCHEDULEDPIPELINE ||
      CONFIG.RUN_ENVIRONMENT === RUN_ENVIRONMENT_OPTIONS.LOCALPARALLEL) {
      const envInfo = {
        feBranch,
        feCommit,
        feDate,
        beBranch,
        beCommit,
        beDate,
        remoteJSBranch,
        remoteJSCommit,
        remoteJSDate,
        env,
      };
      cy.task("generateEnvInfo", { CONFIG, envInfo } );
    }
  });
});
