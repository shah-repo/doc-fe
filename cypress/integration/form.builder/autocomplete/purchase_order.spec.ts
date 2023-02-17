// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../support/config";
import { ClinicalProtocolDocType } from "../../../utils/constants/documentTypes/clinicalProtocol";
import { PurchaseOrderTest } from "../../../utils/constants/documentTypes/purchaseOrder";
import { IMPORTER_USER, USERS } from "../../../utils/constants/users";
import { SystemRequirement } from "../../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let purchaseOrderNo;

context("Autocomplete 'Purchase Order' test", () => {
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
              PurchaseOrderTest,
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

  context("Autocomplete 'Purchase Order' test", () => {
    context("Create 'Purchase Order' document", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click create document", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter document title 'po title'", () => {
        cy.drEnterDocumentTitle({ name: "po title" });
      });

      it("Enter document description 'Purchase Order document description'", () => {
        cy.drEnterDocumentDescription({ description: "Purchase Order document description" });
      });

      it("Select 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Purchase Order test' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Purchase Order test" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release FORM document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
        cy.fbClickButton({ el: "updateRecord" });
      });
    });

    context("Create 'Purchase Order'", () => {
      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
      });

      it("Click on 'Create PO' button", () => {
        cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      });

      it("Get purchase order no", () => {
        cy.get("[data-cy=\"HeaderInfo-docId\"]").then((po) => { purchaseOrderNo = po.text(); });
      });

      it("Select 'Open' for PO status", () => {
        cy.poSelectPOStatus({ status: "Open" });
      });

      it("Enter description 'PO test'", () => {
        cy.drEnterDocumentDescription({ description: "PO test" });
      });

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        cy.progressBarShouldNotExist();
      });

      it("Save PO", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.progressBarShouldNotExist();
        cy.wait(2000);
      });

      it("Click 'Approve' button", () => {
        cy.poApproveWithoutApi();
        cy.wait(3000);
      });
    });

    context("Add Autocomplete 'Purchase Order'", () => {
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

          it("Select 'Purchase Order' as options", () => {
            cy.fbAutocompleteType({ autocompleteOption: "Purchase Order list" });
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

      context("Verify Autocomplete 'Purchase Order'", () => {
        it("Verify autocomplete 'Purchase Order list'", () => {
          cy.request({
            method: "GET",
            url: `${CONFIG.BE_URL}/api/v1/document_revisions?docTypeGroups%5B%5D=PO&status%5B%5D=RELEASED`,
            headers: {
              Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
            },
          }).then((response) => {

            cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
              .find("[data-cy^=\"test-label-\"]").arrowClick();

            if (response.body.length > 0 ) {
              const purchaseOrders = response.body;
              purchaseOrders.forEach((purchaseOrder) => {
                cy.get("ul>li[role=option]")
                  .should("contain.text",
                    `${purchaseOrder.document.docId} - rev ${purchaseOrder.displayRevision} - ${purchaseOrder.name}`);
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

        it("Verify created 'Purchase Order' in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("contain", purchaseOrderNo);
        });

        it("Verify count in the list", () => {
          cy.get(".MuiAutocomplete-popper ul li").should("have.length", 1);
        });
      });
    });
  });
});
