// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { CyRoutes } from "./../../support/routes";

let createdCompany;
let loginResponse;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
let asyncTasksGroup;

const documentRevisionName = "New document for testing AR";
const approvalRequestTitle = "Approval request from newly created form";
const approvalRequestFormName = "New Approval request form template";

context("Approval request implementation tasks", () => {
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
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
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

    it("[API]Creates document revision for approval", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description</p>",
            document: {
              docId: "CP-00004",
              documentType: {
                id: componentSpecificationDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: group.body[0].id,
                  },
                ],
              },
            },
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Check status should be Draft", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("Check predefined fields", () => {
    it("Verify Approvers", () => {
      cy.get(`[data-cy="Approvers"]`).should("exist");
    });

    it("Select Documents tab", () => {
      cy.drSelectDocumentTab();
    });

    it("Verify Approval Request Details", () => {
      cy.get(`[data-cy="Approval Request Details"]`).should("exist");
    });

    it("Verify Add Document block", () => {
      cy.get(`[data-cy="fb.add.document"]`).should("exist");
    });

    it("Select Change Details tab", () => {
      cy.drSelectChangeDetailsTab();
    });
  });

  context("Add Form fields and Release", () => {
    it("Add TextField 1", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 1" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbAddNewFieldButton();
    });

    it("Add TextField 2", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbSelectRadioButtonValue({ value: "visibility" });
      cy.fbAddNewFieldButton();
    });

    it("Verify Edit, Move and Remove", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
      cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
    });

    it("Move component", () => {
      cy.get("[data-cy='fb-textfield-1']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(2)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Verify Text Field Remove enabled", () => {
      cy.fbVerifyElementClassByLabel({
        label: "fb-textfield-1", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Select Documents tab", () => {
      cy.drSelectDocumentTab();
    });

    it("Verify Approval Request Details disabled", () => {
      cy.fbVerifyElementClassByLabel({
        label: "Approval Request Details", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Add Document disabled", () => {
      cy.get(`[data-cy="fb.add.document"]`).should("have.attr", "disabled");
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create a Other type form", () => {
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

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Check status should be Draft", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Add TextField 2", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 2" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbSelectRadioButtonValue({ value: "visibility" });
      cy.fbAddNewFieldButton();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click();
      cy.fbAddNewFieldButton();
    });

    it("Add Date picker", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click();
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click();
      cy.fbAddNewFieldButton();
    });

    it("Add TextField 1", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder 1" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify Edit, Move and Remove", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield-2" });
        cy.fbEnterPlaceholder({ placeholder: " changed" });
        cy.fbAddNewFieldButton();
        cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");

        cy.fbClickRemoveBtn({ label: "fb-textfield-2" });
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Save", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.listLoadingElementShouldNotExist();
    });

    it("Move component", () => {
      cy.unClick();
      cy.get("[data-cy='fb-textfield-1']").scrollIntoView();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy='fb-textfield-1']").trigger("mouseover", { force: true }).wait(500);
      cy.get(".drag-handle").eq(3)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(2)
        .realMouseMove(0, -100, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Click on ‘Approve & Release’", () => {
      cy.get(`[data-cy="ApproveAndRelease-button"]`).arrowClick().wait(1000);
    });

    it("Select document template as 'AR form'", () => {
      cy.get(`[data-cy="field-formDocument"]`).autocompleteSelect("New Approval request form template");
    });

    it("Enter password", () => {
      cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
    });

    it("Approve and Release the document", () => {
      cy.get(`[data-cy="ApproveAndRelease-submit"]`).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Export", () => {
    it("Export template", () => {
      cy.get(`button[data-cy="FBWorkspace-exportTemplate"]`).scrollIntoView();
      cy.get(`button[data-cy="FBWorkspace-exportTemplate"]`).click();
      cy.get(`[data-cy="fb-template-name"]`).arrowType("Other_Form_Template");
      cy.unClick();
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });
  });

  context("Create output with newly created form", () => {
    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Other type document" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });
  });

  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Choose newly AR Form template", () => {
      cy.get("div[data-cy='field-select-form']>#FormList-selectForm").arrowClick();
      cy.get("div[id^=react-select]").contains(approvalRequestFormName).arrowClick();
      cy.get("[data-cy='create.approval.request.continue']").arrowClick();
    });

    it("Enter title AR title: " + approvalRequestTitle, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestTitle });
    });

    it("Enter description 'AR from New form template for approval request'", () => {
      cy.arEnterApprovalRequestDescription({ description: "CR from New form template for approval request" });
    });

    it("Add created document revision", () => {
      cy.get(`[data-cy="tabCon-tabId.documents"]`).arrowClick();
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click on Save", () => {
      cy.arSaveApiCall();
    });

    it("Switch to ChangeDetails tab", () => {
      cy.arSelectChangeDetailsTab();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[1].email });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Save", () => {
      cy.arSaveApiCall();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });

    it("Approve AR", () => {
      cy.arApproveAR();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Create a Other type form 2", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'test title 2'", () => {
      cy.drEnterDocumentTitle({ name: "test title 2" });
    });

    it("Enter document description 'test description 2'", () => {
      cy.drEnterDocumentDescription({ description: "test description 2" });
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

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Check status should be Draft", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("import", () => {
    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("../fixtures/Other_Form_Template.json");
    });
  });

  context("Verify Fields", () => {
    it("Verify TextField attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder 1" });
      cy.fbVerifyNameValue({ name: "rows", value: "2" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
    });
  });
});

export { };
