// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../../support/config";
import { IMPORTER_USER, USERS } from "../../../../utils/constants/users";
// import { SystemRequirement } from "../../../../utils/context/systemRequirement";
import { RecordDocumentType } from "../../../../utils/constants/documentTypes/testTypes";

let createdCompany;
let loginResponse;
let recordUrl;

const recordTitle = "Record Title";

context("Inline Record notifications", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
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
            users: [USERS[2]],
            documentTypes: [
              RecordDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create form document for Record", () => {
    context("Start document creation flow", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Fill in document attributes", () => {
      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "Record Form" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "first record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Open details tab", () => {
          cy.drSelectDetailsTab();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add TextField", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "Name" });
          cy.fbAddNewFieldButton();
        });

        it("Add Inline Approval", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
          cy.listLoadingElementShouldNotExist();
          cy.fbEnterNameValue({ name: "label", value: "Inline Approval" });
          cy.get("[data-cy='editorConfig.groups']").autocompleteSelect("Everyone");
          cy.fbAddNewFieldButton();
        });

        it("Save the form", () => {
          cy.drClickCreateDocumentWithoutApiCallForForms();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wait(3000);
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wait(3000);
        });
      });
    });
  });

  context("Create new Record", () => {
    it("Create new record button click", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title", () => {
      cy.drEnterDocumentTitle({ name: recordTitle });
    });

    it("Enters description", () => {
      cy.drEnterDocumentDescription({ description: "Record description" });
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter name", () => {
      cy.get("[name^=name-]").arrowType("test");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Select approver", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").autocompleteSelect(`${USERS[2].name}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Save Record", () => {
      cy.url().then((url) => (recordUrl = url));
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Send request for approval", () => {
      cy.get("[data-cy='form.builder.request.approval']").arrowClick();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Login as User 2", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it(`User should see Record AR notification from User 1`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "RD-00003")
        .and("contain.text", recordTitle);
    });

    it("Reject Record AR", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });

    it("Refresh the page", () => {
      cy.reload();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("'To Do' tab should be empty as it was", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Resend the Record", () => {
    it("Open the Record", () => {
      cy.visit(recordUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Send request for approval", () => {
      cy.get("[data-cy='form.builder.request.approval']").arrowClick();
      cy.wait(5000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Login as User 2", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it(`User should see Record AR notification from User 1`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "RD-00003")
        .and("contain.text", recordTitle);
    });

    it("Approve Record AR", () => {
      cy.dashApproverFirstFromListWithoutApi();
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("User should get a notification that Record is pending for user approval", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "APPROVED")
        .and("contain.text", "RD-00003")
        .and("contain.text", recordTitle);
    });
  });
});

export { };
