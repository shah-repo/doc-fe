/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { BulkImportWithSchema } from "../../utils/constants/documentTypes/bulkImport";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

context("Verify New Layout for Bulk Import Document", () => {
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
            documentTypes: [BulkImportWithSchema],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  // Scenario 9a - Newly Created Bulk Import Document

  context("Create Bulk Import form", () => {
    it("Navigate to record list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Bulk Import Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Bulk Import Form" });
    });

    it("Enter description 'New Bulk Import Form description'", () => {
      cy.drEnterDocumentDescription({
        description: "New Bulk Import Form description",
      });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Bulk Import' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Bulk Import" });
      cy.unClick();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify created form document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.verifyDefaultFields();
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.details\"]").should("exist");
    });

    it("Verify Overview as default selected tab", () => {
      cy.verifySelectedTab({ tab: "overview" });
    });

    it("Verify tab as fixed", () => {
      cy.verifyFixedTab();
    });

    context("Verify tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview tab default fields", () => {
          cy.get("#sm-tabpanel-0").should("exist");
          cy.verifyDefaultFields();
          cy.get("[data-cy=\"field-outputDocumentTypes\"]").should("exist");
        });

        it("Verify Approvals field as predefined schema", () => {
          cy.verifyApprovalsField();
        });

        it("Verify that Form Options should appear for Overview tab", () => {
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
          cy.verifyFormOptionsVisibility();
        });
      });

      context("Verify Details tab predefined schema fields", () => {
        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify predefined schema fields", () => {
          cy.get("#sm-tabpanel-1").should("exist");
          cy.contains("Select Form Document For Import").should("exist");
          cy.contains("Select Output Document Type").should("exist");
          cy.contains("EXCEL FOR IMPORT").should("exist");
          cy.contains("Column Document/Record Id?").should("exist");
          cy.contains("Download Excel Template").should("exist");
          cy.contains("Upload excel with data for import").should("exist");
          cy.contains("Mass Create Logs").should("exist");
          cy.contains("Logs").should("exist");
        });
      });

      context("Add Fields in Details tab", () => {
        it("Add Text Field", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbAddNewFieldButton();
        });

        it("Add Radio Button group", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
          cy.fbGroupOptions("Option 1", "Option 2");
          cy.fbAddNewFieldButton();
        });

        it("Save Form", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Verify Details tab added fields", () => {
        it("Verify Text Field", () => {
          cy.contains("fb-textfield").should("exist");
        });

        it("Verify Radio Button Group", () => {
          cy.contains("fb-radiobutton-group").should("exist");
        });

        it("Verify that Form Options should appear for Details tab", () => {
          cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
          cy.verifyFormOptionsVisibility();
        });
      });

      context("Verify Right side panel", () => {
        it("Verify that right side panel opens by default to the References tab", () => {
          cy.get("[data-cy=\"References\"]").should("exist");
          cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
        });

        context("Verify References tab", () => {
          it("Verify References tab General Info", () => {
            cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
          });

          it("Verify References", () => {
            cy.get("[data-cy=\"field-referenceTo\"]").should("exist");
          });

          it("Verify Referenced By, Training, Release Date and Form Info", () => {
            cy.verifyReferencesOtherInfo();
          });
        });

        context("Verify Right side panel tabs", () => {
          it("Verify other tabs", () => {
            cy.verifyRightSidePanelOtherTabs();
          });
        });
      });
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create Bulk Import record", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle({ name: "Test Bulk Import" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify created bulk import record", () => {
    it("Verify predefined fields", () => {
      cy.get("[data-cy=\"field-name\"]").should("exist");
      cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
    });

    it("Verify record header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it("Verify tabs", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.details\"]").should("exist");
    });

    context("Verify created bulk import record tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.verifySelectedTab({ tab: "overview" });
        });

        it("Verify tab as fixed", () => {
          cy.verifyFixedTab();
        });

        context("Verify Overview tab content", () => {
          it("Verify Overview tab default fields", () => {
            cy.get("#sm-tabpanel-0").should("exist");
            cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
          });

          it("Verify Approvals field", () => {
            cy.verifyApprovalsField();
          });

          it("Verify that Form Options should appear for Overview tab", () => {
            cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
            cy.verifyFormOptionsVisibility();
          });
        });
      });

      context("Verify Details tab content", () => {
        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        context("Verify Details tab predefined schema fields", () => {
          it("Verify predefined schema fields", () => {
            cy.get("#sm-tabpanel-1").should("exist");
            cy.contains("Select Form Document For Import").should("exist");
            cy.contains("Select Output Document Type").should("exist");
            cy.contains("EXCEL FOR IMPORT").should("exist");
            cy.contains("Column Document/Record Id?").should("exist");
            cy.contains("Download Excel Template").should("exist");
            cy.contains("Upload excel with data for import").should("exist");
            cy.contains("Mass Create Logs").should("exist");
            cy.contains("Logs").should("exist");
          });
        });

        context("Verify Details tab added fields", () => {
          it("Verify Text Field", () => {
            cy.contains("fb-textfield").should("exist");
          });

          it("Verify Radio Button Group", () => {
            cy.contains("fb-radiobutton-group").should("exist");
          });

          it("Verify that Form Options should appear for Details tab", () => {
            cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
            cy.verifyFormOptionsVisibility();
          });
        });
      });
    });
  });

  context("Verify Right side panel", () => {
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("Verify Right side panel Can be expanded or collapsed", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify References tab is fixed as the user scrolls up or down", () => {
      cy.get("[data-cy=\"References\"]").scrollIntoView({ ensureScrollable: false });
    });

    context("Verify References tab", () => {
      it("Verify References tab General Info", () => {
        cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
      });

      it("Verify Add/Remove References", () => {
        cy.get("[data-cy=\"field-referenceTo\"]").should("exist");
        cy.get("[data-cy=\"referenceTo\"]").arrowClick();
        cy.drSelectReferences( "FM-00001" );
        cy.drRemoveReferences({ reference: "FM-00001" });
      });

      it("Verify Referenced By, Training, Release Date and Form Info", () => {
        cy.verifyReferencesOtherInfo();
      });
    });

    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drClickRevisionsSidePanel();
          cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
          cy.recCheckRevisionStage({ stage: "Revision A" });
          cy.get("[data-cy=\"HeaderInfo-Rev\"]").contains("Rev A");
        });
      });
    });

    context("Verify History tab", () => {
      it("Open history tab and verify changes are being captured", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
          cy.drSelectHistoryTab();
          cy.get("[data-cy=\"History-detail\"]").should("be.visible");
        });
      });
    });

    context("Verify Access Permissions tab", () => {
      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(USERS[2].name);
        });
      });

      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("Developers");
        });
      });
    });

    context("Verify Bookmarks tab", () => {
      it("Open bookmarks tab", () => {
        cy.drSelectBookmarksTab();
        cy.get("[data-cy=\"bookmark-icon\"]").should("be.visible");
      });
    });

    context("Verify Revision History tab", () => {
      it("Open revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get("[data-cy=\"Revision History-detail\"]").should("be.visible");
      });
    });

    context("Verify History tab content scroll", () => {
      it("Verify that scroll bar appearing only on hover and user can scroll the content", () => {
        cy.verifyHistoryScroll();
      });
    });
  });

  context("Fill in the fields", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    context("Enter values for Details tab predefined schema fields", () => {
      it("Select form to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-form-document-to-be-used\"]").autocompleteSelect("FM-00002");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-output-document-type\"]").autocompleteSelect("Bulk Import");
      });

      it("Select 'Yes' to have Document/Record Id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(0).check();
      });

      it("Upload excel file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "test_template_new.xlsx" });
      });
    });

    context("Enter values for Details tab added fields", () => {
      it("Fill text field", () => {
        cy.get("[name^=fb-textfield-]").arrowType("Bulk Import Text Field");
        cy.unClick();
      });

      it("Select radio button option", () => {
        cy.get("[name^=\"fb-radiobutton-group-\"]").last().arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Turn on autosave", () => {
        cy.cmpTurnOnAutosave();
      });
    });
  });
});

// Scenario 9b - Existing Bulk Import Record

context("Select exisiting WIP bulk import record", () => {
  it("Navigate to Records", () => {
    cy.navigToRecords();
  });

  it("Filter the WIP record", () => {
    cy.dlClearFilters();
    cy.filterRecordState({ state: "WIP" });
  });

  it("Filter by Record Id", () => {
    cy.dlFilterByDocId({ docId: "BLC-00003" });
  });

  it("Select first record", () => {
    cy.dlSelectFirstDocument();
  });
});

context("Verify WIP bulk import record", () => {
  it("Verify predefined fields", () => {
    cy.get("[data-cy=\"field-name\"]").should("exist");
    cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
  });

  it("Verify record header details", () => {
    cy.verifyDocumentHeaderDetails();
    cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
  });

  it("Verify tabs", () => {
    cy.get("[data-cy=\"tabId.overview\"]").should("exist");
    cy.get("[data-cy=\"tabId.details\"]").should("exist");
  });

  context("Verify WIP bulk import record tabs content", () => {
    context("Verify Overview tab content", () => {
      it("Verify Overview as default selected tab", () => {
        cy.verifySelectedTab({ tab: "overview" });
      });

      it("Verify tab as fixed", () => {
        cy.verifyFixedTab();
      });

      context("Verify Overview tab content", () => {
        it("Verify Overview tab default fields", () => {
          cy.get("#sm-tabpanel-0").should("exist");
          cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
        });

        it("Verify Approvals field", () => {
          cy.verifyApprovalsField();
        });

        it("Verify that Form Options should appear for Overview tab", () => {
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
          cy.verifyFormOptionsVisibility();
        });
      });
    });

    context("Verify Details tab content", () => {
      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify predefined schema fields", () => {
        cy.get("#sm-tabpanel-1").should("exist");
        cy.contains("Select Form Document For Import").should("exist");
        cy.contains("Select Output Document Type").should("exist");
        cy.contains("EXCEL FOR IMPORT").should("exist");
        cy.contains("Column Document/Record Id?").should("exist");
        cy.contains("Download Excel Template").should("exist");
        cy.contains("Upload excel with data for import").should("exist");
        cy.contains("Mass Create Logs").should("exist");
        cy.contains("Logs").should("exist");
      });

      it("Verify Text Field", () => {
        cy.contains("fb-textfield").should("exist");
      });

      it("Verify Radio Button Group", () => {
        cy.contains("fb-radiobutton-group").should("exist");
      });

      it("Verify that Form Options should appear for Details tab", () => {
        cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
        cy.verifyFormOptionsVisibility();
      });
    });
  });

  context("Verify Right side panel", () => {
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("Verify Right side panel Can be expanded or collapsed", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify References tab is fixed as the user scrolls up or down", () => {
      cy.get("[data-cy=\"References\"]").scrollIntoView({ ensureScrollable: false });
    });

    context("Verify References tab", () => {
      it("Verify References tab General Info", () => {
        cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
      });

      it("Verify Add/Remove References", () => {
        cy.get("[data-cy=\"field-referenceTo\"]").should("exist");
        cy.get("[data-cy=\"referenceTo\"]").arrowClick();
        cy.drSelectReferences( "FM-00001" );
        cy.drRemoveReferences({ reference: "FM-00001" });
      });

      it("Verify Referenced By, Training, Release Date and Form Info", () => {
        cy.verifyReferencesOtherInfo();
      });
    });

    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drClickRevisionsSidePanel();
          cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
          cy.recCheckRevisionStage({ stage: "Revision A" });
          cy.get("[data-cy=\"HeaderInfo-Rev\"]").contains("Rev A");
        });
      });
    });

    context("Verify History tab", () => {
      it("Open history tab and verify changes are being captured", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
          cy.drSelectHistoryTab();
          cy.get("[data-cy=\"History-detail\"]").should("be.visible");
        });
      });
    });

    context("Verify Access Permissions tab", () => {
      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(USERS[3].name);
        });
      });

      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("Company Admin");
        });
      });
    });

    context("Verify Bookmarks tab", () => {
      it("Open bookmarks tab", () => {
        cy.drSelectBookmarksTab();
        cy.get("[data-cy=\"bookmark-icon\"]").should("be.visible");
      });
    });

    context("Verify Revision History tab", () => {
      it("Open revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get("[data-cy=\"Revision History-detail\"]").should("be.visible");
      });
    });

    context("Verify History tab content scroll", () => {
      it("Verify that scroll bar appearing only on hover and user can scroll the content", () => {
        cy.verifyHistoryScroll();
      });
    });
  });
});

context("Approve and Release bulk import record", () => {
  it("Navigate to Overview tab", () => {
    cy.drSelectOverviewTab();
  });

  it("Add Approver", () => {
    cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
  });

  it("Submit for approval", () => {
    cy.pmSubmitForApproval();
  });

  it("Approve bulk import record", () => {
    cy.ebApprove();
    // TO DO: User is getting logged out on Approve, needs to be fixed
  });
});

context("Select exisiting released bulk import record", () => {
  it("Navigate to Records", () => {
    cy.navigToRecords();
  });

  it("Filter the Released record", () => {
    cy.dlClearFilters();
    cy.filterRecordState({ state: "Released" });
  });

  it("Filter by Record Id", () => {
    cy.dlFilterByDocId({ docId: "BLC-00003" });
  });

  it("Select first record", () => {
    cy.dlSelectFirstDocument();
  });
});

context("Verify released bulk import record", () => {
  it("Verify predefined fields", () => {
    cy.get("[id='field-name']").contains("Test Bulk Import");
  });

  it("Verify record header details", () => {
    cy.verifyDocumentHeaderDetails();
    cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
  });

  it("Verify tabs", () => {
    cy.get("[data-cy=\"tabId.overview\"]").should("exist");
    cy.get("[data-cy=\"tabId.details\"]").should("exist");
  });

  context("Verify released bulk import record tabs content", () => {
    context("Verify Overview tab content", () => {
      it("Verify Overview as default selected tab", () => {
        cy.verifySelectedTab({ tab: "overview" });
      });

      it("Verify tab as fixed", () => {
        cy.verifyFixedTab();
      });

      it("Verify Approvals field", () => {
        cy.verifyApprovalsField();
      });

      it("Verify that Form Options should appear for Overview tab", () => {
        cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
        cy.verifyFormOptionsVisibility();
      });
    });

    context("Verify Details tab content", () => {
      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify predefined schema fields", () => {
        cy.get("#sm-tabpanel-1").should("exist");
        cy.contains("Select Form Document For Import").should("exist");
        cy.contains("Select Output Document Type").should("exist");
        cy.contains("EXCEL FOR IMPORT").should("exist");
        cy.contains("Column Document/Record Id?").should("exist");
        cy.contains("Download Excel Template").should("exist");
        cy.contains("Upload excel with data for import").should("exist");
        cy.contains("Mass Create Logs").should("exist");
        cy.contains("Logs").should("exist");
      });

      context("Verify Details tab added fields", () => {
        it("Verify Text Field", () => {
          cy.contains("fb-textfield").should("exist");
        });

        it("Verify Radio Button Group", () => {
          cy.contains("fb-radiobutton-group").should("exist");
        });

        it("Verify that Form Options should appear for Details tab", () => {
          cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
          cy.verifyFormOptionsVisibility();
        });
      });
    });
  });

  context("Verify Right side panel", () => {
    it("Verify that right side panel opens by default to the References tab", () => {
      cy.get("[data-cy=\"References\"]").should("exist");
      cy.get("[data-cy=\"generalInfo\"]").should("be.visible");
    });

    it("Verify Right side panel Can be expanded or collapsed", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify References tab is fixed as the user scrolls up or down", () => {
      cy.get("[data-cy=\"References\"]").scrollIntoView({ ensureScrollable: false });
    });

    context("Verify References tab", () => {
      it("Verify References tab General Info", () => {
        cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
      });

      it("Verify References", () => {
        cy.get("[data-cy=\"generalInfo\"]").should("contain.text", "References");
      });

      it("Verify Referenced By, Training, Release Date and Form Info", () => {
        cy.verifyReferencesOtherInfo();
      });
    });

    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drClickRevisionsSidePanel();
          cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
          cy.recCheckRevisionStage({ stage: "Revision A" });
          cy.get("[data-cy=\"HeaderInfo-Rev\"]").contains("Rev A");
        });
      });
    });

    context("Verify History tab", () => {
      it("Open history tab and verify changes are being captured", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
          cy.drSelectHistoryTab();
          cy.get("[data-cy=\"History-detail\"]").should("be.visible");
        });
      });
    });

    context("Verify Access Permissions tab", () => {
      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(USERS[4].name);
        });
      });

      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("User Management");
        });
      });
    });

    context("Verify Bookmarks tab", () => {
      it("Open bookmarks tab", () => {
        cy.drSelectBookmarksTab();
        cy.get("[data-cy=\"bookmark-icon\"]").should("be.visible");
      });
    });

    context("Verify Revision History tab", () => {
      it("Open revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get("[data-cy=\"Revision History-detail\"]").should("be.visible");
      });
    });

    context("Verify History tab content scroll", () => {
      it("Verify that scroll bar appearing only on hover and user can scroll the content", () => {
        cy.verifyHistoryScroll();
      });
    });
  });
});

export { };
