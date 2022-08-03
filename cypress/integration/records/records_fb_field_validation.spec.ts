// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const currentDate = moment().tz("America/Los_Angeles").format("MMMM D, YYYY");
let createdCompany;
let loginResponse;
let developersGroup;
let adminSessionId;
let adminEmployee;
let employeeToDevs;
let thirdEmployee;
let RDdocumentType;

let recFormId;
let recDocId;
let emailsFromInbox;
const pages = ["", "", "", ""];
let downloadUrl;
let tmpRegex;
let downloadFile;
let dateAfterEmailShouldArrive;
let fileId;
let arId;

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
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
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

      it("Upload attachement picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Verify Add Field section", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbVerifySectionsOnAddField("Section", "Inputs", "Approvals", "Custom Controls",
          "Instructions", "Buttons", "Actions");
        cy.fbCheckFieldsExistSectionList("Section", "Subsection", "Step");
        cy.fbCheckFieldsExistInputsList("Text field", "Checkbox group", "Autocomplete", "Text Editor",
          "Date picker", "Hyperlink", "Select", "Radio Button group", "Paragraph", "File Upload",
          "Blank Template Form", "Quantity", "Timer", "Purchase Order", "Receive Purchase Order",
          "PO Approval Matrix", "Instructions Media upload", "Evidence Media upload", "EB Procedure",
          "PI Procedure", "Equipment", "Text field with range", "Supplier");
        // cy.fbCheckFieldsDoesntExistOnInputsList("LHR Step");
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
          cy.get(`[data-cy="edit-schema-item"]`).arrowClick();
          cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder changed" });
          cy.fbAddNewFieldButton();
          cy.get(`textarea[placeholder^="fb-textfield placeholder changed"]`).should("exist");
          cy.get(`[data-cy="remove-schema-item"]`).arrowClick();
          cy.dragAndDrop({
            fromSelector: `[class="MuiFormControl-root MuiFormControl-fullWidth"]`,
            toSelector: `[class="drag-handle"]`,
          });
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
    });

    context("Approve and Release document", () => {
      it("Approve and Release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Approve and Release document", () => {
      it("Download excel template file", () => {
        cy.excelDownloadTemplate({ saveFileName: excelTemplateSaveName });
      });
    });
  });

  context("Fill in record attributes and release document", () => {
    it("Enters title 'Approval Record title'", () => {
      cy.drEnterDocumentTitle({ name: "Approval Record title" });
      cy.unClick();
    });

    it("Upload attachement picture 'image.jpg'", () => {
      cy.get("input[id=\"attachments-button-file\"]").attachFile("image.jpg");
      cy.listLoadingElementShouldNotExist();
    });

    it(`Add first Approver as ${USERS[1].name}`, () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Save Record'", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("release button click'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview, CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
    });

  });

  context("Approve form and close it", () => {
    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record button click", () => {
      cy.ebApprove();
    });
  });
});


export { };

