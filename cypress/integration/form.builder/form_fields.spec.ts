// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("FORM Field test", () => {
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
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'test title'", () => {
      cy.drEnterDocumentTitle({ name: "test title" });
    });

    it("Enter document description 'test description'", () => {
      cy.drEnterDocumentDescription({ description: "test description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Clinical Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
    });

    it("Click create a document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    context("Create FORM document with Form fields", () => {
      it("Add TextField", () => {
        SystemRequirement("FB-0020", "FB-0030");
        cy.fbAddNewField();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Checkbox group", () => {
        SystemRequirement("FB-0120");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Autocomplete", () => {
        SystemRequirement("FB-0140", "FB-0150");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
        cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
        cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Text Editor", () => {
        SystemRequirement("FB-0060", "FB-0170", "FB-0180", "FB-0190");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Date picker", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Verify you can't add value to date picker in form edit design mode", () => {
        cy.get("input[name^=fb-datepicker]").should("have.attr", "disabled");
      });

      it("Add Hyperlink", () => {
        SystemRequirement("FB-0070");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
        cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
        cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Select Field", () => {
        SystemRequirement("FB-0130");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
        cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeNone", "includeContext", "reviseDisabled",
          "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Verify data can't be entered to select field in form edit design mode", () => {
        cy.get("input[name^=fb-select-field]").should("have.attr", "type", "hidden");
      });

      it("Add Radio Button group", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });


      it("Verify radio buttons can't be selected", () => {
        cy.get("input[name^=fb-radiobutton-group]").eq(0).should("have.attr", "disabled");
        cy.get("input[name^=fb-radiobutton-group]").eq(1).should("have.attr", "disabled");
        cy.get("input[name^=fb-radiobutton-group]").eq(2).should("have.attr", "disabled");
      });

      it("Add Paragraph", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
        cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().arrowType("fb-paragraph");
        cy.fbAddNewFieldButton();
      });

      it("Add File Upload", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Blank Template Form", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
        cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
        cy.fbAddNewFieldButton();
        cy.elUploadAttachment({ fileName: "image.jpg", el: "fb-attachment-field-fb-blank-template-" });
      });

      it("Add Quantity", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
        cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Timer", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
        cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Purchase Order", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Purchase Order" });
        cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Receive Purchase Order", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
        cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add PO Approval Matrix", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PO Approval Matrix" });
        cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Instructions Media upload", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Evidence Media upload", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add EB Procedure", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Equipment", () => {
        SystemRequirement("FB-0080");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "fb-equipment" });
        cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Text field with range", () => {
        SystemRequirement("FB-0100", "FB-0110", "FB-0160");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
        cy.fbEnterNameValue({ name: "label", value: "fb-range" });
        cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
        cy.fbSelectCheckboxName("editorConfig.rangeOption",
          "editorConfig.criticalToQuality", "editorConfig.inspection");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Section", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
        cy.fbEnterNameValue({ name: "label", value: "fb-section" });
        cy.fbSelectCheckboxValue("inspectionSection");
        cy.fbAddNewFieldButton();
      });

      it("Add Subsection", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Subsection" });
        cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
        cy.fbAddNewFieldButton();
      });

      it("Add Step", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Step" });
        cy.fbEnterNameValue({ name: "label", value: "fb-step" });
        cy.fbAddNewFieldButton();
      });

      it("Add Approvals", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Approvals" });
        cy.fbEnterNameValue({ name: "label", value: "fb-approvals" });
        cy.wrapWithWaitOnApiCall(CyRoutes.AvailableMaintenanceForms, () => {
          cy.fbAddNewFieldButton();
        });
      });

      it("Add Inline Approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.listLoadingElementShouldNotExist();
        cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
        cy.get("[data-cy=\"editorConfig.approvers\"]").autocompleteSelect(`${USERS[1].email }`);
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.wrapWithWaitOnApiCall(CyRoutes.AvailableMaintenanceForms, () => {
          cy.fbAddNewFieldButton();
        });
      });

      it("Add Request Approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Request Approval" });
        cy.fbEnterNameValue({ name: "label", value: "fb-request-approval" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Checkpoint", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Checkpoint" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkpoint" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Create a Label", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Create a Label" });
        cy.fbEnterNameValue({ name: "label", value: "fb-create-label" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Implementation Task", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Implementation Task" });
        cy.fbEnterNameValue({ name: "label", value: "fb-task" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Instructions 'MPI'", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "MPI" });
        cy.fbEnterNameValue({ name: "label", value: "fb-mpi" });
        cy.get("[data-cy=\"instructionsDocument\"]").autocompleteSelect("AR Form");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Instructions 'Select Document(s)'", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "Select Document(s)" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-doc" });
        cy.get("[data-cy=\"options\"]").autocompleteSelect("AR Form");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Actions 'Action Button'", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Actions", field: "Action Button" });
        cy.fbSelectCheckboxValue("SendEmailWithFormToFill", "SendSurveyEmailWithFormToFill");
        cy.fbAddNewFieldButton();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Verify Form fields", () => {
      it("Verify TextField attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-textfield" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder" });
        cy.fbVerifyNameValue({ name: "rows", value: "2" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Checkbox group attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-checkbox-group" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-checkbox-group" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Autocomplete attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
        cy.get("[data-cy=\"optionId\"]").should("have.value", "Document revisions");
        cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Text Editor attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-text-editor" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Date picker attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Hyperlink attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-hyperlink" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-hyperlink" });
        cy.fbVerifyNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify location linked on Hyperlink", () => {

        cy.window().then((win) => {
          cy.spy(win, "open").as("redirect");
        });
        cy.get("[name^=fb-hyperlink-]").arrowClick();
        cy.get("@redirect").should("be.calledWith", "https://google.com");
      });

      it("Verify Select Field attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-select-field" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-select-field" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-select-field placeholder" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Radio Button group attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyOptions("option1", "option2");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Paragraph attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-paragraph" });
        cy.get("[data-cy=\"paragraph\"]").parent().find("div p").eq(-1).should("have.text", "fb-paragraph");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify File Upload attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-fileupload" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-fileupload" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Blank Template Form attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-blank-template" });
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
        cy.contains("image.jpg").should("exist");
      });

      it("Verify Quantity attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Timer attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-timer" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-timer" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Purchase Order attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-purchase-order" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-purchase-order" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Receive Purchase Order attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-receive-purchase-order" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-receive-purchase-order" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify PO Approval Matrix attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-po-approval-matrix" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-po-approval-matrix" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Instructions Media Upload attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-instructions" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-instructions" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Evidence Media Upload attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-evidence" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-evidence" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify EB Procedure attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "Step #1" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Equipment attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-equipment" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-equipment" });
        cy.fbVerifyCheckboxValue("preventativeMaintenance");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify TextField with range attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-range" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-range" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-range placeholder" });
        cy.fbVerifyCheckboxName("editorConfig.rangeOption",
          "editorConfig.criticalToQuality", "editorConfig.inspection");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Section attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-section" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-section" });
        cy.fbVerifyCheckboxValue("inspectionSection");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Subsection attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "FB-SUBSECTION" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-subsection" });
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Step attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-step" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-step" });
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Approvals attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-approvals" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-approvals" });
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Inline Approval attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-inline-approval" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-inline-approval" });
        cy.get("[data-cy=\"editorConfig.approvers\"]").parent().should("contain", USERS[1].email);
        cy.get("[data-cy=\"editorConfig.groups\"]").parent().should("contain", "Everyone");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Request Approval attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-request-approval" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-request-approval" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Checkpoint attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-checkpoint" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-checkpoint" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Create a Label attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-create-label" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-create-label" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Implementation Task attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-task" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-task" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify MPI attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-mpi" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-mpi" });
        cy.get("[data-cy=\"instructionsDocument\"]").should("have.value", "FM-00001 - rev 1 - AR Form");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Select Document attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-select-doc" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-select-doc" });
        cy.get("[data-cy=\"options\"]").parent().should("contain", "AR Form");
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Action Button attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "Send Email" });
        cy.fbVerifyCheckboxValue("SendEmailWithFormToFill", "SendSurveyEmailWithFormToFill");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });
    });

    context("Check fields in Preview Mode", () => {
      it("Open Preview dialog", () => {
        cy.fbClickButton({ el: "FBWorkspace-clickView" });
      });

      it("Add and check Quantity field", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").clear().arrowType("1");
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").should("have.value", "1");
      });

      it("Add and check Text Editor field", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[data-cy^=\"fb-text-editor-\"]").find("div[contenteditable]")
          .click({ force: true }).arrowType("fb-text-editor-value");
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[data-cy^=\"fb-text-editor-\"]").parent().find("p")
          .should("have.text", "fb-text-editor-value");
      });

      it("Add and check Date picker field", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-datepicker-]").parent().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-datepicker-]").invoke("val").should("not.be.empty");
      });

      it("there should be no edit for field", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify location linked on Hyperlink", () => {

        cy.window().then((win) => {
          cy.spy(win, "open").as("redirect");
        });
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[name^=fb-hyperlink-]").arrowClick();
        cy.get("@redirect").should("be.calledWith", "https://google.com");
      });

      it("Close Preview dialog", () => {
        cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      });
    });

    context("Edit and verify Form fields", () => {
      it("Edit Quantity field", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
        cy.fbEnterNameValue({ name: "label", value: "fb-quantity1" });
        cy.fbAddNewFieldButton();
      });

      it("Edit Blank Template field", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
        cy.fbEnterNameValue({ name: "label", value: "fb-blank-template1" });
        cy.fbAddNewFieldButton();
      });

      it("Edit Autocomplete field", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete1" });
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Verify updated Quantity field", () => {
        cy.get("[data-cy=\"fb-quantity1\"]").should("exist");
        cy.get("[data-cy=\"fb-quantity1\"]").should("have.text", "fb-quantity1");
      });

      it("Verify updated Blank Template field", () => {
        cy.get("[data-cy=\"fb-blank-template1\"]").should("exist");
        cy.get("[data-cy=\"fb-blank-template1\"]").should("have.text", "fb-blank-template1");
      });

      it("Verify updated Autocomplete field", () => {
        cy.get("[data-cy=\"fb-autocomplete1\"]").should("exist");
        cy.get("[data-cy=\"fb-autocomplete1\"]").should("have.text", "fb-autocomplete1");
      });

      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Create Clinical Protocol doc", () => {
      it("Click New button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle({ name: "test title" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "test description" });
      });

      it("Enter Quantity field value", () => {
        cy.get("input[name^=\"fb-quantity-\"]").arrowType("1");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Autocomplete field value", () => {
        cy.get("input[data-cy^=\"fb-autocomplete-\"]").arrowClick().autocompleteSelect("test title");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter Date picker field value", () => {
        cy.get("input[name^=\"fb-datepicker-\"]").parent().find("button").arrowClick({ force: true });
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("Click Save button", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Verify Clinical Protocol doc values", () => {
      it("Verify Quantity values", () => {
        cy.get("input[name^=\"fb-quantity-\"]").should("have.value", "1");
      });

      it("Verify Date picker values", () => {
        cy.get("input[name^=\"fb-datepicker-\"]").invoke("val").should("not.be.empty");
      });

      it("Verify Not to edit Quantity field", () => {
        cy.get("[data-cy=\"fb-quantity1\"]").parentsUntil(".MuiFormControl-root")
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify Not to edit Blank Template field", () => {
        cy.get("[data-cy=\"fb-blank-template1\"]").parentsUntil(".MuiFormControl-root")
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify Not to edit Hyperlink field", () => {
        cy.get("[name^=fb-hyperlink-]").parent().parent().parent()
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify location linked on Hyperlink", () => {
        cy.window().then((win) => {
          cy.spy(win, "open").as("redirect");
        });
        cy.get("[name^=fb-hyperlink-]").arrowClick();
        cy.get("@redirect").should("be.calledWith", "https://google.com");
      });

      it("Verify Autocomplete values", () => {
        cy.get("input[data-cy^=\"fb-autocomplete-\"]").parent().invoke("text").should("not.be.empty");
      });

      it("Verify Not to edit Text Editor field", () => {
        cy.get("[data-cy=\"fb-text-editor\"]").parentsUntil(".MuiFormControl-root")
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });

      it("Verify Not to edit Date picker field", () => {
        cy.get("[data-cy=\"fb-datepicker\"]").parentsUntil(".MuiFormControl-root")
          .should("not.have.descendants", "[data-cy=edit-schema-item]");
      });
    });
  });
});
