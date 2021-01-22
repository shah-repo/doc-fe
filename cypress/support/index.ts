// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "cypress-file-upload";
import "cypress-localstorage-commands";
import "cypress-promise/register";
import "cypress-xpath";
import { addScreenshotToContext } from "../utils/context/screenshotsToContext";
import "./commands";
import "./commands/approval.request/commands";
import "./commands/approver.request.list/commands";
import "./commands/attachments/commands";
import "./commands/auth/commands";
import "./commands/company/commands";
import "./commands/document.list/commands";
import "./commands/document.revision/commands";
import "./commands/engineering.build/commands";
import "./commands/filters/commands";
import "./commands/form.builder/commands";
import "./commands/group.management/commands";
import "./commands/imap/commands";
import "./commands/navigation/commands";
import "./commands/parts.materials/commands";
import "./commands/purchase.order/commands";
import "./commands/receivable/commands";
import "./commands/records/commands";
import "./commands/status/commands";
import "./commands/suppliers/commands";
import "./commands/user.management/commands";
import { CONFIG } from "./config";
// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on("uncaught:exception", (err, runnable) => {
  const socketIsClosingError =
    err.message.includes("The following error originated from your application code, not from Cypress") &&
    err.message.includes("Socket is clos");

  if (socketIsClosingError) {
    // eslint-disable-next-line no-console
    console.log("Ignoring 'Socket is closed' or 'Socket is closing' error");
    return false;
  }

  if (err.message.includes("Connection was closed abnormally")) {
    // eslint-disable-next-line no-console
    console.log("Ignoring 'Connection was closed abnormally' error");
    return false;
  }
  return true;
});

Cypress.Screenshot.defaults({
  capture: "viewport",
  scale: false,
  disableTimersAndAnimations: true,
  screenshotOnRunFailure: CONFIG.SCREENSHOT_OF_RUN_FAILURE,
});

Cypress.on("test:after:run", (test, runnable: any ) => {
  if (
    CONFIG.SCREENSHOT_OF_RUN_FAILURE &&
    test.state === "failed"
  ) {
    addScreenshotToContext(test, runnable, "Screenshot On Failure");
  }
});

before(() => {
  if (CONFIG.RUN_ENVIRONMENT === "pipeline") {
    const dir = `${CONFIG.DIR_SCREENSHOTS}/${Cypress.spec.name}`;
    cy.task("deleteScreenshotsFolder", dir);
    cy.task("deleteExistingReports", { reportDir: CONFIG.REPORTS_DIR, testName: Cypress.spec.name });

    it("Server has correct code deployed", () => {
      cy.visit(`${CONFIG.FE_URL}/status`, { timeout: 20 * 1000 });
      cy.get("[data-cy=\"status-frontend-commit-hash\"] td:nth-child(2)").should("have.text", CONFIG.COMMIT_FE);
      cy.get("[data-cy=\"status-backend-commit-hash\"] td:nth-child(2)").should("have.text", CONFIG.COMMIT_BE);
    });
  }
});

if (CONFIG.TAKE_SCREENSHOT_AFTER_EACH) {
  const oldIt = it;
  const foo = (title, callback) => {
    const hasDone = callback.length > 0;
    if (hasDone) {
      oldIt(title, (done) => {
        callback(() => {
          cy.once("test:after:run", (attributes, test) => {
            addScreenshotToContext(attributes, test, "Screenshot");
          });
          cy.screenshot().then(() => {
            done();
          });
        });
      } );
    } else {
      oldIt(title, () => {
        callback();
        cy.screenshot();
        cy.once("test:after:run", (attributes, test) => {
          addScreenshotToContext(attributes, test, "Screenshot");
        });
      }
      );
    }
  };
  it = foo.bind(oldIt) as unknown as Mocha.TestFunction;
}

export function PreventSkipOnFailure(this: Mocha.Context) {
  if (!this.test) {
    throw new Error(
      "this not binded correctly. " +
      "Callback in test case should not be arrow function.",
    );
  }
  (this.test as any).DontSkipOnFailure = true;
}

function skipTestIfNeeded(this: any, ...args) {
  cy.task("shouldSkip").then((value) => {
    if (value) { this.skip(); }
  });
}

function markFutureTestsForSkippingIfNeeded(this: any) {
  const { state, DontSkipOnFailure } = this.currentTest;
  if (!DontSkipOnFailure && state === "failed") {
    return cy.task("shouldSkip", true);
  }
}

if (CONFIG.SKIP_ON_RUN_FAILURE) {
  beforeEach(skipTestIfNeeded);
  afterEach(markFutureTestsForSkippingIfNeeded);
  before(() => {
    cy.task("resetShouldSkipFlag");
  });
}
