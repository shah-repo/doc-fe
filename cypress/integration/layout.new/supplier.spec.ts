/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { SupplierExport } from "../../utils/constants/documentTypes/supplier";
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
const docTitle = "Test Supplier";
const docDescription = "Test Supplier Description";
const formTitle = "New Supplier Form";
const formDescription = "New Supplier Form Description";

const FIELD_HEADERS = [
  "form.builder.approvals",
  "fb-textfield",
  "fb-radiobutton-group",
];

context("Verify New Layout for Supplier Document", () => {
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
            documentTypes: [SupplierExport],
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

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create supplier form for migration", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enter title`, () => {
      cy.drEnterDocumentTitle({ name: "Migration form" });
    });

    it(`Enter description`, () => {
      cy.drEnterDocumentDescription({
        description: "Migration form description",
      });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Supplier' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add Text Field", () => {
      cy.fbAddNewField();
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

  // Scenario 11a - Newly Created Supplier Document

  context("Create supplier form", () => {
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

    it("Click on 'Supplier' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
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

      context("Add Field", () => {
        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Add Text Field", () => {
          cy.fbAddNewField();
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

      context("Verify Details tab content", () => {
        it("Verify Text Field", () => {
          cy.get("#sm-tabpanel-1").should("exist");
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
    });
  });

  context("Approve and release document", () => {
    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create supplier document", () => {
    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it(`Enter title ${docTitle}`, () => {
      cy.drEnterDocumentTitle({ name: docTitle });
    });

    it(`Enter description ${docDescription}`, () => {
      cy.drEnterDocumentDescription({ description: docDescription });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateSupplierWithApiCall();
    });
  });

  context("Verify created supplier document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.get(`[data-cy="field-revisionStage"]`).should("exist");
      cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    context("Verify created supplier document tabs content", () => {
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
            cy.get(`[data-cy="field-revisionStage"]`).should("exist");
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

        it("Verify Text Field", () => {
          cy.get("#sm-tabpanel-1").should("exist");
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
        it("Verify Add/Remove References", () => {
          cy.get("[data-cy=\"referenceTo\"]").arrowClick();
          cy.listLoadingElementShouldNotExist();
          cy.get("[data-cy=\"referenceTo\"]").arrowType("FM-00001");
          cy.wait(2000);
          cy.contains("FM-00001").arrowClick();
          cy.drRemoveReferences({ reference: "FM-00001" });
        });
      });

      it("Verify Referenced By, Training, Release Date and Form Info", () => {
        cy.verifyReferencesOtherInfo();
      });
    });

    context("Fill in the fields", () => {
      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add Approver", () => {
        cy.pmAddApproverOnApproverList({ approver: owner });
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Fill Text Field", () => {
        cy.get("[name^=fb-textfield-]").arrowType("Supplier Text Field");
        cy.unClick();
      });

      it("Select radio button option", () => {
        cy.get("[name^=fb-radiobutton-group-]").last().arrowClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
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
    });

    context("Field mapping for migration form", () => {
      FIELD_HEADERS.forEach( (fieldHeader, i) => {
        it(`Mapped '${fieldHeader}' field`, () => {
          cy.get("[id='formMigrationField']" ).eq(i).arrowClick();
          cy.get("[id^='react-select']").eq(i + 1).autocompleteSelect(fieldHeader);
        });
      });
    });

    context("Click confirm and verify migrated fields are present", () => {
      it("Click on confirm change", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.PostOrPatchDocRev, () => {
          cy.get("[data-cy='common.confirm.change']").arrowClick();
        });
      });

      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it(`Verify migrated form info ${FIELD_HEADERS[0]}`, () => {
        cy.get(`[name^="fb-approvals-fb-approvals"]`).find("span")
          .should("contain.text", `${USERS[1].name} - ${USERS[1].email}`);
      });

      it("Navigate to details Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify form info should have migrated form 'FM-00002'", () => {
        cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
      });

      it(`Verify migrated form info ${FIELD_HEADERS[1]}`, () => {
        cy.get(`input[name^="fb-textfield"]`).should("have.value", "Supplier Text Field");
      });

      it(`Verify migrated form info ${FIELD_HEADERS[2]}`, () => {
        cy.get(`input[name^="fb-radiobutton-group"]`).last().should("be.checked");
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
            { key: "Form Set To", value: "FM-00002 - revision 1 - Migration form" },
          ],
        },
        {
          owner,
          actions: [],
        },
        {
          owner,
          actions: [
            { key: "Description changed", value: docDescription },
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
      });

      it("Verify if Approvals bookmark is present", () => {
        cy.get(`[data-cy="Bookmarks-detail"]`).find("p").should("contain.text", "Approvals");
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

  // Scenario 11b - Existing Supplier

  context("Select existing supplier draft document", () => {
    it("Navigate to Supplier List", () => {
      cy.navigToSuppliers();
    });

    it("Filter the Draft document", () => {
      cy.dlClearFilters();
      cy.supFilterByState({ state: "Draft" });
    });

    it(`Select ${docTitle} document`, () => {
      cy.supFilterByDocTitle({ docTitle });
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify supplier draft document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.get(`[data-cy="field-revisionStage"]`).should("exist");
      cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.verifyTabs("overview", "details");
    });

    context("Verify draft supplier document tabs content", () => {
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
            cy.get(`[data-cy="field-revisionStage"]`).should("exist");
            cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
          });

          it("Verify Approvals field", () => {
            cy.verifyApprovalsField();
          });

          it("Verify that Form Options should appear for Overview tab", () => {
            cy.get(".formOptionsBox").scrollIntoView().should("be.visible");
            cy.verifyFormOptionsVisibility();
          });
        });
      });

      context("Verify Details tab content", () => {
        it("Navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify Text Field", () => {
          cy.get("#sm-tabpanel-1").should("exist");
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
          it("Verify Add/Remove References", () => {
            cy.get("[data-cy=\"referenceTo\"]").arrowClick();
            cy.listLoadingElementShouldNotExist();
            cy.get("[data-cy=\"referenceTo\"]").arrowType("FM-00001");
            cy.wait(2000);
            cy.contains("FM-00001").arrowClick();
            cy.drRemoveReferences({ reference: "FM-00001" });
          });
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
        });

        it("Verify if Approvals bookmark is present", () => {
          cy.get(`[data-cy="Bookmarks-detail"]`).find("p").should("contain.text", "Approvals");
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

  context("Approve and Release supplier document", () => {
    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve supplier document", () => {
      cy.ebApprove();
    });
  });

  context("Select existing supplier released document", () => {
    it("Navigate to Supplier List", () => {
      cy.navigToSuppliers();
    });

    it("Filter the Released document", () => {
      cy.dlClearFilters();
      cy.supFilterByState({ state: "Released" });
    });

    it(`Select ${docTitle} document`, () => {
      cy.supFilterByDocTitle({ docTitle });
      cy.dlSelectFirstDocument();
    });
  });

  context("Verify supplier released document", () => {
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

    context("Verify released supplier document tabs content", () => {
      context("Verify Overview tab content", () => {
        it("Verify Overview as default selected tab", () => {
          cy.isTabActive({ name: "overview", index: 0 });
        });

        it("Verify tab as fixed", () => {
          cy.verifyFixedTab();
        });

        context("Verify Overview tab content", () => {
          it("Verify Approvals field", () => {
            cy.get("#sm-tabpanel-0").should("exist");
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

        it("Verify Text Field", () => {
          cy.get("#sm-tabpanel-1").should("exist");
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
        });

        it("Verify if Approvals bookmark is present", () => {
          cy.get(`[data-cy="Bookmarks-detail"]`).find("p").should("contain.text", "Approvals");
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
