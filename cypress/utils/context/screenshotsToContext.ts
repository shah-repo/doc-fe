
import addContext from "mochawesome/addContext";
import { allowedCharacters } from "./constants";

export function addScreenshotToContext(test, runnable: any, title: string, hook?) {
  let item: any = runnable;
  const nameParts = [runnable.title];
  while (item.parent) {
    nameParts.unshift(item.parent.title);
    item = item.parent;
  }
  if (hook && hook.hookName) {
    nameParts.push(`${hook.hookName} hook`);
  }
  const fullTestName = nameParts.filter(Boolean).join(" -- ").replace(allowedCharacters, "");
  const screenshotPath =
    `screenshots/${Cypress.spec.name}/${fullTestName}${((!hook && test.state === "failed") ? " (failed).png" : ".png")}`
      .replace(/[ ]+/g, " ");

  addContext({ test }, { title, value: encodeURI(screenshotPath) });
}
