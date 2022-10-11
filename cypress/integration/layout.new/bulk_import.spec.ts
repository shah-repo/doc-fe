/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { BulkImportWithSchema } from "../../utils/constants/documentTypes/bulkImport";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";

let createdCompany;
let loginResponse;
let adminEmployee;
const owner = USERS[1].name;
const userOne = USERS[2].name;
const userTwo = USERS[3].name;
const userThree = USERS[4].name;
const groupOne = "Developers";
const groupTwo = "Company Admin";
const groupThree = "User Management";
const docTitle = "Test Bulk Import";
const formTitle = "New Bulk Import Form";
const formDescription = "New Bulk Import Form Description";

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

  context("Login admin user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  // Scenario 9a - Newly Created Bulk Import Document
  context("Create Migration Bulk Import form", () => {
    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enter title "Bulk import Migration "`, () => {
      cy.drEnterDocumentTitle({ name: "Bulk import Migration " });
    });

    it(`Enter description ${formDescription}`, () => {
      cy.drEnterDocumentDescription({ description: "Bulk Import migration Description" });
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

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create Bulk Import form", () => {
    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enter title ${formTitle}`, () => {
      cy.drEnterDocumentTitle({ name: formTitle });
    });

    it(`Enter description ${formDescription}`, () => {
      cy.drEnterDocumentDescription({
        description: formDescription,
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
      cy.get(`[data-cy="field-outputDocumentTypes"]`).should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    it("Verify Overview as default selected tab", () => {
      cy.isTabActive({ name: "overview", index: 0 });
    });

    it("Verify tab as fixed", () => {
      cy.verifyFixedTab();
    });

    context("Verify tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview tab default fields", () => {
          cy.get("#sm-tabpanel-0").should("exist");
          cy.verifyDefaultFields();
          cy.get(`[data-cy="field-outputDocumentTypes"]`).should("exist");
        });

        it("Verify Approvals field as predefined schema", () => {
          cy.verifyApprovalsField();
        });

        it("Verify that Form Options should appear for Overview tab", () => {
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").should("be.visible");
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
          cy.get("#sm-tabpanel-1").find(".formOptionsBox").should("be.visible");
          cy.verifyFormOptionsVisibility();
        });
      });

      context("Verify Right side panel", () => {
        it("Verify that right side panel opens by default to the References tab", () => {
          cy.verifyReferencesTabAsActive();
        });

        context("Verify References tab", () => {
          it("Verify References tab General Info", () => {
            cy.verifyReferencesGeneralInfo({ user: owner });
          });

          it("Verify References", () => {
            cy.get(`[data-cy="field-referenceTo"]`).should("exist");
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

    it(`Enter title ${docTitle}`, () => {
      cy.drEnterDocumentTitle({ name: docTitle });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify created bulk import record", () => {
    it("Verify predefined fields", () => {
      cy.get(`[data-cy="field-name"]`).should("exist");
      cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
    });

    it("Verify record header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    context("Verify created bulk import record tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.isTabActive({ name: "overview", index: 0 });
        });

        it("Verify tab as fixed", () => {
          cy.verifyFixedTab();
        });

        context("Verify Overview tab content", () => {
          it("Verify Overview tab default fields", () => {
            cy.get("#sm-tabpanel-0").should("exist");
            cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
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
      cy.verifyReferencesTabAsActive();
    });

    it("Verify Right side panel Can be expanded or collapsed", () => {
      cy.verifyExpandCollpase();
    });

    it("Verify References tab is fixed as the user scrolls up or down", () => {
      cy.get(`[data-cy="References"]`).scrollIntoView({ ensureScrollable: false });
    });

    context("Verify References tab", () => {
      it("Verify References tab General Info", () => {
        cy.verifyReferencesGeneralInfo({ user: owner });
      });

      it("Verify Add/Remove References", () => {
        cy.verifyAddRemoveReference({ formId: "FM-00001" });
      });

      it("Verify Referenced By, Training, Release Date and Form Info", () => {
        cy.verifyReferencesOtherInfo();
      });
    });

    context("Verify form migration", () => {
      it("Verify migrate form button is visible", () => {
        cy.get("[data-cy=references-icon]").arrowClick();
        cy.get("[data-cy='common.form.migration']").should("be.visible");
      });

      it("Click on migrate form button", () => {
        cy.get("[data-cy='common.form.migration']").arrowClick();
      });

      it("Select form to be migrated", () => {
        cy.get("[data-cy='field-changeDocumentForm']").arrowClick();
        cy.get("[id^='react-select']").contains("FM-00002").arrowClick();
      });

      it("Mapped 'Select Form Document For Import'", () => {
        cy.get("[id='formMigrationField']" ).eq(0).arrowClick();
        cy.get("[id^='react-select']").eq(1).autocompleteSelect("Select Form Document For Import");
      });

      it("Mapped 'Column Document/Record Id?'", () => {
        cy.get("[id='formMigrationField']" ).eq(1).arrowClick();
        cy.get("[id^='react-select']").eq(2).autocompleteSelect("Column Document/Record Id?");
      });

      it("Mapped 'Select Output Document Type'", () => {
        cy.get("[id='formMigrationField']" ).eq(2).arrowClick();
        cy.get("[id^='react-select']").eq(3).autocompleteSelect("Select Output Document Type");
      });

      it("Mapped 'Download Excel Template'", () => {
        cy.get("[id='formMigrationField']" ).eq(3).arrowClick();
        cy.get("[id^='react-select']").eq(4).autocompleteSelect("Download Excel Template");
      });

      it("Mapped 'EXCEL FOR IMPORT'", () => {
        cy.get("[id='formMigrationField']" ).eq(4).arrowClick();
        cy.get("[id^='react-select']").eq(5).autocompleteSelect("EXCEL FOR IMPORT");
      });

      it("Mapped 'Upload excel with data for import'", () => {
        cy.get("[id='formMigrationField']" ).eq(5).arrowClick();
        cy.get("[id^='react-select']").eq(6).autocompleteSelect("Upload excel with data for import");
      });

      it("Mapped 'Mass Create Logs'", () => {
        cy.get("[id='formMigrationField']" ).eq(6).arrowClick();
        cy.get("[id^='react-select']").eq(7).autocompleteSelect("Mass Create Logs");
      });

      it("Mapped 'Logs'", () => {
        cy.get("[id='formMigrationField']" ).eq(7).arrowClick();
        cy.get("[id^='react-select']").eq(8).autocompleteSelect("Logs");
      });

      it("Mapped Approvals field", () => {
        cy.get("[id='formMigrationField']" ).eq(8).arrowClick();
        cy.get("[id^='react-select']").eq(9).autocompleteSelect("form.builder.approvals");
      });

      it("Mapped fb-textfield", () => {
        cy.get("[id='formMigrationField']" ).eq(9).arrowClick();
        cy.get("[id^='react-select']").eq(10).autocompleteSelect("fb-textfield");
      });

      it("Mapped fb-radiobutton-group field", () => {
        cy.get("[id='formMigrationField']" ).eq(10).arrowClick();
        cy.get("[id^='react-select']").eq(11).autocompleteSelect("fb-radiobutton-group");
      });

      it("Click on confirm change", () => {
        cy.get("[data-cy='common.confirm.change']").arrowClick().wait(3000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify form info should have migrated form 'FM-00002'", () => {
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      });

      it("Verify migrated form info 'fb-textfield'", () => {
        cy.get("[data-cy='fb-textfield']").parent().should("contain.text", "fb-textfield");
      });

      it("Verify migrated form info 'fb-radiobutton-group'", () => {
        cy.get("[data-cy='fb-radiobutton-group']").parent().should("contain.text", "fb-radiobutton-group");
      });
    });


    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.openRevisionsTabAndVerifyCurrentRevision("A");
      });
    });

    context("Verify Access Permissions tab", () => {
      it("Open access permissions tab", () => {
        cy.drSelectPermissionTab();
      });

      it("Add another user permission", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
          cy.drAddUserFromPermissionTab(userOne);
        });
      });

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab(groupOne);
        });
      });
    });

    context("Verify History tab", () => {
      const history = [
        {
          owner,
          actions: [
            { key: "Access granted to group", value: groupOne },
          ],
        },
        {
          owner,
          actions: [
            { key: "Access granted to user", value: userOne },
          ],
        },
        {
          owner,
          actions: [
            { key: "Form Set To", value: "FM-00002 - revision 1 - Bulk import Migration " },
          ],
        },
        {
          owner,
          actions: [
            { key: "Name changed", value: docTitle },
          ],
        },
      ];

      it("Open history tab and verify changes are being captured", () => {
        cy.drSelectHistoryTab();
        cy.get(`[data-cy="History-detail"]`).should("be.visible");
      });

      verifyHistoryContent(history, groupOne);
    });

    context("Verify Bookmarks tab", () => {
      it("Open bookmarks tab", () => {
        cy.drSelectBookmarksTab();
        cy.get(`[data-cy="bookmark-icon"]`).should("be.visible");
      });
    });

    context("Verify Revision History tab", () => {
      it("Open revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get(`[data-cy="Revision History-detail"]`).should("be.visible");
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
        cy.get(`[data-cy="fb-form-document-to-be-used"]`).autocompleteSelect("FM-00003");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get(`[data-cy="fb-output-document-type"]`).autocompleteSelect("Bulk Import");
      });

      it("Select 'Yes' to have Document/Record Id column", () => {
        cy.get(`[name="fb-add-column-document-record-id"]`).eq(0).check();
      });

      it("Upload excel file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "test_template_new.xlsx" });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Enter values for Details tab added fields", () => {
      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Fill text field", () => {
        cy.get("[name^=fb-textfield-]").arrowType("Bulk Import Text Field");
        cy.unClick();
      });

      it("Select radio button option", () => {
        cy.get("[name^=fb-radiobutton-group-]").last().arrowClick();
      });

      it("Save document", () => {
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Turn on autosave", () => {
        cy.cmpTurnOnAutosave();
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
      cy.filterRecordState({ state: STATUS_TYPES_LABEL.WIP });
    });

    it("Filter by Record Id", () => {
      cy.dlFilterByDocId({ docId: "BLC-00004" });
    });

    it("Select first record", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify WIP bulk import record", () => {
    it("Verify predefined fields", () => {
      cy.get(`[data-cy="field-name"]`).should("exist");
      cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
    });

    it("Verify record header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    context("Verify WIP bulk import record tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.isTabActive({ name: "overview", index: 0 });
        });

        it("Verify tab as fixed", () => {
          cy.verifyFixedTab();
        });

        context("Verify Overview tab content", () => {
          it("Verify Overview tab default fields", () => {
            cy.get("#sm-tabpanel-0").should("exist");
            cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
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

        it("Navigate to overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Verify Text Field", () => {
          cy.contains("fb-textfield").should("exist");
        });

        it("Verify Radio Button Group", () => {
          cy.contains("fb-radiobutton-group").should("exist");
        });

        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify that Form Options should appear for Details tab", () => {
          cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
          cy.verifyFormOptionsVisibility();
        });
      });
    });

    context("Verify Right side panel", () => {
      it("Verify that right side panel opens by default to the References tab", () => {
        cy.verifyReferencesTabAsActive();
      });

      it("Verify Right side panel Can be expanded or collapsed", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify References tab is fixed as the user scrolls up or down", () => {
        cy.get(`[data-cy="References"]`).scrollIntoView({ ensureScrollable: false });
      });

      context("Verify References tab", () => {
        it("Verify References tab General Info", () => {
          cy.verifyReferencesGeneralInfo({ user: owner });
        });

        it("Verify Add/Remove References", () => {
          cy.verifyAddRemoveReference({ formId: "FM-00001" });
        });

        it("Verify Referenced By, Training, Release Date and Form Info", () => {
          cy.verifyReferencesOtherInfo();
        });
      });

      context("Verify Revisions tab", () => {
        it("Open revisions tab, click and verify current revision", () => {
          cy.openRevisionsTabAndVerifyCurrentRevision("A");
        });
      });

      context("Verify Access Permissions tab", () => {
        it("Open access permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
            cy.drAddUserFromPermissionTab(userTwo);
          });
        });

        it("Add another group permission", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
            cy.drAddGroupFromPermissionTab(groupTwo);
          });
        });
      });

      context("Verify History tab", () => {
        const history = [
          {
            owner,
            actions: [
              { key: "Access granted to group", value: groupTwo },
            ],
          },
          {
            owner,
            actions: [
              { key: "Access granted to user", value: userTwo },
            ],
          },
        ];

        it("Open history tab and verify changes are being captured", () => {
          cy.drSelectHistoryTab();
          cy.get(`[data-cy="History-detail"]`).should("be.visible");
        });

        verifyHistoryContent(history, groupTwo);
      });

      context("Verify Bookmarks tab", () => {
        it("Open bookmarks tab", () => {
          cy.drSelectBookmarksTab();
          cy.get(`[data-cy="bookmark-icon"]`).should("be.visible");
        });
      });

      context("Verify Revision History tab", () => {
        it("Open revision history tab", () => {
          cy.drSelectRevisionHistoryTab();
          cy.get(`[data-cy="Revision History-detail"]`).should("be.visible");
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
      cy.pmAddApproverOnApproverList({ approver: owner });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve bulk import record", () => {
      cy.ebApprove();
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
      cy.dlFilterByDocId({ docId: "BLC-00004" });
    });

    it("Select first record", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify released bulk import record", () => {
    it("Verify predefined fields", () => {
      cy.get("#field-name").contains(docTitle);
    });

    it("Verify record header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    context("Verify released bulk import record tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.isTabActive({ name: "overview", index: 0 });
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
          it("Navigate to overview tab", () => {
            cy.drSelectOverviewTab();
          });

          it("Verify Text Field", () => {
            cy.contains("fb-textfield").should("exist");
          });

          it("Verify Radio Button Group", () => {
            cy.contains("fb-radiobutton-group").should("exist");
          });

          it("Navigate to Details tab", () => {
            cy.drSelectDetailsTab();
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
        cy.verifyReferencesTabAsActive();
      });

      it("Verify Right side panel Can be expanded or collapsed", () => {
        cy.verifyExpandCollpase();
      });

      it("Verify References tab is fixed as the user scrolls up or down", () => {
        cy.get(`[data-cy="References"]`).scrollIntoView({ ensureScrollable: false });
      });

      context("Verify References tab", () => {
        it("Verify References tab General Info", () => {
          cy.verifyReferencesGeneralInfo({ user: owner });
        });

        it("Verify References", () => {
          cy.get(`[data-cy="generalInfo"]`).should("contain.text", "References");
        });

        it("Verify Referenced By, Training, Release Date and Form Info", () => {
          cy.verifyReferencesOtherInfo();
        });
      });

      context("Verify Revisions tab", () => {
        it("Open revisions tab, click and verify current revision", () => {
          cy.openRevisionsTabAndVerifyCurrentRevision("A");
        });
      });

      context("Verify Access Permissions tab", () => {
        it("Open access permissions tab", () => {
          cy.drSelectPermissionTab();
        });

        it("Add another user permission", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetFieldLocks, () => {
            cy.drAddUserFromPermissionTab(userThree);
          });
        });

        it("Add another group permission", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
            cy.drAddGroupFromPermissionTab(groupThree);
          });
        });
      });

      context("Verify History tab", () => {
        const history = [
          {
            owner,
            actions: [
              { key: "Access granted to group", value: groupThree },
            ],
          },
          {
            owner,
            actions: [
              { key: "Access granted to user", value: userThree },
            ],
          },
        ];

        it("Open history tab and verify changes are being captured", () => {
          cy.drSelectHistoryTab();
          cy.get(`[data-cy="History-detail"]`).should("be.visible");
        });

        verifyHistoryContent(history, groupThree);
      });

      context("Verify Bookmarks tab", () => {
        it("Open bookmarks tab", () => {
          cy.drSelectBookmarksTab();
          cy.get(`[data-cy="bookmark-icon"]`).should("be.visible");
        });
      });

      context("Verify Revision History tab", () => {
        it("Open revision history tab", () => {
          cy.drSelectRevisionHistoryTab();
          cy.get(`[data-cy="Revision History-detail"]`).should("be.visible");
        });
      });

      context("Verify History tab content scroll", () => {
        it("Verify that scroll bar appearing only on hover and user can scroll the content", () => {
          cy.verifyHistoryScroll();
        });
      });
    });
  });
});

export { };
