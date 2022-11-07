
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let adminEmployee;
let createdCompany;
let adminEmployeeLoginResponse;
let equipmentURL;
let createdPMFormDocumentId;
let createdCalibrationFormDocumentId;

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

context("Equipment maintenance and calibration", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          done();
        });
      });
    });

    it("[API]Login first user", (done: any) => {
      cy.authApiLogin({
        email: FIRST_USER.email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: adminEmployee.id });
    });
  });

  context("Create form for Equipment", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equpment form'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment form" });
    });

    it("Enter description 'Equpment formdescription'", () => {
      cy.drEnterDocumentDescription({ description: "Equpment form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Equipment" });
      cy.unClick();
    });

    it("Click create a document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    context("Predefined fields are displayed", () => {
      it("Button should have text EQ Status", () => {
        cy.get("[data-cy=\"EQ Status\"]")
          .should("have.text", "EQ Status");
      });

      it("Navigate to specification list", () => {
        cy.drSelectSpecificationTab();
      });

      it("Button should have text Primary Owner", () => {
        cy.get("[data-cy=\"Primary Owner\"]")
          .should("have.text", "Primary Owner");
      });

      it("Button should have text Coordinator", () => {
        cy.get("[data-cy=\"Coordinator\"]")
          .should("have.text", "Coordinator");
      });
    });

    context("Add preventative maintenance section", () => {
      it("Navigate to overview", () => {
        cy.drSelectOverviewTab();
      });

      it("Click add PM field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Preventative Maintenance" });
        cy.get("input[value=preventativeMaintenance]").check();
        cy.fbAddNewFieldButton();
      });

      it("Click add a CAL field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "Calibration" });
        cy.get("input[value=calibration]").check();
        cy.fbAddNewFieldButton();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Predefined fields are displayed", () => {
      it("Button should have text Preventative Maintenance", () => {
        cy.get("[data-cy=\"Preventative Maintenance\"]")
          .should("have.text", "Preventative Maintenance");
      });

      it("Button should have text Preventative Maintenance required?", () => {
        cy.get("[data-cy=\"form.builder.pm.required\"]").eq(0)
          .should("have.text", "Preventative Maintenance required?");
      });

      it("Button should have text Preventative Maintenance Form", () => {
        cy.get("[data-cy=\"form.builder.preventative.maintenance.form\"]")
          .should("have.text", "Preventative Maintenance Form");
      });

      it("Button should have text Preventative Maintenance Frequency (Days)", () => {
        cy.get("[data-cy=\"form.builder.maintenance.frequency\"]")
          .should("have.text", "Preventative Maintenance Frequency (Days)");
      });

      it("Button should have text Justifications", () => {
        cy.get("[data-cy=\"common.justifications\"]").eq(0)
          .should("have.text", "Justifications");
      });

      it("Button should have text Instructions", () => {
        cy.get("[data-cy=\"form.builder.pm.instructions\"]").eq(0)
          .should("have.text", "Instructions");
      });

      it("Button should have text Calibration", () => {
        cy.get("[data-cy=\"Calibration\"]")
          .should("have.text", "Calibration");
      });

      it("Button should have text Calibration required?", () => {
        cy.get("[data-cy=\"form.builder.calibration.required\"]").eq(0)
          .should("have.text", "Calibration required?");
      });

      it("Button should have text Calibration Form", () => {
        cy.get("[data-cy=\"form.builder.calibration.form\"]")
          .should("have.text", "Calibration Form");
      });

      it("Button should have text Calibration Frequency (Days)", () => {
        cy.get("[data-cy=\"form.builder.calibration.frequency\"]")
          .should("have.text", "Calibration Frequency (Days)");
      });

      it("Button should have text Justifications", () => {
        cy.get("[data-cy=\"common.justifications\"]").eq(1)
          .should("have.text", "Justifications");
      });

      it("Button should have text Instructions", () => {
        cy.get("[data-cy=\"form.builder.pm.instructions\"]").eq(1)
          .should("have.text", "Instructions");
      });
    });

    context("Move & Edit & Remove component", () => {
      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for equipment test" });
        cy.fbAddField();
      });

      it("move Component", () => {
        cy.get("[data-cy='Textfield for equipment test']").trigger("mouseover");
        cy.wait(2000);
        cy.get(`[class="drag-handle"]`).eq(2)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(`[class="drag-handle"]`).eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
      });

      it("Edit Component", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
        cy.fbAddLabelName({ name: "Textfield for equipment test Edited" });
        cy.fbAddField();
      });

      it("remove Component", () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add component", () => {
        cy.drSelectOverviewTab();
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for equipment test" });
        cy.fbAddField();
      });
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.checkToastMessage({ exists: false });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });

      it("Export and save the template", () => {
        cy.get("[data-cy='FBWorkspace-exportTemplate']").eq(0).arrowClick();
        cy.get("[data-cy=\"fb-template-name\"]").arrowType("Equipment_Form");
        cy.get("[data-cy=\"common.add\"]").arrowClick();
      });
    });

    context("Start New equipment form creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter title 'Equpment form'", () => {
        cy.drEnterDocumentTitle({ name: "New Equipment form" });
      });

      it("Enter description 'Equpment formdescription'", () => {
        cy.drEnterDocumentDescription({ description: "New Equpment form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Equipment" });
        cy.unClick();
      });

      it("Click create a document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Import the template", () => {
        cy.get("#fb-import-schema").attachFile("../downloads/Equipment_Form.json");
      });

      it("Verify the imported field", () => {
        cy.get("[data-cy=\"Textfield for equipment test\"]")
          .should("have.text", "Textfield for equipment test");
      });
    });

    context("Move & Edit & Remove component", () => {
      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for new equipment test" });
        cy.fbAddField();
      });

      it("move Component", () => {
        cy.get("[data-cy='Textfield for new equipment test']").trigger("mouseover");
        cy.wait(2000);
        cy.get(`[class="drag-handle"]`).eq(2)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(`[class="drag-handle"]`).eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
      });

      it("Edit Component", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
        cy.fbAddLabelName({ name: "Textfield for New equipment test Edited" });
        cy.fbAddField();
      });

      it("remove Component", () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Create form for Preventative maintenance", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative Maintenance form'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative Maintenance form" });
    });

    it("Enter description 'Preventative Maintenance form description'", () => {
      cy.drEnterDocumentDescription({ description: "Preventative Maintenance form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
      cy.unClick();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify that Approvals field is automatically added", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });

    context("Predefined fields are displayed", () => {
      it("Navigate to overview", () => {
        cy.drSelectDetailsTab();
      });

      it("Button should have text Equipment", () => {
        cy.get("[data-cy=\"Equipment\"]")
          .should("have.text", "Equipment");
      });

      it("Button should have text Maintainer", () => {
        cy.get("[data-cy=\"Maintainer\"]")
          .should("have.text", "Maintainer");
      });

      it("Button should have text Completion Date", () => {
        cy.get("[data-cy=\"Completion Date\"]")
          .should("have.text", "Completion Date");
      });
    });

    context("Move & Edit & Remove component", () => {
      it("Navigate to overview", () => {
        cy.drSelectOverviewTab();
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for PM" });
        cy.fbAddField();
      });

      it("move Component", () => {
        cy.get("[data-cy='Textfield for PM']").trigger("mouseover");
        cy.wait(2000);
        cy.get(`[class="drag-handle"]`).eq(1)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(`[class="drag-handle"]`).eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
      });

      it("Edit Component", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
        cy.fbAddLabelName({ name: "Textfield for PM Edited" });
        cy.fbAddField();
      });

      it("remove Component", () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for PM test" });
        cy.fbAddField();
      });

      it("Click save a document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Approve and release form & Export", () => {
      it("Approve and release form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.url().then((url: any) => {
          createdPMFormDocumentId = url.split("/").pop();
        });
      });

      it("Export and save the template", () => {
        cy.get("[class=\"MuiIconButton-label\"]").eq(6).arrowClick();
        cy.get("[data-cy=\"fb-template-name\"]").arrowType("PM_Form");
        cy.get("[data-cy=\"common.add\"]").arrowClick();
      });
    });

    context("Start New PM form creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter title 'Preventative Maintenance form'", () => {
        cy.drEnterDocumentTitle({ name: "New Preventative Maintenance form" });
      });

      it("Enter description 'Preventative Maintenance form description'", () => {
        cy.drEnterDocumentDescription({ description: "New Preventative Maintenance form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
        cy.unClick();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Verify that Approvals field is automatically added", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Import the template", () => {
        cy.get("#fb-import-schema").attachFile("../downloads/PM_Form.json");
      });

      it("Verify the imported field", () => {
        cy.get("[data-cy=\"Textfield for PM test\"]")
          .should("have.text", "Textfield for PM test");
      });
    });

    context("Move & Edit & Remove component", () => {
      it("Navigate to overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for New PM" });
        cy.fbAddField();
      });

      it("move Component", () => {
        cy.get("[data-cy='Textfield for New PM']").trigger("mouseover");
        cy.wait(2000);
        cy.get(`[class="drag-handle"]`).eq(2)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(`[class="drag-handle"]`).eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
      });

      it("Edit Component", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
        cy.fbAddLabelName({ name: "Textfield for New PM Edited" });
        cy.fbAddField();
      });

      it("remove Component", () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Create form for Calibration", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration form'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration form" });
    });

    it("Enter description 'Calibration form description'", () => {
      cy.drEnterDocumentDescription({ description: "Calibration form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
      cy.unClick();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    context("Predefined fields are displayed", () => {
      it("Navigate to overview", () => {
        cy.drSelectDetailsTab();
      });

      it("Button should have text Equipment", () => {
        cy.get("[data-cy=\"Equipment\"]")
          .should("have.text", "Equipment");
      });

      it("Button should have text Maintainer", () => {
        cy.get("[data-cy=\"Maintainer\"]")
          .should("have.text", "Maintainer");
      });

      it("Button should have text Completion Date", () => {
        cy.get("[data-cy=\"Completion Date\"]")
          .should("have.text", "Completion Date");
      });
    });

    context("Move & Edit & Remove component", () => {
      it("Navigate to overview", () => {
        cy.drSelectOverviewTab();
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for CAL" });
        cy.fbAddField();
      });

      it("move Component", () => {
        cy.get("[data-cy='Textfield for CAL']").trigger("mouseover", { force: true });
        cy.wait(2000);
        cy.get(`[class="drag-handle"]`).eq(1)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(`[class="drag-handle"]`).eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
      });

      it("Edit Component", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
        cy.fbAddLabelName({ name: "Textfield for CAL Edited" });
        cy.fbAddField();
      });

      it("remove Component", () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for CAL test" });
        cy.fbAddField();
      });

      it("Click save a document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Approve and release form", () => {
      it("Approve and release CAL form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.url().then((url: any) => {
          createdCalibrationFormDocumentId = url.split("/").pop();
        });
      });

      it("Export and save the template", () => {
        cy.get("[class=\"MuiIconButton-label\"]").eq(6).arrowClick();
        cy.get("[data-cy=\"fb-template-name\"]").arrowType("CAL_Form");
        cy.get("[data-cy=\"common.add\"]").arrowClick();
      });
    });
    context("Start New CAL form creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter title 'Calibration form'", () => {
        cy.drEnterDocumentTitle({ name: "New Calibration form" });
      });

      it("Enter description 'Calibration form description'", () => {
        cy.drEnterDocumentDescription({ description: "New Calibration form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Maintenance Record" });
        cy.unClick();
      });

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Import the template", () => {
        cy.get("#fb-import-schema").attachFile("../downloads/CAL_Form.json");
      });

      it("Verify the imported field", () => {
        cy.get("[data-cy=\"Textfield for CAL test\"]")
          .should("have.text", "Textfield for CAL test");
      });
    });

    context("Move & Edit & Remove component", () => {
      it("Navigate to overview", () => {
        cy.drSelectOverviewTab();
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for New CAL" });
        cy.fbAddField();
      });

      it("move Component", () => {
        cy.get("[data-cy='Textfield for New CAL']").trigger("mouseover");
        cy.wait(2000);
        cy.get(`[class="drag-handle"]`).eq(2)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(`[class="drag-handle"]`).eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
        cy.unClick();
      });

      it("Edit Component", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
        cy.fbAddLabelName({ name: "Textfield for New CAL Edited" });
        cy.fbAddField();
      });

      it("remove Component", () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

  });

  context("Create Equipment document", () => {
    it("Navig to equipment", () => {
      cy.navigToEquipment();
    });

    it("Click add new Equipment", () => {
      cy.equipClickCreateNew();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Equipment document'", () => {
      cy.drEnterDocumentTitle({ name: "Equipment document" });
    });

    it("Enter description 'Equipment description'", () => {
      cy.drEnterDocumentDescription({ description: "Equipment description" });
    });

    it("Button should have text EQ Status", () => {
      cy.get("[data-cy=\"EQ Status\"]")
        .should("have.text", "EQ Status");
    });

    it("navigate to Specification", () => {
      cy.drSelectSpecificationTab();
    });

    it("Button should have text Primary Owner", () => {
      cy.get("[data-cy=\"Primary Owner\"]")
        .should("have.text", "Primary Owner");
    });

    it("Button should have text Coordinator", () => {
      cy.get("[data-cy=\"Coordinator\"]")
        .should("have.text", "Coordinator");
    });

    it(`Select '${USERS[1].name}' for Primary Owner`, () => {
      cy.get("input[data-cy=\"fb-primary-owner-eq\"]").arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it(`Select '${USERS[1].name}' for Coordinator`, () => {
      cy.wait(2000);
      cy.get("input[data-cy=\"fb-coordinator-eq\"]").arrowClick({ force: true });
      cy.get("ul>li[role=\"option\"]").contains(USERS[1].name).arrowClick();
    });

    it("Save document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("navigate to overview", () => {
      cy.drSelectOverviewTab();
    });

    it("Select 'Active' as EQ status", () => {
      cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Select document 'NO' for preventative maintenance required", () => {
      cy.get("[value=\"No\"]").eq(1).arrowClick({ force: true });
    });

    it("Button should have text Justifications", () => {
      cy.get("[data-cy=\"common.justifications\"]").eq(0)
        .should("have.text", "Justifications");
    });

    it("Select document 'Yes' for preventative maintenance required", () => {
      cy.get("[value=\"Yes\"]").eq(0).arrowClick();
    });

    it("Button should have text Preventative Maintenance Frequency (Days)", () => {
      cy.get("[data-cy=\"form.builder.maintenance.frequency\"]")
        .should("have.text", "Preventative Maintenance Frequency (Days)");
    });

    it("Button should have text Instructions", () => {
      cy.get("[data-cy=\"form.builder.pm.instructions\"]").eq(0)
        .should("have.text", "Instructions");
    });

    it("Select 'Preventative Maintenance form' for preventative maintenance required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(2).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(0).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Preventative Maintenance form").arrowClick();
    });

    it("Select preventative maintenance frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(0).arrowType("365");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy, \"preventative\")]/../div[2]")
        .type("Instructions for preventative maintenance").wait(500);
      cy.unClick();
    });

    it("Select document 'No' for calibration required", () => {
      cy.get("[value=\"No\"]").eq(1).arrowClick({ force: true });
    });

    it("Button should have text Justifications", () => {
      cy.get("[data-cy=\"common.justifications\"]").eq(0)
        .should("have.text", "Justifications");
    });

    it("Select document 'Yes' for calibration required", () => {
      cy.get("[value=\"Yes\"]").eq(1).arrowClick();
    });

    it("Button should have text Calibration Frequency (Days)", () => {
      cy.get("[data-cy=\"form.builder.calibration.frequency\"]")
        .should("have.text", "Calibration Frequency (Days)");
    });

    it("Button should have text Instructions", () => {
      cy.get("[data-cy=\"form.builder.pm.instructions\"]").eq(1)
        .should("have.text", "Instructions");
    });

    it("Select 'Calibration form' for calibration required", () => {
      cy.get("[name$=\"preventativeForm\"] button").eq(5).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.unClick();
      cy.get("[data-cy*=\"preventativeForm\"]").eq(1).arrowClick();
      cy.get("ul>li[role=\"option\"]").contains("Calibration form").arrowClick();
    });

    it("Select calibration frequency", () => {
      cy.get("[name*=\"frequency\"]").eq(1).arrowType("365");
    });

    it("Type preventative maintenance instruction", () => {
      cy.xpath("//div[contains(@data-cy, \"instructions\") and  starts-with(@data-cy,\"calibration\")]/../div[2]")
        .type("Instructions for calibration").wait(500);
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.url().then((url: any) => {
        equipmentURL = url;
      });
    });
  });

  context("Create Preventative Maintenance record", () => {
    it("Click 'NEW PM' on preventative maintenace section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.pm']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdPMFormDocumentId}/version/${response.id}`;
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
            CyRoutes.GetAvailableApprovers], () => {
            cy.visit(newPMUrl);
          });
        }
      });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Preventative maintenance document'", () => {
      cy.drEnterDocumentTitle({ name: "Preventative maintenance document" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();
      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Create 'Preventative maintenance document'", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Add first Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAvailableApprovers], () => {
        cy.ebApprove();
      });
    });
  });

  context("Create Calibration record", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Click 'NEW PM' on preventative maintenace section", () => {
      cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }).as("response");
      cy.get("[data-cy='form.builder.new.pm']").arrowClick();
      cy.wait("@response").then((res) => {
        if (res.response) {
          const response = res.response.body;
          // eslint-disable-next-line max-len
          const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdCalibrationFormDocumentId}/version/${response.id}`;
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
            CyRoutes.GetAvailableApprovers], () => {
            cy.visit(newPMUrl);
          });
        }
      });
      cy.checkToastMessage({ exists: false });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title 'Calibration document'", () => {
      cy.drEnterDocumentTitle({ name: "Calibration document" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Select maintainer '${ADMIN_USER.name}'`, () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"equipment_maintainer\"]").arrowClick();
      cy.get("ul>li[role=\"option\"]").contains(ADMIN_USER.name).arrowClick();
    });

    it("Fill 'Completion Date'", () => {
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.xpath("//input[@name='fb-equipment_due_date']/../div/button").arrowClick();

      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          cy.log(dayNumber);
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Create 'Calibration document'", () => {
      cy.drClickCreateDocumentWithApiCall({ requiredApproversDocRev: true });
    });

    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Add first Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: ADMIN_USER.name });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAvailableApprovers], () => {
        cy.ebApprove();
      });
    });
  });

  context("Verify Maintenance History is now only History", () => {
    it("Navigate to Equipment document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails, CyRoutes.DocPreview], () => {
        cy.visit(equipmentURL);
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    context("Verify Maintenance History is changed to History", () => {
      it("navigate to overview", () => {
        cy.drSelectOverviewTab();
      });

      it("Verify for pm", () => {
        cy.get("[data-cy=\"document.revision.history\"]").should("have.length", "1");
        cy.get("[data-cy=\"document.revision.history\"]").eq(0).should("have.text", "History");
      });

      it("Check preventative maintenance document existance", () => {
        cy.get("div[data-cy=\"maintenanceHistory\"]")
          .eq(1)
          .should("contain", "MR-00001 - Preventative maintenance document")
          .and("contain", ADMIN_USER.name)
          .and("contain", "RELEASED");
      });

      it("Check preventative maintenance status", () => {
        cy.log(createdCompany.name);
        const prevMaintenanceComplianceDate = moment().tz("America/Los_Angeles")
          .add(365, "days")
          .format("ddd, MMMM D, YYYY");
        cy.get("[data-cy=\"maintenance.status\"]")
          .eq(0).then(($el) => {
            const text = $el.text().replace(/\u00a0/g, "");
            expect(text).to.contain(`PMDone - Due date: ${prevMaintenanceComplianceDate}`);
          });
      });

      it("Check Calibration document existance", () => {
        cy.get("[data-cy=\"maintenanceHistory\"]")
          .eq(0)
          .should("contain", "MR-00002 - Calibration document")
          .and("contain", ADMIN_USER.name)
          .and("contain", "RELEASED");
      });

      it("Check calibration status", () => {
        const calibrationComplianceDate = moment().tz("America/Los_Angeles")
          .add(365, "days")
          .format("ddd, MMMM D, YYYY");
        cy.get("[data-cy=\"maintenance.status\"]")
          .eq(0).then(($el) => {
            const text = $el.text().replace(/\u00a0/g, "");
            expect(text).to.contain(`PMDone - Due date: ${calibrationComplianceDate}`);
          });
      });
    });
  });
});
