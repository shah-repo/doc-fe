
import { readFileSync } from "fs";

const pdf = require("pdf-parse");

export async function pdfparser({ path, file }) {
  let returnValue = null;
  const parser = await pdf(readFileSync(path + "/" + file))
    .catch(function(error) {
      cy.log(error);
    });
  if (parser) {
    returnValue = parser;
  }
  return returnValue;
}
