// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../support/config";
import { USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let secondEmployee;
const approverEmail = USERS[10].email;
const approverName = USERS[10].name;

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
            importerEmail: USERS[5].email,
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
        it("Clicks on the close button", () => {
          cy.usrClickCloseDialogButton();
        });
        it("Checks if user is in the table", () => {
          cy.usrCheckIfUserIsCreated({ email: approverEmail });
        });
      });

      context("Enable Hello Sign", () => {
        it("Click on created user", () => {
          cy.contains(approverEmail).click();
        });
        it("Checks on 'Enable Hello Sign' button", () => {
          cy.contains("Enable Hello Sign").click();
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

        context("Add form fields", () => {
          it("Add Autocomplete", () => {
            cy.fbAddNewField();
            cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
          });
        });

        context("Fill in Autocomplete attributes", () => {
          it("Enter label 'test label'", () => {
            cy.fbEnterNameValue({ name: "label", value: "test label" });
          });

          it("Select 'Employees' as options", () => {
            cy.get("[data-cy=\"optionId\"]").type("Employees{downarrow}{enter}");
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

      context("Verify Autocomplete 'Employees'", () => {
        it("Verify autocomplete 'Employees'", () => {
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/employees?active=true`,
            headers: {
              Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {
            cy.wait(3000);
            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("[data-cy^=\"test-label-\"]").click();

            if (response.body.length > 0 ) {
              cy.get(".MuiAutocomplete-popper ul li")
                .each(($li, index, $lis) => {
                  expect($li).to.have.text(response.body[index].user.name);
                })
                .then(($lis) => {
                  expect($lis).to.have.length(response.body.length);
                });
            } else {
              cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
            }
          });
        });

        it("Verify created 'Employees' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", `${approverName}`);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", 6);
        });

        it("Verify Users name in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").eq(0).should("have.text", USERS[10].name);
          cy.get(".MuiAutocomplete-popper ul li").eq(1).should("have.text", USERS[1].name);
          cy.get(".MuiAutocomplete-popper ul li").eq(2).should("have.text", USERS[2].name);
          cy.get(".MuiAutocomplete-popper ul li").eq(3).should("have.text", USERS[3].name);
          cy.get(".MuiAutocomplete-popper ul li").eq(4).should("have.text", USERS[4].name);
          cy.get(".MuiAutocomplete-popper ul li").eq(5).should("have.text", USERS[5].name);
        });
      });
    });
  });
});
