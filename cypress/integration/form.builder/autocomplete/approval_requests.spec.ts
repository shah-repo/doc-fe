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
const approvalRequestTitle = `ApprovalRequest${moment().format("X")}`;
let arDocCount = 0;
let initialArDocument;

context("Autocomplete 'Change orders' test", () => {
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

  context("Autocomplete 'Change orders' test", () => {
    context("Create 'Change orders'", () => {
      it("Navigate to document list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Change Order button", () => {
        cy.cmpClickCreateApprovalRequest();
      });

      it("Enter title AR title " + approvalRequestTitle, () => {
        cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
      });

      it("Enter description 'AR from New form template for change order'", () => {
        cy.arEnterApprovalRequestDescription({ description: "CR from New form template for change order" });
      });

      it("Click Create Change Order", () => {
        cy.arSaveApiCall();
      });

      it("Add first approver to change order on approver list", () => {
        cy.arAddApproverOnApproverList({ approver: USERS[2].email });
      });
    });

    context("Add Autocomplete 'Change orders'", () => {
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

          it("Select 'Change orders' as options", () => {
            cy.fbAutocompleteType({ autocompleteOption: "Change orders" });
          });

          it("Click 'Add' button", () => {
            cy.fbAddNewFieldButton();
          });

          it("Verify autocomplete is disabled in form edit mode", () => {
            cy.get("input[data-cy^=test-label]")
              .should("have.attr", "autocomplete", "off");
            cy.get("input[data-cy^=test-label]")
              .should("have.attr", "disabled");
          });
        });

        context("Preview FORM document", () => {
          it("Click Form Review", () => {
            cy.fbClickButton({ el: "FBWorkspace-clickView" });
          });
        });

        context("Get AR Doc count", () => {
          it("[API]Get AR", () => {
            cy.arGetArDocumentByName({
              sessionId: loginResponse.sessionId,
              employeeId: secondEmployee.id,
              name: "AR Form",
            }).then((response) => {
              initialArDocument = response;
              arDocCount = initialArDocument.length;
            });
          });
        });
      });

      context("Verify Autocomplete 'Change orders'", () => {
        it("Verify autocomplete 'Change orders'", () => {
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/change_requests`,
            headers: {
              Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {

            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("[data-cy^=\"test-label-\"]").arrowClick();

            if (response.body.length > 0 ) {
              const approvalRequests = response.body;
              approvalRequests.forEach((ar) => {
                cy.get("ul>li[role=option]").should("contain.text", ar.crId);
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

        it("Verify created 'Change orders' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", approvalRequestTitle);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", (arDocCount + 1));
        });
      });
    });
  });
});
