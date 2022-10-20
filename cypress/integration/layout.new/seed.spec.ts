/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { Seed } from "../../utils/constants/documentTypes/seed";
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
const docTitle = "Test Seed";
const docDescription = "Test Seed Description";
const formTitle = "New Seed Form";
const formDescription = "New Seed Form Description";

const FIELD_HEADERS = [
  "Document Title",
  "Document Description",
  "Type of document to be created",
  "Document Type to be selected",
  "JSON Form",
  "Define the output of that form",
  "Default Revision Stage",
  "Training Required",
  "Attachments to be included",
  "fb-textfield",
  "fb-checkbox-group",
  "fb-radiobutton-group",
];

context("Verify New Layout for Seed Document", () => {
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
            documentTypes: [Seed],
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

  context("Scenario 10c - Newly Created Seed Document", () => {
    context("Create Seed Migration form", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document'", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enter title "Seed migrtion form"`, () => {
        cy.drEnterDocumentTitle({ name: "Seed migrtion form" });
      });

      it(`Enter description ${formDescription}`, () => {
        cy.drEnterDocumentDescription({ description: "Seed migration form Description" });
      });

      it("Click on 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Click on 'SEED' document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "SEED" });
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

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
        cy.fbGroupOptions("Option 1", "Option 2");
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
  });

  context("Create Seed form", () => {
    it("Navigate to document list", () => {
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

    it("Click on 'SEED' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "SEED" });
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

    it("Verify form option box should be visible in overview tab", () => {
      cy.get(".formOptionsBox").scrollIntoView();
      cy.get(".formOptionsBox").should("be.visible");
    });

    context("Verify tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview tab default fields", () => {
          cy.get("#sm-tabpanel-0").should("exist");
          cy.verifyDefaultFields();
          cy.get(`[data-cy="field-outputDocumentTypes"]`).should("exist");
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
          cy.contains("Document Title").should("exist");
          cy.contains("Document Description").should("exist");
          cy.contains("Type of document to be created").should("exist");
          cy.contains("Document Type to be selected").should("exist");
          cy.contains("Default Revision Stage").should("exist");
          cy.contains("Training Required").should("exist");
          cy.contains("Attachments to be included").should("exist");
        });
      });

      context("Add Fields in Details tab", () => {
        it("Add Text Field", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
          cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
          cy.fbAddNewFieldButton();
        });

        it("Add Checkbox group", () => {
          cy.fbAddNewFieldWhenHiddenLastPlace();
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
          cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
          cy.fbGroupOptions("Option 1", "Option 2");
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

        it("Verify Checkbox Group", () => {
          cy.contains("fb-checkbox-group").should("exist");
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

  context("Create Seed document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it(`Enter title ${docTitle}`, () => {
      cy.drEnterDocumentTitle({ name: docTitle });
    });

    it(`Enter description ${docDescription}`, () => {
      cy.drEnterDocumentDescription({ description: docDescription });
    });

    it("Save document", () => {
      cy.drClickCreateSupplierWithApiCall();
    });
  });

  context("Verify created seed document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.verifyDefaultFields();
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    context("Verify created seed document tabs content", () => {
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
            cy.verifyDefaultFields();
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
            cy.contains("Document Title").should("exist");
            cy.contains("Document Description").should("exist");
            cy.contains("Type of document to be created").should("exist");
            cy.contains("Document Type to be selected").should("exist");
            cy.contains("Default Revision Stage").should("exist");
            cy.contains("Training Required").should("exist");
            cy.contains("Attachments to be included").should("exist");
          });
        });

        context("Fill in the fields", () => {
          context("Enter values for Details tab predefined schema fields", () => {
            it("Enters document title 'First document'", () => {
              cy.get("[data-cy^=document-title-]").arrowType("First document");
            });

            it("Select 'Form with output' value on 'Type of document to be created'", () => {
              cy.get("[name^=type-of-document-to-be-created-]").eq(0).check();
            });

            it("Select 'Numeric' value on 'Default Revision Stage'", () => {
              cy.get("[name^=default-revision-stage-]").eq(0).check();
            });

            it("Upload JSON Form", () => {
              cy.atchUploadJSONFormForSeed({ fileName: "TestTemplate.json", queue: 0 });
            });

            it("Enters document description 'First document description'", () => {
              cy.get("[data-cy^=document-description-]>div>div>div>div>div[contenteditable]>div")
                .click({ force: true }).arrowType("First document description");
            });

            it("Selects document type as 'Form'", () => {
              cy.get("[id^=mui-component-select-document-type-to-be-selected-]").arrowClick();
              cy.get("[id^=menu-document-type-to-be-selected-]>div:nth-child(3)>ul")
                .contains("li", "Form").arrowClick();
            });

            it("Selects document type as 'Clinical Protocol'", () => {
              cy.get("[id^=mui-component-select-define-the-output-of-that-form-]").arrowClick();
              cy.get("[id^=menu-define-the-output-of-that-form-]>div:nth-child(3)>ul")
                .contains("li", "Clinical Protocol").arrowClick();
            });

            it("Selects 'No' training required option", () => {
              cy.get("[name^=training-required-]").eq(1).arrowClick();
            });

            it("Fill text field", () => {
              cy.get("[name^=fb-textfield-]").arrowType("Seed Text Field");
              cy.unClick();
            });

            it("Check checkbox option", () => {
              cy.get(`input[type="checkbox"][value="Option 1"]`).last().check();
            });

            it("Select radio button option", () => {
              cy.get("[name^=fb-radiobutton-group-]").last().arrowClick();
            });

            it("Save document", () => {
              cy.drClickCreateSupplierWithApiCall();
            });
          });
        });

        context("Verify Details tab added fields", () => {
          it("Verify Text Field", () => {
            cy.contains("fb-textfield").should("exist");
          });

          it("Verify Checkbox Group", () => {
            cy.contains("fb-checkbox-group").should("exist");
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
        cy.get(`[data-cy="referenceTo"]`).arrowClick();
        cy.get(`[data-cy="referenceTo"]`).arrowType("FM-00001");
        cy.wait(2000);
        cy.contains("FM-00001").arrowClick();
        cy.drRemoveReferences({ reference: "FM-00001" });
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

      FIELD_HEADERS.forEach( (fieldHeader, i) => {
        it(`Mapped '${fieldHeader}' field`, () => {
          cy.get("[id='formMigrationField']" ).eq(i).arrowClick();
          cy.get("[id^='react-select']").eq(i + 1).autocompleteSelect(fieldHeader);
        });
      });

      it("Click on confirm change", () => {
        cy.get("[data-cy='common.confirm.change']").arrowClick().wait(2000);
      });

      it("Navigate to details Tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Verify form info should have migrated form 'FM-00002'", () => {
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      });

      it("Verify fb-textfield", () => {
        cy.get("[value='Seed Text Field']").should("exist");
      });

      it("Verify fb-checkbox-group", () => {
        cy.get("[value=\"Option 1\"]").should("be.checked");
      });

      it("Verify fb-radiobutton-group", () => {
        cy.get("[value=\"Option 2\"]").should("be.checked");
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify  Document Title ", () => {
        cy.get("[value='First document']").eq(0).should("exist");
      });

      it("Verify  Document Description ", () => {
        cy.get(`[data-cy^="document-description-"]`).contains("First document description").should("exist");
      });

      it("Verify Type of document to be created", () => {
        cy.get("[value=\"Form with output\"]").should("be.checked");
      });

      it("Verify  Document Type to be selected ", () => {
        cy.get(`[id^="mui-component-select-document-type-to-be-selected-"]`).contains("Form").should("exist");
      });

      it("Verify JSON Form ", () => {
        cy.get(`[data-cy="fileupload-4"]`).contains("TestTemplate.json").should("exist");
      });

      it("Verify  Define the output of that form ", () => {
        // eslint-disable-next-line max-len
        cy.get(`[id^="mui-component-select-define-the-output-of-that-form-"]`).contains("Clinical Protocol").should("exist");
      });

      it("Verify Default Revision Stage", () => {
        cy.get("[value=\"Numeric\"]").should("be.checked");
      });

      it("Verify Training Required", () => {
        cy.get("[value=\"No\"]").should("be.checked");
      });
    });

    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.openRevisionsTabAndVerifyCurrentRevision("1");
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
            { key: "Form Set To", value: "FM-00002 - revision 1 - Seed migrtion form" },
          ],
        },
      ];

      it("Open history tab and verify changes are being captured", () => {
        cy.drSelectHistoryTab();
        cy.get(`[data-cy="History-detail"]`).should("be.visible");
      });

      it("Verify Description changed value as 'Test Seed Description'  ", () => {
        cy.get("[data-cy=\"change-key-4-0\"]").contains("Description changed")
          .should("exist");
        cy.get("[data-cy=\"change-value-4-0\"]").contains("Test Seed Description")
          .should("exist");
      });

      it("Verify Name changed value as 'Test Seed'  ", () => {
        cy.get("[data-cy=\"change-key-4-1\"]").contains("Name changed")
          .should("exist");
        cy.get("[data-cy=\"change-value-4-1\"]").contains("Test Seed")
          .should("exist");
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

  context("Select exisiting draft seed document", () => {
    it("Turn on autosave", () => {
      cy.cmpTurnOnAutosave();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Filter the Draft document", () => {
      cy.dlClearFilters();
      cy.dlFilterByStatus({ status: "Draft" });
    });

    it(`Select ${docTitle} document`, () => {
      cy.dlFilterByDocTitle({ docTitle });
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify draft seed document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.verifyDefaultFields();
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    context("Verify draft seed document tabs content", () => {
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
            cy.verifyDefaultFields();
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
          cy.contains("Document Title").should("exist");
          cy.contains("Document Description").should("exist");
          cy.contains("Type of document to be created").should("exist");
          cy.contains("Document Type to be selected").should("exist");
          cy.contains("JSON Form").should("exist");
          cy.contains("Define the output of that form").should("exist");
          cy.contains("Default Revision Stage").should("exist");
          cy.contains("Training Required").should("exist");
          cy.contains("Attachments to be included").should("exist");
        });

        it("Navigate to overview tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Verify Text Field", () => {
          cy.contains("fb-textfield").should("exist");
        });

        it("Verify Checkbox Group", () => {
          cy.contains("fb-checkbox-group").should("exist");
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
          cy.get(`[data-cy="referenceTo"]`).arrowClick();
          cy.get(`[data-cy="referenceTo"]`).arrowType("FM-00001");
          cy.wait(2000);
          cy.contains("FM-00001").arrowClick();
          cy.drRemoveReferences({ reference: "FM-00001" });
        });

        it("Verify Referenced By, Training, Release Date and Form Info", () => {
          cy.verifyReferencesOtherInfo();
        });
      });

      context("Verify Revisions tab", () => {
        it("Open revisions tab, click and verify current revision", () => {
          cy.openRevisionsTabAndVerifyCurrentRevision("1");
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

  context("Approve and Release seed document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Select exisiting released seed document", () => {
    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Filter the Released document", () => {
      cy.dlClearFilters();
      cy.dlFilterByStatus({ status: "Released" });
    });

    it(`Select ${docTitle} document`, () => {
      cy.dlFilterByDocTitle({ docTitle });
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify released seed document", () => {
    it("Verify predefined fields", () => {
      cy.get("#field-name").contains(docTitle);
      cy.get(`[data-cy="BaseWithhtml-editor"]`).contains(docDescription);
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    context("Verify released seed document tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.isTabActive({ name: "overview", index: 0 });
        });

        it("Verify tab as fixed", () => {
          cy.verifyFixedTab();
        });

        it("Verify that Form Options should appear for Overview tab", () => {
          cy.get("#sm-tabpanel-0").find(".formOptionsBox").scrollIntoView().should("exist");
        });
      });

      context("Verify Details tab content", () => {
        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        context("Verify Details tab predefined schema fields", () => {
          it("Verify predefined schema fields", () => {
            cy.get("#sm-tabpanel-1").should("exist");
            cy.contains("Document Title").should("exist");
            cy.contains("Document Description").should("exist");
            cy.contains("Type of document to be created").should("exist");
            cy.contains("Document Type to be selected").should("exist");
            cy.contains("JSON Form").should("exist");
            cy.contains("Define the output of that form").should("exist");
            cy.contains("Default Revision Stage").should("exist");
            cy.contains("Training Required").should("exist");
            cy.contains("Attachments to be included").should("exist");
          });
        });

        context("Verify Details tab added fields", () => {
          it("Navigate to overview tab", () => {
            cy.drSelectOverviewTab();
          });

          it("Verify Text Field", () => {
            cy.contains("fb-textfield").should("exist");
          });

          it("Verify Checkbox Group", () => {
            cy.contains("fb-checkbox-group").should("exist");
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
          cy.openRevisionsTabAndVerifyCurrentRevision("1");
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
