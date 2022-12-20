// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const tcOutputDocType = "Training Curriculum test";

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
              TrainingCurriculum,
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
    it("Enter document title", () => {
      cy.drEnterDocumentTitle({ name: tcOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: tcOutputDocType + " description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context(`Select document type ${docType} and check fields`, () => {
    it(`Select ${docType} document type`, () => {
      cy.drSelectDocumentType({ documentType: docType });
    });

    it("Verify Document id is assigned by system", () => {
      cy.get("input[id='document.docId']").should("contain.value", "FM-000");
    });

    it("Verify Document id is editable", () => {
      cy.intPageVerifyDocIdIsEditable();
    });

    it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
      cy.get("[data-cy='field-document.documentType.id']").parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Document ID");
    });

    it("Verify 'Revision Stage' field is displayed", () => {
      cy.intPageVerifyRevisionStageExist();
    });

    it("Verify 'Training required' field is displayed", () => {
      cy.intPageVerifyTrainingRequiredExist();
    });

    it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
      cy.get("[data-cy='field-revisionStage']").parent().parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Training Required");
    });

    it("Verify 'Selected Users' field is displayed", () => {
      cy.intPageVerifySelectedUsersExist();
    });

    it("Verify 'Selected Groups' field is displayed", () => {
      cy.intPageVerifySelectedGroupsExist();
    });

    it("Verify 'Attachment' field is displayed", () => {
      cy.intPageVerifyAttachmentExist();
    });

    it("Verify 'Preview Layout' button is disabled and grayed out", () => {
      cy.intPageVerifyPreviewLayoutButtonDisabled();
    });
  });

  context("Select output document type", () => {
    it(`Select ${tcOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: tcOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Approvals' is not displayed", () => {
      cy.intPageVerifyApprovalsNotExist();
    });

    it("Check 'PERIODIC TRAINING' is not displayed", () => {
      cy.intPageVerifyPeriodicTraningNotExist();
    });

    it("Check 'Documents to Train on' is not displayed", () => {
      cy.intPageVerifyDocumentsToBeTrainedOnNotExist();
    });

    it("Check 'Refresh/repeat training periodically?' is not displayed", () => {
      cy.intPageVerifyPeriodicTraningNotExist();
    });

    it("Check 'Training Frequency (in days)' is not displayed", () => {
      cy.intPageVerifyTrainingFrequencyNotExist();
    });

    it("Check 'TRAINEES DETAILS' is not displayed", () => {
      cy.intPageVerifyTraineesDetailsNotExist();
    });

    it("Check 'Groups to Train' is not displayed", () => {
      cy.intPageVerifyGroupsToTrainNotExist();
    });

    it("Check 'Users to Train (if applicable)' is not displayed", () => {
      cy.intPageVerifyUsersToTrainNotExist();
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

  context("Click 'Preview Layout' button and verify predefined fields are displayed", () => {
    context("verify default tabs are displayed", () => {
      it("Click 'Preview Layout' button", () => {
        cy.intPageClickPreviewLayout();
      });

      it("Verify 'Overview' tab is displayed", () => {
        cy.intPageVerifyOverviewTabExist();
      });

      it("Verify 'Details' tab is displayed", () => {
        cy.intPageVerifyDetailsTabExist();
      });
    });

    context("verify default fields are displayed", () => {
      it("Verify Document type is displayed", () => {
        cy.intPageVerifyDocTypeExist();
      });

      it("Verify Document id is not editable", () => {
        cy.intPageVerifyDocIdIsNotEditable();
      });

      it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
        cy.get("[data-cy='field-document.documentType.id']").parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Document ID");
      });

      it("Verify 'Revision Stage' field is displayed", () => {
        cy.intPageVerifyRevisionStageExist();
      });

      it("Verify 'Training required' field is displayed", () => {
        cy.intPageVerifyTrainingRequiredExist();
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get("[data-cy='field-revisionStage']").parent().parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Training Required");
      });

      it("Verify 'Attachment' field is displayed", () => {
        cy.intPageVerifyAttachmentExist();
      });

      it("Verify Output document type is displayed", () => {
        cy.intPageVerifyOutputDocTypeExist();
      });
    });

    context("verify predefined fields are displayed and are not deletable", () => {
      it("Check 'Approvals' is displayed", () => {
        cy.intPageVerifyApprovalsExist();
      });

      it("Check 'Approvals' is not deletable", () => {
        cy.get("[data-cy='form.builder.approvals']").trigger("mouseover");
        cy.get(`[data-cy="edit-schema-item"]`)
          .should("not.exist");
        cy.get(`[data-cy="remove-schema-item"]`)
          .should("not.exist");
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Check 'PERIODIC TRAINING' is displayed", () => {
        cy.intPageVerifyPeriodicTraningExist();
      });

      it("Check 'PERIODIC TRAINING' is not deletable", () => {
        cy.get("[data-cy='Periodic Training']").trigger("mouseover");
        cy.get(`[data-cy="edit-schema-item"]`)
          .should("not.exist");
        cy.get(`[data-cy="remove-schema-item"]`)
          .should("not.exist");
      });

      it("Check 'Documents to Train on' is displayed", () => {
        cy.intPageVerifyDocumentsToBeTrainedOnExist();
      });

      it("Check 'Documents to Train on' is not deletable", () => {
        cy.get("[data-cy='Documents to Train on']").trigger("mouseover");
        cy.get(`[data-cy="edit-schema-item"]`)
          .should("not.exist");
        cy.get(`[data-cy="remove-schema-item"]`)
          .should("not.exist");
      });

      it("Check 'Refresh/repeat training periodically?' is displayed", () => {
        cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
        cy.intPageVerifyPeriodicTraningExist();
      });

      it("Check 'Refresh/repeat training periodically?' is not deletable", () => {
        cy.get("[data-cy='Refresh/repeat training periodically?']").trigger("mouseover");
        cy.get(`[data-cy="edit-schema-item"]`)
          .should("not.exist");
        cy.get(`[data-cy="remove-schema-item"]`)
          .should("not.exist");
      });

      it("Check 'Training Frequency (in days)' is displayed", () => {
        cy.intPageVerifyTrainingFrequencyExist();
      });

      it("Check 'Training Frequency (in days)' is not deletable", () => {
        cy.get("[data-cy='Training Frequency (in days)']").trigger("mouseover");
        cy.get(`[data-cy="edit-schema-item"]`)
          .should("not.exist");
        cy.get(`[data-cy="remove-schema-item"]`)
          .should("not.exist");
      });

      it("Check 'TRAINEES DETAILS' is displayed", () => {
        cy.intPageVerifyTraineesDetailsExist();
      });

      it("Check 'TRAINEES DETAILS' is not deletable", () => {
        cy.get("[data-cy='Trainees Details']").trigger("mouseover");
        cy.get(`[data-cy="edit-schema-item"]`)
          .should("not.exist");
        cy.get(`[data-cy="remove-schema-item"]`)
          .should("not.exist");
      });

      it("Check 'Groups to Train' is displayed", () => {
        cy.intPageVerifyGroupsToTrainExist();
      });

      it("Check 'Groups to Train' is not deletable", () => {
        cy.get("[data-cy='Groups to Train']").trigger("mouseover");
        cy.get(`[data-cy="edit-schema-item"]`)
          .should("not.exist");
        cy.get(`[data-cy="remove-schema-item"]`)
          .should("not.exist");
      });

      it("Check 'Users to Train (if applicable)' is displayed", () => {
        cy.intPageVerifyUsersToTrainExist();
      });

      it("Check 'Users to Train (if applicable)' is not deletable", () => {
        cy.get("[data-cy='Users to Train (if applicable)']").trigger("mouseover");
        cy.get(`[data-cy="edit-schema-item"]`)
          .should("not.exist");
        cy.get(`[data-cy="remove-schema-item"]`)
          .should("not.exist");
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });
    });
  });

  context("Click 'Create Document' button and verify predefined fields are displayed", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id='DocumentRevisionForm-submit']").arrowClick();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.intPageVerifyApprovalsExist();
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Check 'PERIODIC TRAINING' is displayed", () => {
      cy.intPageVerifyPeriodicTraningExist();
    });

    it("Check 'Documents to Train on' is displayed", () => {
      cy.intPageVerifyDocumentsToBeTrainedOnExist();
    });

    it("Check 'Refresh/repeat training periodically?' is displayed", () => {
      cy.intPageVerifyPeriodicTraningExist();
    });

    it("Check 'Training Frequency (in days)' is displayed", () => {
      cy.intPageVerifyTrainingFrequencyExist();
    });

    it("Check 'TRAINEES DETAILS' is displayed", () => {
      cy.intPageVerifyTraineesDetailsExist();
    });

    it("Check 'Groups to Train' is displayed", () => {
      cy.intPageVerifyGroupsToTrainExist();
    });

    it("Check 'Users to Train (if applicable)' is displayed", () => {
      cy.intPageVerifyUsersToTrainExist();
    });
  });

  context("Verify form options and add field button is displayed in Details tab", () => {
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

  context("Verify form options and add field button is displayed in Overview tab", () => {
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

  context("Verify Preview mode for overview tab after doc creation", () => {

    it("Click on Preview", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
    });

    it("Verify Approval should be visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy^="fb-approvals"]`).should("exist");
    });

    it("Select Approval", () => {
      cy.get(`.MuiDialogContent-root [data-cy^="fb-approvals"]`).autocompleteSelect(USERS[1].name);
    });

    it("Close Preview window", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });

    it("Reopen Preview window and verify approval block should not have any value", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.get(`.MuiDialogContent-root [data-cy^="fb-approvals"]`).should("not.contain.value");
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Verify form options and add field button is displayed in Detail tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("Click on 'Detail' tab", () => {
        cy.drSelectDetailsTab();
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

  context("Verify Preview mode after doc creation", () => {
    it("Verify tabs overview, detail", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Click form preview button", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Detail' tab", () => {
      cy.get("[data-cy=\"tabCon-tabId.details\"]").last().arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training curiculam section visible", () => {
      cy.get(".MuiDialogContent-root #training-curriculum-details-section").should("exist");
    });

    it("Verify document to be train on should be visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy="Documents to Train on"]`).should("exist");
    });

    it("Verify Refresh retraining should be visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy^="Refresh/repeat"]`).should("exist");
    });

    it("Verify training detail section should be visible", () => {
      cy.get(`.MuiDialogContent-root #training-details-section`).should("exist");
    });

    it("Verify select group to train should be visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy="training-select-groups-to-train"]`).should("exist");
    });

    it("Verify select user to train should be visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy="training-select-users-to-train"]`).should("exist");
    });
  });

  context("Verify fields in preview mode editable or not", () => {
    it("Check Documents to Train on", () => {
      cy.get(`.MuiDialogContent-root [data-cy="training-document-to-be-trained-on"]`).autocompleteSelect("FM-00001");
    });

    it("Select refresh training", () => {
      cy.get(`.MuiDialogContent-root [name="training-refresh-training-periodically"]`).arrowClick({ multiple: true });
    });

    it("select group to train should be visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy="training-select-groups-to-train"]`).autocompleteSelect("Everyone");
    });

    it("Verify select user to train should be visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy="training-select-users-to-train"]`).autocompleteSelect(USERS[1].name);
    });

    it("Close the preview mode", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });

    it("Reopen the preview mode and verify enter detail not saved", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.get("[data-cy=\"tabCon-tabId.details\"]").last().arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist();
      cy.get(`.MuiDialogContent-root [data-cy="training-select-users-to-train"]`).should("not.contain.value");
      cy.get(`.MuiDialogContent-root [data-cy="training-select-groups-to-train"]`).should("not.contain.value");
      cy.get(`.MuiDialogContent-root [name="training-refresh-training-periodically"]`).should("not.be.selected");
    });

    it("Close the preview mode dialog", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Add FB fields and verify field 2 is visible when field 1 has value 'YES'", () => {
    it("Click on 'Overview' tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "FbTrainingText" });
      cy.fbAddField();
    });

    it("Add radio button group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "RadioBtnGroup for inline" });
      cy.fbGroupOptions("One", "Two", "Three");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.get("input[value^='visibility']").check();
      cy.get(`input[name="validators.required_if"]`).check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("FbTrainingText");
      cy.get(`[data-cy="validators.required_if.value"]`).arrowType("Yes");
      cy.fbAddField();
    });

    it("Verify form preview button in Overview Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
    });

    it("Verify FB Text field 'Text1' is visible and radio button group is hidden", () => {
      cy.get("[name^='fb-training-text']").last().should("exist");
      cy.get("[name^='radio-btn-group-for-inline']").should("not.be.visible");
    });

    it("Enter value 'Yes' in text field Text1 Radio button group should be visible", () => {
      cy.get("[name^='fb-training-text']").last().arrowType("Yes").wait(2000);
      cy.get("[name^='radio-btn-group-for-inline']").last().should("exist");
      cy.get("[data-cy='RadioBtnGroup for inline']").should("be.visible");
    });

    it("Remove value 'Yes' in text field Text1 Radio button group should be hidden", () => {
      cy.get("[name^='fb-training-text']").last().arrowType("Ye").clear();
      cy.get("[name^='radio-btn-group-for-inline']").last().should("not.be.visible");
      cy.get("[data-cy='RadioBtnGroup for inline']").should("not.be.visible");
    });

    it("Close the preview mode dialog", () => {
      cy.get("[name^='fb-training-text']").last().arrowType("Yes");
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Remove the FB fields validation and verify", () => {
    it("Edit Component", () => {
      cy.get("[data-cy='edit-schema-item']").last().arrowClick({ force: true });
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.get("input[value^='default']").check();
      cy.get(`input[name="validators.required_if"]`).uncheck();
      cy.fbAddField();
    });

    it("Open form preview", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
    });

    it("Verify Text field and radio button group is visible after removal of validation", () => {
      cy.get(`[data-cy="FbTrainingText"]`).last().should("exist");
      cy.get("[data-cy='RadioBtnGroup for inline']").last().should("exist");
    });
  });
});
