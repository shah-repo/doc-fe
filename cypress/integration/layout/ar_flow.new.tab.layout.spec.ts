// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";

context("Approval request form", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response: any) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response: any) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create new AR form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Approval request form template'", () => {
      cy.drEnterDocumentTitle({ name: approvalRequestFormName });
    });

    it("Enter description 'New form template for approval request'", () => {
      cy.drEnterDocumentDescription({ description: "New form template for approval request" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Approval request' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Document tab", () => {
      cy.drSelectDocumentTab();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("1", "2", "3");
      cy.get("button[data-cy='fb-editor-mode-validation-1']").arrowClick();
      cy.get("[data-cy='fb-control-required']").arrowClick();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.get("button[data-cy='fb-editor-mode-validation-1']").arrowClick();
      cy.get("input[value^='visibility']").check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
      cy.get(`input[type="checkbox"][value="3"]`).first().check();
      cy.get("button[data-cy='fb-editor-actions-add']").first().contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify `Approval request form`", () => {
    it("Verify Form for Approval request has two tabs Change Details and Documents", () => {
      cy.verifyTabs("changedetails", "documents");
    });

    context("Verify that Change details tab should be opened by default and that contains`", () => {
      it("predefine schema fields except Approval request details", () => {
        cy.verifyPredefiendFields();
      });

      it("Verify FB fields added to AR form ", () => {
        cy.get("[data-cy^='text-field']").should("exist");
        cy.get("[data-cy='Checkbox']").should("exist");
        cy.get("[data-cy='fb.add.document']").should("exist");

      });

      it("Verify that Form Options should appear on the Change Details Tab", () => {
        cy.get(".formOptionsBox").should("exist");
      });
    });

    context("Verify that predefined fields for Document tab`", () => {
      it("Navigate to document tab", () => {
        cy.drSelectDocumentTab();
      });

      it("Verify that predefined fields for Document tab is only Approval request details", () => {
        cy.get("[data-cy='fb.add.document']").should("exist");
      });

      it("Verify FB fields added to AR form ", () => {
        cy.get("[name^=checkbox]").should("exist");
        cy.get("[data-cy^=text-field-]").should("exist");
      });

      it("Verify that Form Options should appear on the Change Details Tab", () => {
        cy.get(".formOptionsBox").should("exist");
      });

      it("predefine schema fields for approvals (Approval Block)", () => {
        cy.get("[data-cy='fb.add.document']").should("exist");
      });

      it("Verify Click Documents Tab, clicking on it should open that tab and close the other one", () => {
        cy.get("[data-cy='tabCon-tabId.changedetails']").should("have.attr", "aria-selected", "false");
        cy.get("#sm-tabpanel-0").should("be.hidden");
        cy.get("[data-cy='tabCon-tabId.documents']").should("have.attr", "aria-selected", "true");
      });

      it("Verify that right side panel opens by default to the References tab", () => {
        cy.get("[data-cy='References']").should("exist");
        cy.get("[data-cy='generalInfo']").should("be.visible");
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create approval request from released  form", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Choose newly AR Form template", () => {
      cy.arSelectARForm({ formTitle: approvalRequestFormName });
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.get("[data-cy='field-description']").click();
      cy.get("[data-cy='field-description']").arrowType("AR from New form template for approval request").wait(2000);
      cy.unClick();
    });

    it("Checkbox option 2 checked", () => {
      cy.get(`input[type="checkbox"][value="1"]`).last().check();
    });


    it("Click Create Approval Request", () => {
      cy.wrapWithWaitOnApiCalls(
        [], () => {
          cy.get("[data-cy='navigation.createChangeRequest']").arrowClick();
        });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add first Approver'", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[2].name });
    });

  });

  context("Validate Right Side Panel", () => {
    it("Verify It is expanded and collpased", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
    });

    it("Verify Reference Info form Info, Created Info", () => {
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      cy.get("[data-cy='common.revision']").parent().should("contain.text",
        moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
      cy.get("[data-cy='References-detail']").should("contain.text",
        moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
    });

    context("Check document history", () => {
      const history = [
        {
          owner: USERS[1].name,
          actions: [
            { key: "Approver Added", value: `${USERS[2].name}` },
          ],
        },
      ];
      it("Verify Doc history", () => {
        cy.drSelectHistoryTab();
      });
      history.forEach((element, groupIndex) => {
        it(`Check owner name for group ${groupIndex + 1}`, () => {
          cy.get(`[data-cy="audit-owner-${groupIndex}"]`).should("have.text", element.owner);
        });
      });
    });

    context("Verify Book Mark", () => {
      it("Verify Book Mark Navigation", () => {
        cy.get("[data-cy='bookmark-icon']").arrowClick();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
      });
    });

  });

  context("Verify Created AR request layout", () => {
    it("Navigate to AR", () => {
      cy.navigToApprovalRequestList();
      cy.dlClearFilters();
    });

    it("Select the Records", () => {
      cy.dlFilterByDocId({ docId: "AR-00002" });
      cy.get("tr.k-master-row").first().arrowClick();
    });
  });

  context("Validate Right Side Panel", () => {

    it("Verify Reference tab Info", () => {
      cy.verifyReferenceTab({ user: USERS[1], formId: "", shortName: "GR" });
    });

    it("Verify Referenced By, Training ,and Release date Item exist or not", () => {
      cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
      cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      cy.get("[data-cy='common.revision']").parent().should("contain.text",
        moment().tz("America/Los_Angeles").format("YYYY.MM.DD"));
    });

    context("Check document history", () => {
      const history = [
        {
          owner: USERS[1].name,
          actions: [
            { key: "Approver Added", value: `${USERS[2].name}` },
          ],
        },
      ];
      it("Verify Doc history", () => {
        cy.drSelectHistoryTab();
      });
      history.forEach((element, groupIndex) => {
        it(`Check owner name for group ${groupIndex + 1}`, () => {
          cy.get(`[data-cy="audit-owner-${groupIndex}"]`).should("have.text", element.owner);
        });
      });
    });

    context("Verify Book Mark", () => {
      it("Verify Book Mark Navigation", () => {
        cy.get("[data-cy='bookmark-icon']").arrowClick();
        cy.get("[data-cy='Bookmarks-detail']").should("be.visible");
      });
    });
  });
});

export { };
