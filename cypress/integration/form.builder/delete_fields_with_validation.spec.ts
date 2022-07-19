// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("Field validations test", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

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
              TestDocumentType,
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

    it("Click create a document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    context("Add Radio Button", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewField();
      });

      it("Select Radio Button field", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      });

      it("Add label Radio buttons", () => {
        cy.fbEnterNameValue({ name: "label", value: "Radio buttons" });
      });

      it("Add options to radio button", () => {
        cy.fbGroupOptions("option1", "option2");
      });

      it("Click add to add Radio button group to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add Text Field 1", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      });

      it("Add label Text field 1", () => {
        cy.fbEnterNameValue({ name: "label", value: "Text field 1" });
      });

      it("Click on Validation tab", () => {
        cy.fbOpenValidation();
      });

      it("Mark as 'Required If'", () => {
        cy.get("[data-cy=\"fb-control-required_if:anotherfield,value\"]").arrowClick();
      });

      it(`Select required if radio button field`, () => {
        cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect(`Radio buttons`);
        cy.unClick();
      });

      it(`Click value option1`, () => {
        cy.get("input[value=option1]").first().arrowClick();
      });

      it("Click add to add text field 1 to form", () => {
        cy.fbAddNewFieldButton();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Add Checkbox", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
      });

      it("Select Checkbox group field", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      });

      it("Add label Checkbox field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Checkbox field" });
      });

      it("Add options to checkbox field", () => {
        cy.fbGroupOptions("option1", "option2");
      });

      it("Click add to add Checkbox field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add Text Field 2", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      });

      it("Add label Text field 2", () => {
        cy.fbEnterNameValue({ name: "label", value: "Text field 2" });
      });

      it("Click on Validation tab", () => {
        cy.fbOpenValidation();
      });

      it("Mark as 'Required If in'", () => {
        cy.get(`[name="validators.required_if_in"]`).arrowClick();
      });

      it(`Select required if in Checkbox field`, () => {
        cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect(`Checkbox field`);
        cy.unClick();
      });

      it(`Click value option1`, () => {
        cy.get("input[value=option1]").first().arrowClick();
      });

      it("Click add to add text field 2 to form", () => {
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Add Select field", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
      });

      it("Select Select field", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      });

      it("Add label Select field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Select field" });
      });

      it("Add options to Select field", () => {
        cy.fbGroupOptions("option1", "option2");
      });

      it("Click add to add Select field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add Text Field 3", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      });

      it("Add label Text field 3", () => {
        cy.fbEnterNameValue({ name: "label", value: "Text field 3" });
      });

      it("Click on Validation tab", () => {
        cy.fbOpenValidation();
      });

      it("Mark as 'Required with'", () => {
        cy.get(`[name="validators.required_with"]`).arrowClick();
      });

      it(`Select required with Select field`, () => {
        cy.get(`[data-cy="validators.required_with.name"]`).autocompleteSelect(`Select field`);
      });

      it("Click add to add Select field to form", () => {
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Add Autocomplete field", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
      });

      it("Select Autocomplete field", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      });

      it("Add label Autocomplete field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Autocomplete field" });
      });

      it("Select option Document revisions to Autocomplete field", () => {
        cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document revisions");
      });

      it("Click add to add Autocomplete field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add Text Field 4", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      });

      it("Add label Text field 4", () => {
        cy.fbEnterNameValue({ name: "label", value: "Text field 4" });
      });

      it("Click on Validation tab", () => {
        cy.fbOpenValidation();
      });

      it("Mark as 'Required without'", () => {
        cy.get(`[name="validators.required_without"]`).arrowClick();
      });

      it(`Select Required without Autocomplete field`, () => {
        cy.get(`[data-cy="validators.required_without.name"]`).autocompleteSelect(`Autocomplete field`);
      });

      it("Click add to add text field 4 to form", () => {
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Remove validations from text fields", () => {
      context("Remove validation from text field 1", () => {
        it("Click on Edit for Text field 1", () => {
          cy.get(`[data-cy="edit-schema-item"]`).eq(1).arrowClick({ force: true });
        });

        it("Open validation tab", () => {
          cy.fbOpenValidation();
        });

        it("Uncheck required if validator for Text field 1", () => {
          cy.get(`[name="validators.required_if"]`).arrowClick();
        });

        it("Click add to save changes", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Remove validation from text field 2", () => {
        it("Click on Edit for Text field 2", () => {
          cy.get(`[data-cy="edit-schema-item"]`).eq(3).arrowClick({ force: true });
        });

        it("Open validation tab", () => {
          cy.fbOpenValidation();
        });

        it("Uncheck required if in validator for Text field 2", () => {
          cy.get(`[name="validators.required_if_in"]`).arrowClick();
        });

        it("Click add to save changes", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Remove validation from text field 3", () => {
        it("Click on Edit for Text field 3", () => {
          cy.get(`[data-cy="edit-schema-item"]`).eq(5).arrowClick({ force: true });
        });

        it("Open validation tab", () => {
          cy.fbOpenValidation();
        });

        it("Uncheck required with validator for Text field 3", () => {
          cy.get(`[name="validators.required_with"]`).arrowClick();
        });

        it("Click add to save changes", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Remove validation from text field 4", () => {
        it("Click on Edit for Text field 4", () => {
          cy.get(`[data-cy="edit-schema-item"]`).eq(7).arrowClick({ force: true });
        });

        it("Open validation tab", () => {
          cy.fbOpenValidation();
        });

        it("Uncheck required with validator for Text field 4", () => {
          cy.get(`[name="validators.required_without"]`).arrowClick();
        });

        it("Click add to save changes", () => {
          cy.fbAddNewFieldButton();
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });
    });

    context("Delete text fields", () => {
      context("Delete text field 1", () => {
        it("Click remove on text field 1", () => {
          cy.get(`[data-cy="remove-schema-item"]`).eq(1).arrowClick({ force: true });
        });

        it("Verify no error is present", () => {
          cy.checkToastMessage({ exists: false });
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Delete text field 2", () => {
        it("Click remove on text field 2", () => {
          cy.get(`[data-cy="remove-schema-item"]`).eq(2).arrowClick({ force: true });
        });

        it("Verify no error is present", () => {
          cy.checkToastMessage({ exists: false });
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Delete text field 3", () => {
        it("Click remove on text field 3", () => {
          cy.get(`[data-cy="remove-schema-item"]`).eq(3).arrowClick({ force: true });
        });

        it("Verify no error is present", () => {
          cy.checkToastMessage({ exists: false });
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Delete text field 4", () => {
        it("Click remove on text field 4", () => {
          cy.get(`[data-cy="remove-schema-item"]`).eq(4).arrowClick({ force: true });
        });

        it("Verify no error is present", () => {
          cy.checkToastMessage({ exists: false });
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });
    });

    context("Delete radio button, checkbox, select and autocomplete fields", () => {
      context("Delete radio button", () => {
        it("Click remove on radio button", () => {
          cy.get(`[data-cy="remove-schema-item"]`).eq(0).arrowClick({ force: true });
        });

        it("Verify no error is present", () => {
          cy.checkToastMessage({ exists: false });
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Delete Checkbox", () => {
        it("Click remove on Checkbox", () => {
          cy.get(`[data-cy="remove-schema-item"]`).eq(0).arrowClick({ force: true });
        });

        it("Verify no error is present", () => {
          cy.checkToastMessage({ exists: false });
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Delete Select field", () => {
        it("Click remove on Select field", () => {
          cy.get(`[data-cy="remove-schema-item"]`).eq(0).arrowClick({ force: true });
        });

        it("Verify no error is present", () => {
          cy.checkToastMessage({ exists: false });
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Delete Autocomplete", () => {
        it("Click remove on Autocomplete field", () => {
          cy.get(`[data-cy="remove-schema-item"]`).eq(0).arrowClick({ force: true });
        });

        it("Verify no error is present", () => {
          cy.checkToastMessage({ exists: false });
        });

        it("Save form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });
    });
  });
});
