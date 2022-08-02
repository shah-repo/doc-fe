// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { CONFIG } from "../../../support/config";
import { ClinicalProtocolDocType } from "../../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
const companyAddress = `New Company Address ${moment().format("X")}`;

context("Autocomplete 'Company addresses' test", () => {
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
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
    });
  });

  context("Autocomplete 'Company addresses' test", () => {
    context("Create 'Company addresses'", () => {
      it("Click on User menu button", () => {
        cy.get("[data-cy=\"UserMenuButton\"]").arrowClick();
      });

      it("Click on 'My Profile'", () => {
        cy.contains("My profile").arrowClick();
      });

      it("Click 'Add Addresses' button", () => {
        cy.get("#EditRemoveAddFields-add").arrowClick();
      });

      it("Enter New Address " + companyAddress, () => {
        cy.get("[placeholder=\"New Address\"]").arrowType(companyAddress);
      });

      it("Click 'DONE' button", () => {
        cy.get("#EditRemoveAddFields-done").arrowClick();
      });

      it("Close Profile dialog", () => {
        cy.get("#DialogContent-close").arrowClick();
      });
    });

    context("Add Autocomplete 'Company addresses'", () => {
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

          it("Select 'Company addressess' as options", () => {
            cy.fbAutocompleteType({ autocompleteOption: "Company addresses" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });
        });

        context("Preview FORM document", () => {
          it("Click Form Review", () => {
            cy.fbClickButton({ el: "FBWorkspace-clickView" });
          });
        });
      });

      context("Verify Autocomplete 'Company addresses'", () => {
        it("Verify autocomplete 'Company addresses'", () => {
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/company/mine`,
            headers: {
              Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {

            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("[data-cy^=\"test-label-\"]").arrowClick();

            if (response.body.addresses.length > 0 ) {
              const addresses = response.body.addresses;
              addresses.forEach((address) => {
                cy.get("ul>li[role=option]")
                  .should("contain.text", address);
              });
              cy.get("ul>li[role=option]")
                .then(($lis) => {
                  expect($lis).to.have.length(response.body.addresses.length);
                });
            } else {
              cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
            }

          });
        });

        it("Verify created 'Company addresses' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", companyAddress);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", 1);
        });
      });
    });
  });
});
