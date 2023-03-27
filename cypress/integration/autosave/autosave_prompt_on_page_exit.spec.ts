// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLogin;

context("Autosave on leaving page while data is still not saved", () => {
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
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              TestDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLogin = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login admin with autosave tigger shown", (done: any) => {
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLogin.id });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Create 'Form' document with output document type 'Test Document Type'", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Test Document Type' output document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Add TextField", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Create new document from 'Form'", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Type 'Test' inside title field", () => {
      cy.cmpTurnOffAutosave();
      cy.drEnterDocumentTitle({ name: "Test" });
    });


    it("Navigate to document list and wait for pop-up to prompt for unsaved changes then click 'Cancel'", () => {
      cy.navigToDocumentListWithUnsavedChanges({ confirmPopup: false });
    });

    it("Type 'Test description' inside description field", () => {
      cy.drEnterDocumentDescription({ description: "Test description" });
    });

    it("Navigate to document list and wait for pop-up to prompt for unsaved changes then click 'Cancel'", () => {
      cy.navigToDocumentListWithUnsavedChanges({ confirmPopup: false });
    });

    it("Save document", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Navigate to document list and check if pop-up for unsaved data is not prompted", () => {
      cy.navigToDocumentList();
      let called = false;

      cy.on("window:confirm", (message) => {
        expect(message).to.equal("Are you sure you want to leave? You have unsaved changes.");
        called = true;
      });

      cy.wrap(null).should(() => {
        expect(called).to.be.false;
      });
    });

    it("Click on created 'Draft' document and check if data is saved", () => {
      cy.drFilterDocListByNameAndStatus({ title: "Test", status: "Draft" });
      cy.cmpTurnOnAutosave();
      cy.get("[id='field-name']").contains("Test");
      cy.get("[data-cy='description']").contains("Test description");
    });

    it("Click on navigation while document is being saved", () => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
        req.reply((res) => {
          res.setDelay(10000);
          res.setThrottle(10);
        });
      }).as("response");

      cy.drEnterDocumentTitle({ name: "Testing" });
      cy.unClick();
      cy.get("[role=progressbar]").should("exist");
      cy.navigToDocumentList();
      cy.on("window:confirm", (txt) => {
        expect(txt).to.equal("Are you sure you want to leave? You have unsaved changes.");
      });

      cy.wait("@response", { requestTimeout: 60000, responseTimeout: 60000 });
    });
  });

  // Uncomment when ENC-7499 is done
  // context("Turn off autosave, edit feild and check if pop up is prompted", () => {
  //   it("Turn off autosave", () => {
  //     cy.cmpTurnOffAutosave();
  //   });

  //   it("Select created document", () => {
  //     cy.drFilterDocListByNameAndStatus({ title: "Test", status: "Draft" });
  //   });

  //   it("Enter value for custom text field", () => {
  //     cy.get("[name^=fb-textfield-]").arrowType("Test disabled autosave");
  //   });

  //   it("Navigate to document list and check if pop-up for unsaved data is prompted", () => {
  //     cy.navigToDocumentList();
  //     let called = false;

  //     cy.on("window:confirm", (message) => {
  //       expect(message).to.equal("Are you sure you want to leave? You have unsaved changes.");
  //       called = true;
  //     });

  //     cy.wrap(null).should(() => {
  //       expect(called).to.be.true;
  //     });
  //   });
  // });

  context("Edit custom feild, manually save and check if pop up is not prompted", () => {
    it("Select created document", () => {
      cy.drFilterDocListByNameAndStatus({ title: "Test", status: "Draft" });
    });

    it("Enter value for custom text field", () => {
      cy.get("[name^=fb-textfield-]").arrowType("Test edit field second time");
      cy.unClick();
      cy.saveBarShouldNotExist();
    });

    it("Save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Navigate to document list and check if pop-up for unsaved data is not prompted", () => {
      cy.navigToDocumentList();
      let called = false;

      cy.on("window:confirm", (message) => {
        expect(message).to.equal("Are you sure you want to leave? You have unsaved changes.");
        called = true;
      });

      cy.wrap(null).should(() => {
        expect(called).to.be.false;
      });
    });
  });
});


export { };

