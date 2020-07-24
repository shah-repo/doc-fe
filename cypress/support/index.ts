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
import addContext from "mochawesome/addContext";
import "./commands";
import "./commands/attachments/commands";
import "./commands/auth/commands";
import "./commands/change.request/commands";
import "./commands/company/commands";
import "./commands/document.revision/commands";
import "./commands/form.builder/commands";
import "./commands/group.management/commands";
import "./commands/navigation/commands";
import "./commands/purchase.order/commands";
import { CONFIG } from "./config";
// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
  const socketIsClosingError = 
    err.message.includes("The following error originated from your application code, not from Cypress") &&
    err.message.includes("Socket is closing");

  if(socketIsClosingError) {
    console.log("Ignoring 'Socket is closing' error");
    return false;
  }
  return true;
})


// Alternatively you can use CommonJS syntax:
// require('./commands')


// console.log({"CONFIG.SCREENSHOT_OF_RUN_FAILURE": CONFIG.SCREENSHOT_OF_RUN_FAILURE})
Cypress.Screenshot.defaults({
  capture: 'viewport',
  scale: false,
  disableTimersAndAnimations: true,
  screenshotOnRunFailure: CONFIG.SCREENSHOT_OF_RUN_FAILURE,
  // screenshotOnRunFailure: false,
  onBeforeScreenshot () {
    console.log("onBeforeScreenshot")
   },
  onAfterScreenshot () {
    console.log("onAfterScreenshot")
   },
});


Cypress.on('test:after:run', (test, runnable: any ) => {
  if (test.state === 'failed') {
    addScreenshotToContext(test, runnable);
    // let item: any = runnable
    // const nameParts = [runnable.title]
    // while (item.parent) {
    //   nameParts.unshift(item.parent.title)
    //   item = item.parent
    // }
    // if(runnable.hookName) {
    //   nameParts.push(`${runnable.hookName} hook`)
    //   }
    // const fullTestName = nameParts.filter(Boolean).join(' -- ').replace(allowedCharacters, "")
    // const screenshotPath = `screenshots/${Cypress.spec.name}/${fullTestName} (failed).png`.replace("  "," ")
  
    // // addContext({ test }, screenshotPath)
    // // addTestContext({ test }, { title: "Screenshot", value: "foo" });

    // // addContext({ test }, { title: "log", value: JSON.stringify({name: Cypress.spec.name, abs: Cypress.spec.absolute, rel: Cypress.spec.relative}) });
    // addContext({ test }, { title: "Screenshot", value: encodeURI(screenshotPath) });
  }
  })


  export function addScreenshotToContext(test, runnable: any) {
    const allowedCharacters = /[^a-zA-Z0-9.;\[\]{}()!@#$%^&_\-=+,. ']/g;

    let item: any = runnable
    const nameParts = [runnable.title]
    while (item.parent) {
      nameParts.unshift(item.parent.title)
      item = item.parent
    }
    if(runnable.hookName) {
      nameParts.push(`${runnable.hookName} hook`)
      }
    const fullTestName = nameParts.filter(Boolean).join(' -- ').replace(allowedCharacters, "")
    const screenshotPath = 
      `screenshots/${fullTestName}${((test.state === 'failed') ? " (failed).png" : ".png")}`
      .replace("  "," ");
 
    addContext({ test }, { title: "Screenshot", value: encodeURI(screenshotPath) });
  }
