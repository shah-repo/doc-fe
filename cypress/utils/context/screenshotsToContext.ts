
import addContext from "mochawesome/addContext";
import { allowedCharacters } from "./constants";

export function addScreenshotToContext(test, runnable: any) {

  let item: any = runnable;
  const nameParts = [runnable.title];
  while (item.parent) {
    nameParts.unshift(item.parent.title);
    item = item.parent;
  }
  if (runnable.hookName) {
    nameParts.push(`${runnable.hookName} hook`);
  }
  const fullTestName = nameParts.filter(Boolean).join(" -- ").replace(allowedCharacters, "");
  const screenshotPath =
    `screenshots/${Cypress.spec.name}/${fullTestName}${((test.state === "failed") ? " (failed).png" : ".png")}`
      .replace(/[ ]+/g, " ");

  addContext({ test }, { title: "Screenshot", value: encodeURI(screenshotPath) });
}
