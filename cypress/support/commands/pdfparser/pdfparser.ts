
import { readFileSync } from "fs";
import path from "path";
import pdf from "pdf-parse";

export async function pdfparser({ directory, fileName }) {
  const parser = await pdf(readFileSync(path.join(directory, fileName)))
    .catch(function(error) {
      cy.log(error);
    });
  if (parser) {
    return (parser);
  }
  else {
    return null;
  }
}
