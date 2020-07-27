
import addContext from "mochawesome/addContext";

export function addScreenshotToContext(test, runnable: any) {
  // const allowedCharacters = /[^a-zA-Z0-9.;\[\]{}()!@#$%^&_\-=+,. ']/g;

  let item: any = runnable
  const nameParts = [runnable.title]
  while (item.parent) {
    nameParts.unshift(item.parent.title)
    item = item.parent
  }
  if(runnable.hookName) {
    nameParts.push(`${runnable.hookName} hook`)
    }
  const fullTestName = nameParts.filter(Boolean).join(' -- ')//.replace(allowedCharacters, "")
  const screenshotPath = 
    `screenshots/${fullTestName}${((test.state === 'failed') ? " (failed).png" : ".png")}`
    .replace("  "," ");

  addContext({ test }, { title: "Screenshot", value: encodeURI(screenshotPath) });
}
