// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const mpiOutputDocType = "Manufacturing Process Instructions";
const qpiOutputDocType = "Quantity Process Instructions Test";

context("Intermediate page validation", () => {
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
              QPITest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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

  context("Login company admin", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context(`Validate ${mpiOutputDocType} intermediate page`, () => {
    context("Navigate to document list", () => {
      it("Navigate to document list landing page", () => {
        cy.navigToDocumentList();
      });
    });

    context("Click on 'create document'", () => {
      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Enter title and select revision stage", () => {
      it(`Enter document title`, () => {
        cy.drEnterDocumentTitle({ name: mpiOutputDocType + " title" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: mpiOutputDocType + " description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });
    });

    context(`Select document type ${mpiOutputDocType} and check fields`, () => {
      it(`Select ${mpiOutputDocType} document type`, () => {
        cy.drSelectDocumentType({ documentType: mpiOutputDocType });
      });

      it("Verify Document id is assigned by system", () => {
        cy.get("input[id='document.docId']").should("contain.value", "MPI-000");
      });

      it("Verify Document id is editable", () => {
        cy.intPageVerifyDocIdIsEditable();
      });

      it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
        cy.get(`[data-cy="field-document.documentType.id"]`).parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Document ID");
      });

      it("Verify 'Revision Stage' field is visible", () => {
        cy.intPageVerifyRevisionStageExist();
      });

      it("Verify 'Training required' field is visible", () => {
        cy.intPageVerifyTrainingRequiredExist();
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get(`[data-cy="field-revisionStage"]`).parent().parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Training Required");
      });

      it("Verify 'Selected Users' field is visible", () => {
        cy.intPageVerifySelectedUsersExist();
      });

      it("Verify 'Selected Groups' field is visible", () => {
        cy.intPageVerifySelectedGroupsExist();
      });

      it("Verify 'Attachment' field is displayed", () => {
        cy.intPageVerifyAttachmentExist();
      });

      it(`Verify output document type is not displayed`, () => {
        cy.intPageVerifyOutputDocTypeNotExist();
      });

      it("Verify 'Preview Layout' button is not displayed", () => {
        cy.intPageVerifyPreviewLayoutButtonNotExist();
      });
    });

    context("Verify 'Add Field' and 'Form Options' not displayed on page", () => {
      it("Verify 'Add Field' button not displayed", () => {
        cy.intPageVerifyAddFieldNotExist();
      });

      it("Verify 'Form Options' are not displayed", () => {
        cy.intPageVerifyFormOptionsNotExist();
      });
    });

    context("Click 'Create Document' button and verify predefined fields are displayed", () => {
      context("verify default tabs are displayed", () => {
        it("Click on 'Create Document' button", () => {
          cy.get("#DocumentRevisionForm-submit").arrowClick();
        });

        it("Verify 'Overview' tab is displayed", () => {
          cy.intPageVerifyOverviewTabExist();
        });

        it("Verify 'Procedure' tab is displayed", () => {
          cy.intPageVerifyProcedureTabExist();
        });

        it("Verify 'Materials & Equipment' tab is displayed", () => {
          cy.intPageVerifyMaterialsAndEquipmentTabExist();
        });

        it("Verify 'Training' tab is displayed", () => {
          cy.intPageVerifyTrainingTabExist();
        });
      });

      context("verify predefined fields are displayed", () => {
        it("Verify 'Attachment' field is displayed", () => {
          cy.intPageVerifyAttachmentExist();
        });

        it("Check 'Approvals' is displayed", () => {
          cy.intPageVerifyNewApprovalsExist();
        });

        it("Select 'Procedure' tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Check 'PI PROCEDURE' is displayed", () => {
          cy.intPageVerifyPiProcedureExist();
        });

        it("Check 'Start quantity' is displayed", () => {
          cy.intPageVerifyStartQuantityExist();
        });

        it("Check 'Accepted quantity' is displayed", () => {
          cy.intPageVerifyAcceptedQuantityExist();
        });

        it("Check 'Rejected quantity' is displayed", () => {
          cy.intPageVerifyRejectedQuantityExist();
        });
      });
    });

    context("Verify form options and add field button is displayed in 'Procedure' tab", () => {
      context("Check form options are displayed at center bottom", () => {
        it("check 'Form Options' are diplayed at bottom center", () => {
          cy.intPageVerifyFormOptionsExist();
        });
      });

      context("Verify add field button is displayed", () => {
        it("Verify 'Add Field' button displayed", () => {
          cy.intPageVerifyAddFieldExist();
        });
      });
    });

    context("Verify form options and add field button is displayed in 'Overview' tab", () => {
      context("Check form options are displayed at center bottom", () => {
        it("Click on 'Overview' tab", () => {
          cy.drSelectOverviewTab();
        });

        it("check 'Form Options' are diplayed at bottom center", () => {
          cy.intPageVerifyFormOptionsExist();
        });
      });

      context("Verify add field button is displayed", () => {
        it("Verify 'Add Field' button displayed", () => {
          cy.intPageVerifyAddFieldExist();
        });
      });
    });

    context("Make sure fields and tabs displayed in non preview mode are the same displayed in Preview mode", () => {
      context("Add form fields", () => {
        it("Select 'Procedure' tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Add Autocomplete", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
          cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
          cy.get(`[data-cy="optionId"]`).autocompleteSelect("Document Revision")
            .clear().autocompleteSelect("Document Revision");
          cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
        });

        it("Add Quantity", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
          cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
        });

        it(`Add 'Text Field'`, () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
          cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.get(`input[value^="visibility"]`).check();
          cy.get(`input[name="validators.required_if"]`).check();
          cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-quantity" );
          cy.get(`[data-cy="validators.required_if.value"]`).arrowType("1");
          cy.fbAddNewFieldButton();
        });

        it("Add 'PI Procedure' step #2", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PI Procedure" });
          cy.fbAddNewFieldButton();
        });
      });

      context("Verify Form fields in non preview mode", () => {
        it("Verify 'PI Procedure'", () => {
          cy.intPageVerifyPiProcedureExist();
        });

        it("Verify 'PI Procedure' Step #1", () => {
          cy.get(`[data-cy="form.builder.step.number"]`).eq(0).should("contain.text", "Step #1");
          cy.get(`[data-cy="form.builder.attachments"]`).eq(0).should("exist");
          cy.get(`[data-cy="form.builder.materials"]`).eq(0).should("exist");
          cy.get(`[data-cy="form.builder.equipment"]`).eq(0).should("exist");
        });

        it("Verify 'PI Procedure' Step #2", () => {
          cy.get(`[data-cy="form.builder.step.number"]`).eq(1).should("contain.text", "Step #2");
          cy.get(`[data-cy="form.builder.attachments"]`).eq(1).should("exist");
          cy.get(`[data-cy="form.builder.materials"]`).eq(1).should("exist");
          cy.get(`[data-cy="form.builder.equipment"]`).eq(1).should("exist");
        });

        it("Verify 'Start quantity' is displayed", () => {
          cy.intPageVerifyStartQuantityExist();
        });

        it("Verify 'Accepted quantity' is displayed", () => {
          cy.intPageVerifyAcceptedQuantityExist();
        });

        it("Verify 'Rejected quantity' is displayed", () => {
          cy.intPageVerifyRejectedQuantityExist();
        });

        it("Verify Autocomplete attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
          cy.get(`[data-cy="optionId"]`).should("have.value", "Document revisions");
          cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
        });

        it("Verify Quantity attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
        });
      });

      context("Verify Form fields in preview mode", () => {
        it("Open Preview dialog", () => {
          cy.fbClickButton({ el: "FBWorkspace-clickView" });
        });

        it("Select 'Procedure' tab", () => {
          cy.get(`[data-cy="tabId.procedure"]`).last().arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify 'PI Procedure'", () => {
          cy.get(`[data-cy="form.builder.mpiprocedure"]`).eq(1).should("exist");
        });

        it("Verify 'PI Procedure' Step #1", () => {
          cy.get(`[data-cy="form.builder.step.number"]`).eq(2).should("contain.text", "Step #1");
          cy.get(`[data-cy="form.builder.attachments"]`).eq(2).should("exist");
          cy.get(`[data-cy="form.builder.materials"]`).eq(2).should("exist");
          cy.get(`[data-cy="form.builder.equipment"]`).eq(2).should("exist");
        });

        it("Verify 'PI Procedure' Step #2", () => {
          cy.get(`[data-cy="form.builder.step.number"]`).eq(3).should("contain.text", "Step #2");
          cy.get(`[data-cy="form.builder.attachments"]`).eq(3).should("exist");
          cy.get(`[data-cy="form.builder.materials"]`).eq(3).should("exist");
          cy.get(`[data-cy="form.builder.equipment"]`).eq(3).should("exist");
        });

        it("Verify 'Start quantity' is displayed", () => {
          cy.get(`[data-cy="Start quantity"]`).eq(1).should("exist");
        });

        it("Verify 'Accepted quantity' is displayed", () => {
          cy.get(`[data-cy="Accepted quantity"]`).eq(1).should("exist");
        });

        it("Verify 'Rejected quantity' is displayed", () => {
          cy.get(`[data-cy="Rejected quantity"]`).eq(1).should("exist");
        });

        it("Verify Autocomplete field and it's value", () => {
          cy.get(`input[data-cy^="fb-autocomplete-"]`).eq(1).arrowClick().autocompleteSelect("FM-00001");
          cy.get("[class='MuiChip-root MuiAutocomplete-tag MuiChip-deletable']").eq(0)
            .contains("FM-00001 - rev 1 - AR Form");
        });

        it("Verify TEXT FIELD is not displayed", () => {
          cy.get(`.MuiDialogContent-root [data-cy="TEXT FIELD"]`).should("not.exist");
        });

        it("Verify Quantity field", () => {
          cy.get("input[name^=fb-quantity-]").eq(1).clear().arrowType("1");
          cy.get("input[name^=fb-quantity-]").eq(1).should("have.value", "1");
        });

        it("Verify TEXT FIELD is displayed", () => {
          cy.get(`[data-cy="TEXT FIELD"]`).eq(1).should("exist");
        });

        it("Close Preview dialog", () => {
          cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
        });
      });

      context(`Make sure that none of the changes made in “Preview” were saved`, () => {
        it("Verify Quantity values", () => {
          cy.get(`input[name^="fb-quantity-"]`).should("have.text", "");
        });

        it("Verify Autocomplete values", () => {
          cy.get(`input[data-cy^="fb-autocomplete-"]`).parent().find(".MuiAutocomplete-tag").should("not.exist");
        });
      });

      context("Change the order of the fields", () => {
        it("Make autocomplete field as required field", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
          cy.get(`[data-cy="optionId"]`).clear().autocompleteSelect("Approval requests");
          cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.fbFieldRequired();
          cy.fbAddNewFieldButton();
        });

        it("Remove field 'TEXT FIELD'", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "TEXT FIELD" });
          cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
          cy.get(`input[name="validators.required_if"]`).arrowClick();
          cy.fbAddNewFieldButton();
          cy.fbClickRemoveBtn({ label: "TEXT FIELD" });
        });

        it("move component", () => {
          cy.get("[class*='fb-field-wrapper-fb-quantity-']").trigger("mouseover");
          cy.wait(2000);
          cy.get(".drag-handle").eq(-2)
            .realMouseDown({ position: "center", button: "left" });
          cy.wait(3000);
          cy.get(`[data-cy="Start quantity"]`).scrollIntoView()
            .realMouseMove(0, 0, { position: "center" })
            .realMouseUp();
          cy.unClick();
        });
      });

      context("Open the Preview mode and make sure it was updated accordingly", () => {
        it("Open Preview dialog", () => {
          cy.fbClickButton({ el: "FBWorkspace-clickView" });
        });

        it("Select 'Procedure' tab", () => {
          cy.get(`[data-cy="tabId.procedure"]`).last().arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify Quantity field's position", () => {
          cy.get(`[name^="fb-quantity-"]`).eq(1).parent().parent().parent().parent()
            .should("have.attr", "data-cy", "textfield-2");
        });

        it("Verify Quantity field", () => {
          cy.get("input[name^=fb-quantity-]").eq(1).clear().arrowType("1");
          cy.get("input[name^=fb-quantity-]").eq(1).should("have.value", "1");
        });

        it("Verify TEXT FIELD is not displayed", () => {
          cy.get(`[data-cy="TEXT FIELD"]`).should("not.exist");
        });

        it("Verify 'Autocomplete' field is required field", () => {
          cy.get(`[data-cy="fb-autocomplete"]`).eq(1).should("exist")
            .parent().parent().parent().parent().next("p")
            .should("have.text", "The fb-autocomplete is a required field.");
        });

        it("Verify Autocomplete field's value", () => {
          cy.get(`input[data-cy^="fb-autocomplete-"]`).eq(1).arrowClick().autocompleteSelect("AR Form");
          cy.get("[class='MuiChip-root MuiAutocomplete-tag MuiChip-deletable']").eq(0)
            .contains("AR99999 - AR Form");
        });

        it("Close Preview dialog", () => {
          cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
        });
      });
    });
  });

  context(`Validate ${qpiOutputDocType} intermediate page`, () => {
    context("Navigate to document list", () => {
      it("Navigate to document list landing page", () => {
        cy.navigToDocumentList();
      });
    });

    context("Click on 'create document'", () => {
      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Enter title and select revision stage", () => {
      it("Enter document title 'test title'", () => {
        cy.drEnterDocumentTitle({ name: "qpi intermediate page test" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "QPI document description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });
    });

    context(`Select document type ${qpiOutputDocType} and check fields`, () => {
      it(`Select ${qpiOutputDocType} document type`, () => {
        cy.drSelectDocumentType({ documentType: qpiOutputDocType });
      });

      it("Verify Document id is assigned by system", () => {
        cy.get("input[id='document.docId']").should("contain.value", "QPI-000");
      });

      it("Verify Document id is editable", () => {
        cy.intPageVerifyDocIdIsEditable();
      });

      it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
        cy.get(`[data-cy="field-document.documentType.id"]`).parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Document ID");
      });

      it("Verify 'Revision Stage' field is visible", () => {
        cy.intPageVerifyRevisionStageExist();
      });

      it("Verify 'Training required' field is visible", () => {
        cy.intPageVerifyTrainingRequiredExist();
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get(`[data-cy="field-revisionStage"]`).parent().parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Training Required");
      });

      it("Verify 'Selected Users' field is visible", () => {
        cy.intPageVerifySelectedUsersExist();
      });

      it("Verify 'Selected Groups' field is visible", () => {
        cy.intPageVerifySelectedGroupsExist();
      });

      it("Verify 'Attachment' field is displayed", () => {
        cy.intPageVerifyAttachmentExist();
      });

      it(`Verify output document type is not displayed`, () => {
        cy.intPageVerifyOutputDocTypeNotExist();
      });

      it("Verify 'Preview Layout' button is not displayed", () => {
        cy.intPageVerifyPreviewLayoutButtonNotExist();
      });
    });

    context("Verify 'Add Field' and 'Form Options' not displayed on page", () => {
      it("Verify 'Add Field' button not displayed", () => {
        cy.intPageVerifyAddFieldNotExist();
      });

      it("Verify 'Form Options' are not displayed", () => {
        cy.intPageVerifyFormOptionsNotExist();
      });
    });

    context("Click 'Create Document' button and verify predefined fields are displayed", () => {
      context("verify default tabs are displayed", () => {
        it("Click on 'Create Document' button", () => {
          cy.get("#DocumentRevisionForm-submit").arrowClick();
        });

        it("Verify 'Overview' tab is displayed", () => {
          cy.intPageVerifyOverviewTabExist();
        });

        it("Verify 'Procedure' tab is displayed", () => {
          cy.intPageVerifyProcedureTabExist();
        });

        it("Verify 'Materials & Equipment' tab is displayed", () => {
          cy.intPageVerifyMaterialsAndEquipmentTabExist();
        });
      });

      context("verify predefined fields are displayed", () => {
        it("Verify 'Attachment' field is displayed", () => {
          cy.intPageVerifyAttachmentExist();
        });

        it("Check 'Approvals' is displayed", () => {
          cy.intPageVerifyNewApprovalsExist();
        });

        it("Select 'Procedure' tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Check 'PI PROCEDURE' is displayed", () => {
          cy.intPageVerifyPiProcedureExist();
        });

        it("Check 'Start quantity' is displayed", () => {
          cy.intPageVerifyStartQuantityExist();
        });

        it("Check 'Accepted quantity' is displayed", () => {
          cy.intPageVerifyAcceptedQuantityExist();
        });

        it("Check 'Rejected quantity' is displayed", () => {
          cy.intPageVerifyRejectedQuantityExist();
        });
      });
    });

    context("Verify add field button is diplayed", () => {
      it("Verify 'Add Field' button displayed", () => {
        cy.intPageVerifyAddFieldExist();
      });
    });

    context("Check form options are displayed at center bottom", () => {
      it("check 'Form Options' are diplayed at bottom center", () => {
        cy.intPageVerifyFormOptionsExist();
      });
    });
  });
});
