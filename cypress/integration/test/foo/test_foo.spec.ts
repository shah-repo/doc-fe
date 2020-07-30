// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import path from "path";
import { CONFIG } from "../../../support/config";
import { Screenshot } from "../../../utils/context/screenshot";

// const runId = new Date().valueOf();
// let createdCompany;

context(`Test: foo ${path.basename(__filename)}`, () => {
   it("foo: Logs user in", () => {
    cy.authLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
    Screenshot()
  });
  it("foo the one which fails", () => {
    Screenshot()
    expect(CONFIG.SCREENSHOT_OF_RUN_FAILURE).to.eql(false)
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

