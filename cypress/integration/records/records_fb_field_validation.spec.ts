// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let RDdocumentType;

context("Records flow", () => {
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
      SystemRequirement("REQ-0400", "REQ-0410", "REQ-0420", "REQ-0440");
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
              RecordDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          employeeToDevs = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
          done();
        });
      });
    });

    context("[API]Update record document type", () => {
      it("Change fields config in record document type", () => {
        cy.drUpdateDocumentTypeName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          id: RDdocumentType[0].id,
          payload: {
            fieldsConfig: {
              D: {
                visible: false,
                required: false,
              },
              E: {
                label: "Record Type",
                visible: false,
                required: true,
              },
              F: {
                label: "Record ID",
                visible: false,
                required: true,
              },
              G: {
                visible: false,
                required: false,
              },
              I: {
                visible: false,
              },
              J: {
                visible: false,
              },
              K: {
                label: "Void",
                visible: true,
              },
              L: {
                label: "Correction",
                visible: true,
              },
              N: {
                label: "Approve and Release",
                visible: true,
              },
              O: {
                label: "Record History",
                visible: true,
              },
              R: {
                visible: false,
              },
              S: {
                label: "Update Record",
                visible: true,
              },
              A1: {
                label: "WIP",
                visible: true,
              },
              A2: {
                label: "Voided",
                visible: true,
              },
              A3: {
                label: "Archive",
                visible: true,
              },
              P1: {
                label: "WIP",
                visible: true,
              },
              P2: {
                label: "Voided",
                visible: true,
              },
              P3: {
                label: "Archive",
                visible: true,
              },
            },
          },
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

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        adminSessionId = loginResponse.sessionId;
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
  });

  context("Create first Record with form", () => {
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
      it("Enters title 'Lot History Record'", () => {
        cy.drEnterDocumentTitle({ name: "Lot History Record" });
      });

      it("Enters description 'Lot History Record description'", () => {
        cy.drEnterDocumentDescription({ description: "Lot History Record description" });
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

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Check status should be Draft", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });

      it("Verify Add Field section", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.contains("Form Builder Library").should("exist");
        cy.get(`input[placeholder^="Search"]`).should("exist");
        cy.fbVerifySectionsOnAddField("Section", "Inputs", "Approvals", "Custom Controls",
          "Instructions", "Buttons", "Actions");
        cy.fbCheckFieldsExistSectionList("Section", "Subsection", "Step");
        cy.fbCheckFieldsExistInputsList("Text field", "Checkbox group", "Autocomplete", "Text Editor",
          "Date picker", "Hyperlink", "Select", "Radio Button group", "Paragraph", "File Upload",
          "Blank Template Form", "Quantity", "Timer", "Purchase Order", "Receive Purchase Order",
          "PO Approval Matrix", "Instructions Media upload", "Evidence Media upload", "EB Procedure",
          "PI Procedure", "Equipment", "Text field with range", "Supplier");
        cy.fbCheckFieldsDoesntExistOnInputsList("LHR Step");
        cy.fbCheckFieldsExistApprovalsList("Approvals", "Inline Approval", "Request Approval");
        // cy.fbCheckFieldsExistCustomControlsList("Dynamic form");
        cy.fbCheckFieldsExistInstructionsList("MPI", "Select Document(s)");
        cy.fbCheckFieldsExistButtonsList("Checkpoint", "Create a Label", "Implementation Task");
        cy.fbCheckFieldsExistActionsList("Action Button");
        cy.contains("Form Builder Library").parent().find("button").arrowClick({ force: true });
      });

      it("Verify Search Field for `text`", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.get(`input[placeholder^="Search"]`).clear().arrowType("text").arrowClick();
        cy.unClick();
        cy.get(`[data-cy="Text field"]`).should("exist");
        cy.get(`[data-cy="Text Editor"]`).should("exist");
        cy.get(`[data-cy="Text field with range"]`).should("exist");
      });

      it("Verify Search Field for `upload`", () => {
        cy.get(`input[placeholder^="Search"]`).clear().arrowType("upload").arrowClick();
        cy.unClick();
        cy.get(`[data-cy="File Upload"]`).should("exist");
        cy.get(`[data-cy="Instructions Media upload"]`).should("exist");
        cy.get(`[data-cy="Evidence Media upload"]`).should("exist");
      });

      it("Verify Search Field for `inline`", () => {
        cy.get(`input[placeholder^="Search"]`).clear().arrowType("inline").arrowClick();
        cy.unClick();
        cy.get(`[data-cy="Inline Approval"]`).should("exist");
        cy.get(`[data-cy="Inline Approval"]`).parent()
          .find(`[class="MuiButtonBase-root MuiIconButton-root"]`).eq(0).click();
        /* cy.get(`[data-cy="Inline Approval"]`).parent()
          .find(`[class="MuiButtonBase-root MuiIconButton-root"]`)
          .eq(0).should("have.css", "color", "rgb(252, 222, 222)"); */
        cy.get(`input[placeholder^="Search"]`).clear();
      });

      it("Verify Favorites", () => {
        cy.fbVerifySectionsOnAddField("Favorites");
        cy.fbCheckFieldsExistFavoritesList("Inline Approval");
        cy.get(`[data-cy="Inline Approval"]`).parent()
          .find(`[class="MuiButtonBase-root MuiIconButton-root"]`).eq(0).click();
        cy.fbVerifySectionsNotOnAddField("Favorites");
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

        it("Add Radio Button group", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
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

        it("Add Inline Approval", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
          cy.listLoadingElementShouldNotExist();
          cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
          cy.get("[data-cy=\"editorConfig.approvers\"]").autocompleteSelect(`${USERS[1].email }`);
          cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
        });
      });

      context("Verify Form fields", () => {
        it("Verify TextField attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-textfield" });
          cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder" });
          cy.fbEnterPlaceholder({ placeholder: " changed" });
          cy.fbVerifyNameValue({ name: "rows", value: "2" });
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
          cy.fbClickRemoveBtn({ label: "fb-textfield" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Checkbox group attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-checkbox-group" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-checkbox-group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group-changed" });
          cy.fbVerifyOptions("option1", "option2");
          cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-checkbox-group-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-checkbox-group-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Autocomplete attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
          cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-changed" });
          cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
          cy.get("[data-cy=\"optionId\"]").should("have.value", "Document revisions");
          cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-autocomplete-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-autocomplete-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Text Editor attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-text-editor" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-text-editor" });
          cy.fbEnterNameValue({ name: "label", value: "fb-text-editor-changed" });
          cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-text-editor-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-text-editor-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Date picker attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-datepicker" });
          cy.fbEnterNameValue({ name: "label", value: "fb-datepicker-changed" });
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-datepicker-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-datepicker-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Hyperlink attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-hyperlink" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-hyperlink" });
          cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink-changed" });
          cy.fbVerifyNameValue({ name: "linkUrl", value: "google.com" });
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get(`[name^="hyperlink"]`).should("contain", "fb-hyperlink-changed");
          cy.fbClickRemoveBtn({ label: "fb-hyperlink-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
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
          cy.fbEnterNameValue({ name: "label", value: "fb-select-field-changed" });
          cy.fbVerifyNameValue({ name: "placeholder", value: "fb-select-field placeholder" });
          cy.fbVerifyOptions("option1", "option2");
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-select-field-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-select-field-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Radio Button group attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group-changed" });
          cy.fbVerifyOptions("option1", "option2");
          cy.fbVerifyOptions("option1", "option2");
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-radiobutton-group-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-radiobutton-group-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Paragraph attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-paragraph" });
          cy.get("[data-cy=\"paragraph\"]").parent().find("div p").eq(-1).should("have.text", "fb-paragraph");
          cy.fbClickButton({ el: "fb-editor-actions-cancel" });
        });

        it("Verify File Upload attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-fileupload" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-fileupload" });
          cy.fbEnterNameValue({ name: "label", value: "fb-fileupload-changed" });
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-fileupload-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-fileupload-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Blank Template Form attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-blank-template" });
          cy.fbEnterNameValue({ name: "label", value: "fb-blank-template-changed" });
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-blank-template-changed\"]").should("exist");
          cy.contains("image.jpg").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-blank-template-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Quantity attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
          cy.fbEnterNameValue({ name: "label", value: "fb-quantity-changed" });
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-quantity-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-quantity-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Timer attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-timer" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-timer" });
          cy.fbEnterNameValue({ name: "label", value: "fb-timer-changed" });
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-timer-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-timer-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Section attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-section" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-section" });
          cy.fbEnterNameValue({ name: "label", value: "fb-section-changed" });
          cy.fbVerifyCheckboxValue("inspectionSection");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-section-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-section-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Subsection attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "FB-SUBSECTION" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-subsection" });
          cy.fbEnterNameValue({ name: "label", value: "fb-subsection-changed" });
          cy.fbAddNewFieldButton();
          cy.get(`[name^="subsection"]`).should("contain", "fb-subsection-changed");
          cy.fbClickRemoveBtn({ label: "fb-subsection-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });

        it("Verify Inline Approval attributes", () => {
          cy.fbClickLabelEditHiddenBtn({ label: "fb-inline-approval" });
          cy.fbVerifyNameValue({ name: "label", value: "fb-inline-approval" });
          cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval-changed" });
          cy.get("[data-cy=\"editorConfig.approvers\"]").parent().should("contain", USERS[1].email);
          cy.get("[data-cy=\"editorConfig.groups\"]").parent().should("contain", "Everyone");
          cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
          cy.get("[data-cy=\"fb-inline-approval-changed\"]").should("exist");
          cy.fbClickRemoveBtn({ label: "fb-inline-approval-changed" });
          /* cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          }); */
        });
      });

      context("Create FORM document with Form fields again", () => {
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

        it("Add Radio Button group", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbGroupOptions("option1", "option2");
          cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
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

        it("Add Inline Approval", () => {
          cy.fbClickAddNewHiddenBtn();
          cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
          cy.listLoadingElementShouldNotExist();
          cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
          cy.get("[data-cy=\"editorConfig.approvers\"]").autocompleteSelect(`${USERS[1].email }`);
          cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
          cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
          cy.fbAddNewFieldButton();
        });

        it("Save the document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });
    });

    context("Approve and Release document", () => {
      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Export the template", () => {
      it("Export template", () => {
        cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).eq(0).click();
        cy.get(`[data-cy="fb-template-name"]`).arrowType("FB_fields");
        cy.get(`[data-cy="common.add"]`).arrowClick();
      });
    });
  });

  context("Fill in record attributes and release document", () => {
    it("Click on 'New' button", () => {
      cy.fbClickButton({ el: "PreviewControlsContainer-createNew" });
    });

    it("Enters title 'Test Record title'", () => {
      cy.drEnterDocumentTitle({ name: "Test Record title" });
      cy.unClick();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.get("input[id=\"attachments-button-file\"]").attachFile("image.jpg");
      cy.listLoadingElementShouldNotExist();
    });

    it("Save Record'", () => {
      cy.drSaveDocumentWithoutaudit();
    });
  });

  context("Start New document creation flow", () => {
    it("Navigate back to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/FB_fields.json");
    });
  });

  context("Verify Form fields", () => {
    it("Verify TextField attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder" });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbVerifyNameValue({ name: "rows", value: "2" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
      cy.fbClickRemoveBtn({ label: "fb-textfield" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Checkbox group attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-checkbox-group" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group-changed" });
      cy.fbVerifyOptions("option1", "option2");
      cy.fbVerifyCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-checkbox-group-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-checkbox-group-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Autocomplete attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-changed" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
      cy.get("[data-cy=\"optionId\"]").should("have.value", "Document revisions");
      cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-autocomplete-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-autocomplete-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Text Editor attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-text-editor" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor-changed" });
      cy.fbVerifyOptions("SelectOne", "SelectTwo", "SelectThree");
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-text-editor-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-text-editor-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Date picker attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker-changed" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-datepicker-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-datepicker-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Hyperlink attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-hyperlink" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink-changed" });
      cy.fbVerifyNameValue({ name: "linkUrl", value: "google.com" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-hyperlink-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-hyperlink-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
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
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field-changed" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-select-field placeholder" });
      cy.fbVerifyOptions("option1", "option2");
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-select-field-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-select-field-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Radio Button group attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group-changed" });
      cy.fbVerifyOptions("option1", "option2");
      cy.fbVerifyOptions("option1", "option2");
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-radiobutton-group-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-radiobutton-group-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Paragraph attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-paragraph" });
      cy.get("[data-cy=\"paragraph\"]").parent().find("div p").eq(-1).should("have.text", "fb-paragraph");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
    });

    it("Verify File Upload attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-fileupload" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload-changed" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-fileupload-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-fileupload-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Blank Template Form attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-blank-template" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template-changed" });
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-blank-template-changed\"]").should("exist");
      cy.contains("image.jpg").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-blank-template-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Quantity attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity-changed" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-quantity-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-quantity-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Timer attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-timer" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-timer" });
      cy.fbEnterNameValue({ name: "label", value: "fb-timer-changed" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-timer-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-timer-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Section attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-section" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-section" });
      cy.fbEnterNameValue({ name: "label", value: "fb-section-changed" });
      cy.fbVerifyCheckboxValue("inspectionSection");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-section-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-section-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Subsection attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "FB-SUBSECTION" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-subsection" });
      cy.fbEnterNameValue({ name: "label", value: "fb-subsection-changed" });
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-subsection-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-subsection-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });

    it("Verify Inline Approval attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-inline-approval" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-inline-approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval-changed" });
      cy.get("[data-cy=\"editorConfig.approvers\"]").parent().should("contain", USERS[1].email);
      cy.get("[data-cy=\"editorConfig.groups\"]").parent().should("contain", "Everyone");
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.get("[data-cy=\"fb-inline-approval-changed\"]").should("exist");
      cy.fbClickRemoveBtn({ label: "fb-inline-approval-changed" });
      /* cy.dragAndDrop({
        fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
        toSelector: `[class="drag-handle"]`,
      }); */
    });
  });
});


export { };

