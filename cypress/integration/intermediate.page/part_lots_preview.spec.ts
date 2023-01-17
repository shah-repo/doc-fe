// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { momentInPST } from "../../utils/constants/dateHandler";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let partDocumentType;
let createdPartDocument;
let approvalRequestDocumentType;
let initialArDocument;

const docType = "Form";
const lotsOutputDocType = "Component Specification Lot";

context("Part Lot Preview mode validation", () => {
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
              Part,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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

    it("[API]Create part document", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
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
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
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
      cy.drEnterDocumentTitle({ name: lotsOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: lotsOutputDocType + " description" });
    });

    it(`Select ${docType} document type`, () => {
      cy.drSelectDocumentType({ documentType: docType });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Select output document type", () => {
    it(`Select ${lotsOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: lotsOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify schema fields are not displayed", () => {
    it("Check 'Initial Quantity' is not displayed", () => {
      cy.intPageVerifyInitialQuantityNotExist();
    });

    it("Check 'Usable Quantity' is not displayed", () => {
      cy.intPageVerifyUsableQuantityNotExist();
    });

    it("Check 'Expiration Date' is not displayed", () => {
      cy.intPageVerifyExpirationDateNotExist();
    });

    it("Check 'Part Selection' is not displayed", () => {
      cy.intPageVerifyPartSelectionNotExist();
    });

    it("Check '100% Inspection Override' is not displayed", () => {
      cy.intPageVerifyInspectionOverrideNotExist();
    });

    it("Check 'Approvals' is not displayed", () => {
      cy.intPageVerifyApprovalsNotExist();
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

      it("Verify 'Details' tab is displayed", () => {
        cy.verifyTabs("overview", "details");
      });
    });

    context("verify default fields are displayed", () => {
      it("Verify Document type is displayed", () => {
        cy.intPageVerifyDocTypeExist();
      });

      it("Verify Document id is not editable", () => {
        cy.intPageVerifyDocIdIsNotEditable();
      });

      it("Verify 'Revision Stage' field is displayed", () => {
        cy.intPageVerifyRevisionStageExist();
      });

      it("Verify 'Training required' field is displayed", () => {
        cy.intPageVerifyTrainingRequiredExist();
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
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

      it("Check 'Approvals' is displayed", () => {
        cy.intPageVerifyApprovalsExist();
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });
    });

    context("verify predefined fields are displayed", () => {
      it("Click 'Preview Layout' button", () => {
        cy.intPageClickPreviewLayout();
      });

      it("Navigate to detail tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Check 'Initial Quantity' is displayed", () => {
        cy.intPageVerifyInitialQuantityExist();
      });

      it("Check 'Usable Quantity' is displayed", () => {
        cy.intPageVerifyUsableQuantityExist();
      });

      it("Check 'Expiration Date' is displayed", () => {
        cy.intPageVerifyExpirationDateExist();
      });

      it("Check 'Part Selection' is displayed", () => {
        cy.intPageVerifyPartSelectionExist();
      });

      it("Check '100% Inspection Override' is displayed", () => {
        cy.intPageVerifyInspectionOverrideExist();
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });
    });
  });

  context("Click 'Create Document' button and verify predefined fields are displayed", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab();
    });

    it("verify form preview button in Overview Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.intPageVerifyInitialQuantityExist();
    });

    it("Check 'Usable Quantity' is displayed", () => {
      cy.intPageVerifyUsableQuantityExist();
    });

    it("Check 'Expiration Date' is displayed", () => {
      cy.intPageVerifyExpirationDateExist();
    });

    it("Check 'Part Selection' is displayed", () => {
      cy.intPageVerifyPartSelectionExist();
    });

    it("Check '100% Inspection Override' is displayed", () => {
      cy.intPageVerifyInspectionOverrideExist();
    });

    it("Close Preview dialog", () => {
      cy.intPageClosePreviewDialog();
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

  context("Verify Preview mode for overview tab after doc creation", () => {
    it("Select overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Verify 'Add Field' button displayed", () => {
      cy.intPageVerifyAddFieldExist();
    });

    it("check 'Form Options' are diplayed at bottom center", () => {
      cy.intPageVerifyFormOptionsExist();
    });

    it("Click on Preview", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify Approval should be visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy^="fb-approvals"]`).should("exist");
    });

    it("Select Approval", () => {
      cy.get(`.MuiDialogContent-root [data-cy^="fb-approvals"]`).click().autocompleteSelect(USERS[1].name);
    });

    it("Close Preview window", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });

    it("Reopen Preview window and verify approval block should not have any value", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.listLoadingElementShouldNotExist();
      cy.get(`.MuiDialogContent-root [data-cy^="fb-approvals"]`).should("not.contain.value");
    });
  });

  context("Verify Preview mode after doc creation for detail tab", () => {
    it("Select detail tab", () => {
      cy.get("[data-cy=\"tabCon-tabId.details\"]").last().arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify lot  quantity visible", () => {
      cy.get(`.MuiDialogContent-root [name="lot_quantity"]`).should("be.visible");
    });

    it("Verify 'usable quantity' field should be visible", () => {
      cy.get(`.MuiDialogContent-root [name="lot_usable_quantity"]`).should("be.visible");
    });

    it("Verify Expiration date is visible", () => {
      cy.get(`.MuiDialogContent-root input[name="lot_expiry_date"]`).should("be.visible");
    });

    it("Verify part selection is visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy="lot_part"]`).should("be.visible");
    });

    it("Verify '100 % inspection override' is visible", () => {
      cy.get(`.MuiDialogContent-root [name="100-inspection-override"]`).should("be.visible");
    });
  });

  context("Verify fields in preview mode editable or not", () => {
    it("Enter initial lot  quantity", () => {
      cy.get(`.MuiDialogContent-root [name="lot_quantity"]`).arrowType("10");
    });

    it("Verify 'usable quantity' field should be visible", () => {
      cy.get(`.MuiDialogContent-root [name="lot_usable_quantity"]`).arrowType("8");
    });

    it("Enter Expiration date", () => {
      cy.get(`.MuiDialogContent-root input[name^="lot_expiry_date"]`)
        .parent().find("button").arrowClick({ force: true });
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Select Part", () => {
      cy.get(`.MuiDialogContent-root [data-cy="lot_part"]`).autocompleteSelect("Part document");
      cy.unClick();
    });

    it("Check 100% override", () => {
      cy.get(`.MuiDialogContent-root [value="100% Inspection Override"]`).check();
    });

    it("Close the preview mode", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });

    it("Reopen the preview mode and verify enter detail not saved", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy=\"tabCon-tabId.details\"]").last().arrowClick({ force: true });
      cy.listLoadingElementShouldNotExist();
      cy.get(`.MuiDialogContent-root [name="lot_quantity"]`).should("not.contain.value", "10");
      cy.get(`.MuiDialogContent-root [name="lot_usable_quantity"]`).should("not.contain.value", "8");
      cy.get(`.MuiDialogContent-root input[name^="lot_expiry_date"]`)
        .should("not.contain.value", momentInPST().format("M/D/YYYY"));
      cy.get(`.MuiDialogContent-root [data-cy="lot_part"]`).should("not.contain.value", "Part document");
      cy.get(`.MuiDialogContent-root [value="100% Inspection Override"]`).should("not.be.checked");
    });

    it("Close the preview mode dialog", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Add FB fields and verify field 2 is visible when field 1 has value 'YES'", () => {
    it("Add Checkbox group", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("isFieldEnabled");
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Autocomplete", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.get("input[value^='disabled']").check(); // validators.required_if_in
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox");
      cy.get(`[name="validators.required_if_in.value"]`).parent().find("input").check().wait(500);
      cy.fbAddNewFieldButton();
    });

    it("Click form preview button", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify fb Autocomplete input is disabled ", () => {
      cy.get(".MuiDialogContent-root input[data-cy^='fb-autocomplete']").last().should("be.disabled");
    });

    it("Checked  'isEnabled' checkbox Fb autocomplete should be enabled", () => {
      cy.get(".MuiDialogContent-root [value='isFieldEnabled']").last().check();
      cy.get(".MuiDialogContent-root input[data-cy^='fb-autocomplete']").last().should("not.be.disabled");
    });

    it("Uncheck the checkbox 'isEnabled' and verify fb autocomplete is disabled", () => {
      cy.get(".MuiDialogContent-root [value='isFieldEnabled']").last().uncheck();
      cy.get(".MuiDialogContent-root input[data-cy^='fb-autocomplete']").last().should("be.disabled");
    });

    it("Close the preview mode dialog", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Remove the FB fields validation and verify", () => {
    it("Edit Component", () => {
      cy.get("[data-cy='edit-schema-item']").eq(1).arrowClick({ force: true });
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.get("input[value^='default']").check();
      cy.get(`input[name="validators.required_if_in"]`).uncheck();
      cy.fbAddField();
    });

    it("Open form preview", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify autocomplete input should be enabled  after removal of validation", () => {
      cy.get(".MuiDialogContent-root [data-cy^='fb-autocomplete']").last().should("be.enabled");
    });
  });
});
