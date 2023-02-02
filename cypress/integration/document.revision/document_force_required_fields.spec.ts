// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let docId;

context("Document force required fields", () => {
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
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
        done();
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

  context("[API]Add employee to developers group", () => {
    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: adminSessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: employeeToDevs.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeToDevs.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("fill in output document type: Clinical Protocol", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Creates document", () => {
    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Document in Draft without title and description", () => {
    it(`Check if document status is ${STATUS_TYPES_LABEL.DRAFT} after creating a document`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      cy.get("[data-cy=\"HeaderInfo-docId\"]").then((x) => { docId = x.text(); });
    });

    it("title should be blank", () => {
      cy.get("[data-cy=\"field-name\"]").should("have.value", "");
    });

    it("description should be blank", () => {
      cy.get("[data-cy=\"description\"]").should("have.value", "");
    });
  });

  context("Uploads attachments and verify page not to scroll to top", () => {
    it("Uploads test_image.jpg", () => {
      cy.atchUploadAttachment({ fileName: "test_image.jpg" });
    });

    it("Check test_image.jpg attachment atributes", () => {
      cy.atchCheckAtributes({ fileName: "test_image.jpg", attributes: "79.54 kB JPG File" });
    });

    it("Verify the page is not auto scrolled to the top.", () => {
      cy.get("main").its("scrollY").should("not.equal", 0);
    });
  });

  context("Verify user is forced to fill required fields", () => {
    it("Click on 'Approve and release' button", () => {
      SystemRequirement("REQ-4890");
      cy.drApproveAndReleaseDocumentWithoutSelectingForm({ toastifyExists: true });
    });

    it("Verify title and description required message should be displayed", () => {
      cy.checkToastMessageContains({ message: "Title is required,Description is required" });
      cy.closeAllAlertMessages();
    });

    it("Close dialog box", () => {
      cy.drCloseApproveAndReleaseDialog();
    });

  });

  context("Verify filled fields of created document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by ID", () => {
      cy.drFilterDocListByDocIdAndStatus({ docId, status: "Draft" });
    });

    it("Verify filled fields data should be present", () => {
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Form");
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Clinical Protocol");
      cy.get("[data-cy=\"common.Numeric\"]").find("input").should("be.checked");
    });
  });

  context("Fill required fields and release the document", () => {
    it("Enter document title 'test title'", () => {
      cy.drEnterDocumentTitle({ name: "test title" });
    });

    it("Enter document description 'test description'", () => {
      cy.drEnterDocumentDescription({ description: "test description" });
    });

    it("Click 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Revise the document and modify fields", () => {
    it("Click 'Revise Document' button", () => {
      cy.drClickReviseDocument();
      cy.drClickSaveWithoutApiCall();
    });

    it("remove description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first().clear();
      cy.unClick();
    });

    it("remove title", () => {
      cy.get("[data-cy=\"field-name\"]").arrowClick().find("svg").arrowClick();
      cy.unClick();
    });

    it("Click 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Verify user is forced to fill required fields", () => {
    it("Click on 'Approve and release' button", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({ toastifyExists: true });
    });

    it("Verify title and description required message should be displayed", () => {
      cy.checkToastMessageContains({ message: "Title is required,Description is required" });
      cy.closeAllAlertMessages();
      cy.drCloseApproveAndReleaseDialog();
    });
  });

  context("Fill required fields and add fields to form", () => {
    it("Add TextField", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.fbAddNewFieldButton();
    });

    it("Add Text Editor", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbAddNewFieldButton();
    });

    it("Enter document title 'test title'", () => {
      cy.drEnterDocumentTitle({ name: "test title" });
    });

    it("Enter document description 'test description'", () => {
      cy.drEnterDocumentDescription({ description: "test description" });
    });

    it("Click 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Click on 'Approve and release' button", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Click 'Create New' button", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("Uploads attachments and verify page not to scroll to top", () => {
    it("Uploads test_image.jpg", () => {
      cy.atchUploadAttachment({ fileName: "test_image.jpg" });
    });

    it("Check test_image.jpg attachment atributes", () => {
      cy.atchCheckAtributes({ fileName: "test_image.jpg", attributes: "79.54 kB JPG File" });
    });

    it("Verify the page is not auto scrolled to the top.", () => {
      cy.get("main").its("scrollY").should("not.equal", 0);
    });
  });

  context("Enter fields values and page should not scroll", () => {
    it("Enter value in TextField", () => {
      cy.get("input[name^=fb-textfield-").arrowType("test");
    });

    it("Verify the page is not auto scrolled to the top.", () => {
      cy.get("main").its("scrollY").should("not.equal", 0);
    });
  });

  context("Verify user is forced to fill required fields", () => {
    it("Click on 'Approve and release' button", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi({ toastifyExists: true });
    });

    it("Verify title and description required message should be displayed", () => {
      cy.checkToastMessageContains({ message: "Title is required,Description is required" });
      cy.closeAllAlertMessages();
    });
  });
});

export { };

