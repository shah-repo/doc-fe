import addContext from "mochawesome/addContext";

export function addTestContext(title, value) {
  cy.once("test:after:run", (test) => {
    addContext({ test }, { title, value });
  });
}
