import { addScreenshotToContext } from "./screenshotsToContext";

export function Screenshot() {
  cy.once("test:after:run", (test, runnable) => {
    cy.screenshot();
    cy.log("SCREENSHOT")
    console.log("SCREENSHOT")
    addScreenshotToContext(test, runnable);
  });
}
