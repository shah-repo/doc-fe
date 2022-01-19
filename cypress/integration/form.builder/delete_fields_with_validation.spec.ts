// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("Field validations test", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Test Document Type",
                documentTypeAcronym: "TDT-",
                group: "OTHER",
                isQms: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create FORM document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'Validation FORM doucment'", () => {
      cy.drEnterDocumentTitle({ name: "Validation FORM doucment" });
    });

    it("Enter document description 'Validation FORM doucment description'", () => {
      cy.drEnterDocumentDescription({ description: "Validation FORM doucment description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Test Document Type' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    context("Add Radio Button", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewField();
      });

      it("Select Radio Button field", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
      });

      it("Add label Normal text field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Radio buttons" });
      });

      it("Add options to radio button", () => {
        cy.fbGroupOptions("option1", "option2");
      });

      it("Click add to add text field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add Text Field 1", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHidden();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
      });

      it("Add label Normal text field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Text field 1" });
      });

      it("Click on Validation tab", () => {
        cy.fbOpenValidation();
      });

      it("Mark as 'Required If'", () => {
        cy.get("[data-cy=\"fb-control-required_if:anotherfield,value\"]").arrowClick();
      });

      it(`Select required if radio button field`, () => {
        cy.get(`[data-cy="validators.required_if.name"]`).arrowType(`Radio buttons{downarrow}{enter}`);
      });

      it(`Type value as option1`, () => {
        cy.get("div[role=dialog] [value=option1]").arrowClick();
      });
      it("Click add to add text field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });
  });
});
