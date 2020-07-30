import { addScreenshotToContext } from "./screenshotsToContext";

export function Screenshot() {
  cy.screenshot();
  cy.once("test:after:run", (attributes, test) => {
    addScreenshotToContext(attributes, test, "Screenshot");
  });
}
