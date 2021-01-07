// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../support/config";
import { USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
const companyAddress = `New Company Address ${Cypress.moment().format('X')}`;

context("FORM Field test", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
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
        password: "Tester1!",
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
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Autocomplete 'Company addresses' test", () => {
    context("Create 'Company addresses'", () => {
      it("Click on User menu button", () => {
        cy.get("[data-cy=\"UserMenuButton\"]").click();
      });

      it("Click on 'My Profile'", () => {
        cy.contains("My profile").click();
      });

      it("Click 'Add Addresses' button", () => {
        cy.get("#EditRemoveAddFields-add").click();
      });

      it("Enter New Address " + companyAddress, () => {
        cy.get("[placeholder=\"New Address\"]").type(companyAddress);
      });

      it("Click 'DONE' button", () => {
        cy.get("#EditRemoveAddFields-done").click();
      });

      it("Close Profile dialog", () => {
        cy.get("#DialogContent-close").click();
      })
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

        context("Add form fields", () => {
          it("Add Autocomplete", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });
        })

        context("Fill in Autocomplete attributes", () => {
          it("Enter label 'test label'", () => {
            cy.fbEnterNameValue({ name:"label", value: "test label" });
          });

          it("Select 'Company addressess' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Company addresses{downarrow}{enter}");
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
            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil('.MuiDialog-root').find("[data-cy^=\"test-label-\"]").click();

            if(response.body.addresses.length > 0 ){
              cy.get(".MuiAutocomplete-popper ul li")
              .each(($li, index, $lis) => {
                expect($li).to.have.text(response.body.addresses[index]);
              })
              .then(($lis) => {
                expect($lis).to.have.length(response.body.addresses.length);
              })
             } else {
               cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
             }
          });
        });

        it("Verify created 'Company addresses' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", companyAddress);
        });
      });
    });
  });
});
