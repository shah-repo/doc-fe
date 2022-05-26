import { CONFIG } from "../support/config";

let rowsLength;
describe("Data Driven Testing Using Excel FIle", () => {
  before(() => {
    cy.task("parseXlsx", { file: "cypress/fixtures/test/excelData.xlsx", sheet: "Report Per Company" }).then((rows) => {
      rowsLength = rows.length;
      cy.writeFile("cypress/fixtures/test/xlsxData.json", { rows });
      console.log(rows);
    });
    cy.visit(CONFIG.FE_URL);
  });
  it("Data Driven: Register User", () => {
    cy.fixture("test/xlsxData").then((data) => {
      for ( let i = 0; i < rowsLength; i++) {
        cy.get(".btn-link").click();
        // eslint-disable-next-line no-loop-func
        cy.url().should("include", "/register").then(() => {
          cy.get("input[formcontrolname=\"firstName\"]").type(data.rows[i].firstName);
          cy.get("input[formcontrolname=\"lastName\"]").type(data.rows[i].lastName);
          cy.get("input[formcontrolname=\"username\"]").type(data.rows[i].username);
          cy.get("input[formcontrolname=\"password\"]").type(data.rows[i].password);
          cy.get(".btn-primary").click();
          cy.get("alert").should("have.text", data.rows[i].message);
        });
      }
    });
  });
});
