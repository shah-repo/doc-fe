// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../support/config";
import { CyRoutes } from "../../../support/routes";
import { ClinicalProtocolDocType } from "../../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
const approverEmail = USERS[10].email;
const approverName = USERS[10].name;

context("Autocomplete 'Employees' test", () => {
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
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Autocomplete 'Employees' test", () => {
    context("Create 'Employees'", () => {
      context("Start add a user flow", () => {
        it("Navigates to User management", () => {
          cy.usrNavigateToUserManagement();
        });

        it("Clicks on 'Add Employee'", () => {
          cy.usrClickAddEmployee();
        });
      });

      context("Fill in user attributes", () => {
        it("Enters e-mail", () => {
          cy.usrEnterEmail({ email: approverEmail });
        });

        it("Enters name", () => {
          cy.usrEnterName({ name: approverName });
        });
      });

      context("Create user", () => {
        it("Clicks the save button", () => {
          cy.usrClickSaveButton();
        });
      });

      context("Check if the user is created", () => {
        it("Checks if user is in the table", () => {
          cy.usrCheckIfUserIsCreated({ email: approverEmail });
        });
      });

      context("Enable Hello Sign", () => {
        it("Click on created user", () => {
          cy.usrClickEditUser({ name: approverName });
        });

        it("Checks on 'Enable Hello Sign' button", () => {
          cy.contains("Enable Hello Sign").arrowClick();
        });
        it("Close Popup", () => {
          cy.get("[role=\"dialog\"]").scrollTo("top");
          cy.get("#DialogContent-close").arrowClick();
        });
      });
    });

    context("Add Autocomplete 'Employees'", () => {
      context("Create FORM document", () => {
        it("Navigate to document list", () => {
          cy.navigToDocumentList();
        });

        it("Click create document", () => {
          cy.cmpClickCreateNewDocument();
        });

        it("Enter document title 'FORM document'", () => {
          cy.drEnterDocumentTitle({ name: "FORM document" });
        });

        it("Enter document description 'FORM document description'", () => {
          cy.drEnterDocumentDescription({ description: "FORM document description" });
        });

        it("Select 'Form' document type", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Select 'Component Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        it("Click create a document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        context("Add form fields", () => {
          it("Add Autocomplete", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
          });
        });

        context("Fill in Autocomplete attributes", () => {
          it("Enter label 'test label'", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label" });
          });

          it("Select 'Employees' as options", () => {
            cy.fbAutocompleteType({ autocompleteOption: "Employees" });
          });

          it("Click 'Add' button", () => {
            cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
              cy.fbAddNewFieldButton();
            });
          });
        });

        context("Preview FORM document", () => {
          it("Click Form Review", () => {
            cy.fbClickButton({ el: "FBWorkspace-clickView" });

          });
        });
      });

      context("Verify Autocomplete 'Employees'", () => {
        it("Verify created 'Employees' in the list", () => {
          cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
            .find("[data-cy^=\"test-label-\"]").arrowClick();
          cy.get(".MuiAutocomplete-popper ul li").should("contain", `${approverName}`);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", 6);
        });

        it("Verify Users names in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[10].name);
          cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[1].name);
          cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[2].name);
          cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[3].name);
          cy.get(".MuiAutocomplete-popper ul li").should("contain.text", USERS[4].name);
          cy.get(".MuiAutocomplete-popper ul li").should("contain.text", "Importer Admin");
        });
      });
    });
  });
});
