/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

const groupName = "Test_record group";

context("Check inline approval Record flow", () => {
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
    it("[API]Create company", (done: any) => {
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
              RecordOne,
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
        email: USERS[2].email,
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

  context("Create group and add members.", () => {
    context("Create 'Group'", () => {
      it("Navigate to Group Management", () => {
        cy.grpNavigateToGroupManagement();
      });

      it("Click 'Add Group'", () => {
        cy.fbClickButton({ el: "Group-openDialog" });
      });

      it("Select 'Official' radio button", () => {
        cy.grpSelectOfficial();
      });

      it("Enter Group Name " + groupName, () => {
        cy.grpEnterGroupName({ name: groupName });
      });

      it("Select Members", () => {
        cy.grpTypeMembers(USERS[1].name, USERS[2].name);
      });

      it("Click Save button", () => {
        cy.grpSaveGroup();
      });
    });
  });

  context("Create Record one with form", () => {
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
        cy.drEnterDocumentTitle({ name: "Inline records for title" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "first record description" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record One' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record one" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Open details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Check status should be Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("Add TextField", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Name" });
        cy.fbAddNewFieldButton();
      });

      it("Add Date picker with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "dp-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "dp-wi-ch" } );
      });

      it("Add Inline Approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.listLoadingElementShouldNotExist();
        cy.fbEnterNameValue({ name: "label", value: "Inline Approval" });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect(groupName);
      });

      it("verify groupname created.", () => {
        cy.get("[data-cy=\"editorConfig.groups\"]").parent().should("contain.text", groupName);
      });

      it("Save the form", () => {
        cy.fbAddNewFieldButton();
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Create Record one with form 1", () => {
    context("Start document creation flow 1", () => {
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

    context("Fill in document attributes 1", () => {
      it("Enters title", () => {
        cy.drEnterDocumentTitle({ name: "Inline records for title 1" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "first record description 1" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'Record One' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record one" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Open details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add TextField", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "Name" });
        cy.fbAddNewFieldButton();
      });

      it("Add Date picker with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "dp-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "dp-wi-ch" } );
      });

      it("Add Inline Approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.listLoadingElementShouldNotExist();
        cy.fbEnterNameValue({ name: "label", value: "Inline Approval" });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect(groupName);
      });

      it("verify groupname created.", () => {
        cy.get("[data-cy=\"editorConfig.groups\"]").parent().should("contain.text", groupName);
      });

      it("Save the form", () => {
        cy.fbAddNewFieldButton();
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Create record", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Click on 'Create a record' button", () => {
      cy.ptClickCreateNewPart();
    });

    it("Clicks on 'Record One' type", () => {
      cy.recSelectRecordFormFromMultiSelect({
        recordType: "Record one",
        recordForm: "Inline records for title",
      });
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Check status should be Draft", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify inline approver Group displayed", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").arrowClick();
      cy.get(".MuiAutocomplete-listbox").should("contain.text", groupName);
    });

    it("Select inline approver members", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
      cy.get("[data-cy^=fb-ia-inline-approval-]").eq(0).autocompleteSelect(`${USERS[2].name}`);
    });

    it("Verify inline approver members", () => {
      cy.get("[data-cy^=fb-ia-inline-approval-]").parent().should("contain", `${USERS[1].name}`);
      cy.get("[data-cy^=fb-ia-inline-approval-]").parent().should("contain", `${USERS[2].name}`);
    });
  });
});
