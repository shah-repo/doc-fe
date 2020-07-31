import { addScreenshotToContext } from "./screenshotsToContext";

export function Screenshot() {
  cy.screenshot();
  cy.once("test:after:run", (attributes, test) => {
    addScreenshotToContext(attributes, test, "Screenshot");
  });
}

export function HookCallbackForScreenshot(this: any) {
  // works only with test cases on the same level!!
  // Example:
  // afterEach(function() {
  //   HookCallbackForScreenshot.call(this);
  // });

  cy.screenshot();
  const r = this.runnable();
  cy.once("test:after:run", (attributes, test) => {
    addScreenshotToContext(attributes, test, "Screenshot", r);
  });
}
