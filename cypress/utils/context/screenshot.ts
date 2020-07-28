import { addScreenshotToContext } from "./screenshotsToContext";

export function Screenshot() {
  cy.screenshot();
  cy.log("SCREENSHOT")
  console.log("SCREENSHOT")
  cy.once("test:after:run", (test, runnable) => {
    addScreenshotToContext(test, runnable);
  });
}
