/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CSLDocument } from "../../utils/constants/documentTypes/csl";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let group;
let createdPartDocument;
let partDocumentType;
let approvalRequestDocumentType;
let initialArDocument;

const PART_DOCUMENT_TYPE_NAME = "Part";

context("Export Part Lot", () => {
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
              CSLDocument,
              Part,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create part document", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: employeeLoginFirst.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part document</p>",
              document: {
                docId: "PRT-00005",
                documentType: {
                  id: partDocumentType[0].id,
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
              name: "Part document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: employeeLoginFirst.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
              },
              employeeId: employeeLoginFirst.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create new Part Lot form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Part Lot form'", () => {
      cy.drEnterDocumentTitle({ name: "Part Lot Form" });
    });

    it("Enter description 'New form template for Part Lot'", () => {
      cy.drEnterDocumentDescription({ description: "New form template for Part lot" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Component Specification Lot' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Component Specification Lot" });
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
    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Initial Quantity Details", () => {
      cy.get(`[data-cy="Initial Quantity"]`).should("exist");
    });

    it("Verify Usable Quantity Details", () => {
      cy.get(`[data-cy="Usable Quantity"]`).should("exist");
    });

    it("Verify Expiration Date Details", () => {
      cy.get(`[data-cy="Expiration Date"]`).should("exist");
    });

    it("Verify Part Selection Details", () => {
      cy.get(`[data-cy="Part Selection"]`).should("exist");
    });

    it("Verify 100% Inspection Override", () => {
      cy.get(`[data-cy="100% Inspection Override"]`).should("exist");
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Verify Approvals Section", () => {
      cy.get(`input[data-cy^="fb-approvals-fb-approvals"]`).should("exist");
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
      cy.get(`[data-cy="edit-schema-item"]`).last().arrowClick({ force: true });
      cy.fbEnterPlaceholder({ placeholder: " changed" });
      cy.fbAddNewFieldButton();
      cy.get(`textarea[placeholder^="fb-textfield placeholder 2 changed"]`).should("exist");
      cy.get(`[data-cy="remove-schema-item"]`).last().arrowClick({ force: true });
    });

    it("Move Component", () => {
      cy.get("[data-cy='fb-textfield-1']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Export", () => {
    it("Export template", () => {
      cy.get(`[data-cy="FBWorkspace-exportTemplate"]`).eq(0).click();
      cy.get(`[data-cy="fb-template-name"]`).arrowType("CPL_Form_Template");
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });
  });

  context("Create new Part Lot form 2", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Part Lot form 2'", () => {
      cy.drEnterDocumentTitle({ name: "Part Lot Form 2" });
    });

    it("Enter description 'New form template for Part Lot'", () => {
      cy.drEnterDocumentDescription({ description: "New form template for Part lot 2" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Component Specification Lot' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Component Specification Lot" });
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

  context("import", () => {
    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/CPL_Form_Template.json");
    });

    it("Verify TextField attributes", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbVerifyNameValue({ name: "label", value: "fb-textfield-1" });
      cy.fbVerifyNameValue({ name: "placeholder", value: "fb-textfield placeholder 1" });
      cy.fbVerifyNameValue({ name: "rows", value: "2" });
      cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbClickButton({ el: "fb-editor-actions-cancel" });
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Verify Initial Quantity Lenth", () => {
      cy.get(`[data-cy="Initial Quantity"]`).should("have.length", 1);
    });

    it("Add Checkbox group", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });
  });

  context("Create a CSL from inline form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the CSL inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "Part Lot Form" });

      cy.dlSelectFirstDocument();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "CSL Record" });
    });

    it("Enter text in textfield", () => {
      cy.get(`[name^="fb-textfield-1"]`).arrowType("Test one");
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Enter quantity received", () => {
      cy.get(`[name="lot_quantity"]`).arrowType("2");
    });

    it("Enter usable received", () => {
      cy.get(`[name="lot_usable_quantity"]`).arrowType("1");
    });

    it("Enter Expiration date", () => {
      cy.get(`input[name^="lot_expiry_date"]`).parent().find("button").arrowClick({ force: true });
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Select Part", () => {
      cy.get(`[data-cy="lot_part"]`).autocompleteSelect("Part document");
    });

    it("Check 100% override", () => {
      cy.get(`[value="100% Inspection Override"]`).check();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add one approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve step", () => {
      cy.ebApprove();
    });

    it("Check status should be Released", () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });
});
