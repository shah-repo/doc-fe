// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { DOC_TYPE_GROUP } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { CONFIG } from "../../../support/config";
import { ClinicalProtocolDocType } from "../../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
const arTitle = `ApprovalRole${moment().format("X")}`;

context("Autocomplete 'Approval Roles' test", () => {
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
              {
                documentTypeName: "purchaseorder",
                documentTypeAcronym: "PO-",
                group: DOC_TYPE_GROUP.OTHER,
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

  context("Autocomplete 'Approval Roles' test", () => {
    context("Create 'Approval Roles' document", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'test title'", () => {
        cy.drEnterDocumentTitle({ name: "test title" });
      });

      it("Enter document description 'Approval Roles document description'", () => {
        cy.drEnterDocumentDescription({ description: "Approval Roles document description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Document Approval Matrix' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
      });

      it("Click Save button", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve and release FORM document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context("Create new 'Approval Roles'", () => {
      it("Click on 'New' button", () => {
        cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
      });

      it("Enter AR title 'test ar'", () => {
        cy.wait(1000);
        cy.drEnterDocumentTitle({ name: "test ar" });
      });

      it("Enter description 'test description'", () => {
        cy.drEnterDocumentDescription({ description: "test description" });
        cy.wait(2000);
      });

      it("Navigate to Approval Roles tab", () => {
        cy.drSelectApprovalRolesTab();
      });

      it("Click on 'Add Another Role' button", () => {
        cy.get("button[data-cy=\"form.builder.add.another.role\"]").arrowClick();
      });

      it("Enter Approval Role " + arTitle, () => {
        cy.get("[data-cy=\"name\"]").arrowType(arTitle);
      });

      it("Click on 'Add' button", () => {
        cy.wait(1000);
        cy.get("button[data-cy=\"common.add\"]").arrowClick();
      });

      it("Click on 'Create Document' button", () => {
        cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Click 'Add Approver' & 'confirm' button", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it("Reload company", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
      });
    });

    context("Add Autocomplete 'Approval Roles'", () => {
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

        it("Select 'Clinical Protocol' output document type", () => {
          cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
        });

        it("Click create a document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
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

          it("Select 'Approval Roles' as options", () => {
            cy.fbAutocompleteType({ autocompleteOption: "Approval Roles" });
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

      context("Verify Autocomplete 'Approval Roles'", () => {
        it("Verify autocomplete 'Approval Roles'", () => {
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/groups/approval_roles`,
            headers: {
              Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {

            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("[data-cy^=\"test-label-\"]").arrowClick();

            if (response.body.length > 0 ) {
              const roles = response.body;
              roles.forEach((role) => {
                cy.get("ul>li[role=option]").should("contain.text", role.name);
              });
              cy.get("ul>li[role=option]")
                .then(($lis) => {
                  expect($lis).to.have.length(response.body.length);
                });
            } else {
              cy.get(".MuiAutocomplete-popper").should("have.text", "No options");
            }
          });
        });

        it("Verify created 'Approval Roles' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", arTitle);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", 1);
        });
      });
    });
  });
});
