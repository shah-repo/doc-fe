
import { readFileSync } from "fs";
import path from "path";
import pdf from "pdf-parse";

export async function pdfparser({ directory, fileName }) {
  let returnValue = null;
  const parser = await pdf(readFileSync(path.join(directory, fileName)))
    .catch(function(error) {
      cy.log(error);
    });
  if (parser) {
    returnValue = parser;
  }
  return returnValue;
}
