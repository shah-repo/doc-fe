import { addScreenshotToContext } from "./screenshotsToContext";

export function Screenshot() {
  cy.screenshot();
  cy.once("test:after:run", (test, runnable) => {
    addScreenshotToContext(test, runnable);
  });
}
