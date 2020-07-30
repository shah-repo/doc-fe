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
import "cypress-promise/register";
import "cypress-xpath";
import { addScreenshotToContext } from "../utils/context/screenshotsToContext";
import "./commands";
import "./commands/approver.request.list/commands";
import "./commands/attachments/commands";
import "./commands/auth/commands";
import "./commands/change.request/commands";
import "./commands/company/commands";
import "./commands/document.list/commands";
import "./commands/document.revision/commands";
import "./commands/filters/commands";
import "./commands/form.builder/commands";
import "./commands/group.management/commands";
import "./commands/navigation/commands";
import "./commands/purchase.order/commands";
import "./commands/user.management/commands";
import { CONFIG } from "./config";
// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on("uncaught:exception", (err, runnable) => {
  const socketIsClosingError =
    err.message.includes("The following error originated from your application code, not from Cypress") &&
    err.message.includes("Socket is closing");

  if (socketIsClosingError) {
    // eslint-disable-next-line no-console
    console.log("Ignoring 'Socket is closing' error");
    return false;
  }
  return true;
});


// console.log({"CONFIG.SCREENSHOT_OF_RUN_FAILURE": CONFIG.SCREENSHOT_OF_RUN_FAILURE})
Cypress.Screenshot.defaults({
  capture: "viewport",
  scale: false,
  disableTimersAndAnimations: true,
  screenshotOnRunFailure: CONFIG.SCREENSHOT_OF_RUN_FAILURE,
});


Cypress.on("test:after:run", (test, runnable: any ) => {
  if (CONFIG.SCREENSHOT_OF_RUN_FAILURE && test.state === "failed") {
    addScreenshotToContext(test, runnable);
  }
});


