// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

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
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
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

    context("Add normal textfield", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewField();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
      });

      it("Add label Normal text field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Normal text field" });
      });

      it("Click add to add text field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add required textfield", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHidden();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
      });

      it("Add label required text field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Required text field" });
      });

      it("Select validation in add field dialog", () => {
        cy.get("button[data-cy^=\"fb-editor-mode-validation\"]").click();
      });

      it("Select required_with on default validation", () => {
        cy.get("[name=\"validators.required_with\"]").click();
      });

      it("Select normal text field as required with validatior", () => {
        cy.get("input[data-cy=\"validators.required_with.name\"]").click();
        cy.get("ul[role=listbox]>li").contains("Normal text field").click();
      });

      it("Click add to add text field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add show/hide textfield", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHidden();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
      });

      it("Add label required text field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Show/hide text field" });
      });

      it("Select validation in add field dialog", () => {
        cy.get("button[data-cy^=\"fb-editor-mode-validation\"]").click();
      });

      it("Select show/hide type of validation", () => {
        cy.get("input[value^=\"visibility\"]").check();
        cy.wait(1000);
      });

      it("Select required_with on show/hide validation", () => {
        cy.get("[name=\"validators.required_with\"]").click();
      });

      it("Select normal text field as required with validator", () => {
        cy.get("input[data-cy=\"validators.required_with.name\"]").click();
        cy.get("ul[role=listbox]>li").contains("Normal text field").click();
      });

      it("Click add to add text field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Add enable/disable textfield", () => {
      it("Click Add a Field", () => {
        cy.fbAddNewFieldWhenHidden();
      });

      it("Select Text field", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
      });

      it("Add label Enable/disable text field", () => {
        cy.fbEnterNameValue({ name: "label", value: "Enable/disable text field" });
      });

      it("Select validation in add field dialog", () => {
        cy.get("button[data-cy^=\"fb-editor-mode-validation\"]").click();
      });

      it("Select Enable/disable type of validation", () => {
        cy.get("input[value=\"disabled\"]").check();
        cy.wait(1000);
      });

      it("Select required_with on Enable/disable validation", () => {
        cy.get("[name=\"validators.required_with\"]").click();
      });

      it("Select normal text field as required with validator", () => {
        cy.get("input[data-cy=\"validators.required_with.name\"]").click();
        cy.get("ul[role=listbox]>li").contains("Normal text field").click();
      });

      it("Click add to add text field to form", () => {
        cy.fbAddNewFieldButton();
      });
    });

    context("Create and release FORM doucment", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });

      it("Verify revision status is 'Revision 1  - Released'", () => {
        cy.drVerifyFirstDocumentRevisionList({ revision: "Revision 1  - Released" });
      });
    });
  });

  context("Create document from form to test validations", () => {
    it("Click create new from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter document title 'Validation doucment'", () => {
      cy.drEnterDocumentTitle({ name: "Validation doucment" });
    });

    it("Enter document description 'Validation doucment description'", () => {
      cy.drEnterDocumentDescription({ description: "Validation doucment description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    context("Check required textfield", () => {
      it("Verify field is not required when Normal text field is empty", () => {
        SystemRequirement("FB-0210");
        cy.get("[data-cy^=required-text-field]").parent().parent().find("p")
          .should("not.exist");
      });

      it("Insert text in Normal text field", () => {
        SystemRequirement("FB-0210");
        cy.get("[name^=normal-text-field]").type("test required text field");
      });

      it("Verify field is required when Normal text field is empty", () => {
        SystemRequirement("FB-0210");
        cy.get("[data-cy^=required-text-field]").parent().parent().find("p")
          .should("have.text", "The Required text field field is required when Normal text field is not empty.");
      });

      it("Clear text in Normal text field", () => {
        cy.get("[name^=normal-text-field]").clear();
      });
    });

    context("Check show/hide textfield", () => {
      it("Verify field is not visible when Normal text field is empty", () => {
        SystemRequirement("FB-0210");
        cy.get("[data-cy^=show-hide-text-field]").should("not.exist");
      });

      it("Insert text in Normal text field", () => {
        SystemRequirement("FB-0210");
        cy.get("[name^=normal-text-field]").type("test show/hide text field");
      });

      it("Verify field is visible when Normal text field is empty", () => {
        SystemRequirement("FB-0210");
        cy.get("[data-cy^=show-hide-text-field]").parent().parent().find("p")
          .should("have.text", "The Show/hide text field field is required when Normal text field is not empty.");
      });

      it("Clear text in Normal text field", () => {
        SystemRequirement("FB-0210");
        cy.get("[name^=normal-text-field]").clear();
      });
    });

    context("Check enable/disable textfield", () => {
      it("Verify field is disabled when Normal text field is empty", () => {
        SystemRequirement("FB-0210");
        cy.get("[name^=enable-disable-text-field]").should("have.attr", "disabled");
      });

      it("Insert text in Normal text field", () => {
        SystemRequirement("FB-0210");
        cy.get("[name^=normal-text-field]").type("test enable/disable text field");
      });

      it("Verify field is not disabled when Normal text field is empty", () => {
        SystemRequirement("FB-0210");
        cy.get("[data-cy^=enable-disable-text-field]").parent().parent().find("p")
          .should("have.text", "The Enable/disable text field field is required when Normal text field is not empty.");
      });
    });
  });
});
