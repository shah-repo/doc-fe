/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let developersGroup;

context("Verify New Layout for Training Curriculum Document", () => {
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
            documentTypes: [TrainingCurriculum],
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          navigation: [
            {
              icon: "/navigation_icons/dashboard.svg",
              path: "/",
              type: "LINK",
              label: "Dashboard",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/document.svg",
                  path: "/document_revision",
                  type: "LINK",
                  label: "Document List",
                },
                {
                  icon: "/navigation_icons/cr.svg",
                  path: "/change_request",
                  type: "LINK",
                  label: "Approval Requests",
                },
                {
                  icon: "/navigation_icons/text-paper.svg",
                  type: "CATEGORY",
                  label: "Records",
                  category: "Record",
                },
              ],
              type: "MENU",
              label: "Document Control",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              type: "CATEGORY",
              label: "Equipment",
              category: "Equipment",
            },
            {
              icon: "/navigation_icons/supplier-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/supplier-list.svg",
                  type: "CATEGORY",
                  label: "Supplier List",
                  category: "Supplier",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Supplier Management",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              type: "CATEGORY",
              label: "Purchase Orders",
              category: "Purchase Order",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/cart-simple-in.svg",
              type: "CATEGORY",
              label: "Receiving",
              category: "Receive",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/lhr_icon.svg",
                  type: "CATEGORY",
                  label: "LHR",
                  category: "Lhr",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/group-management.svg",
              path: "/group_management",
              type: "LINK",
              label: "Group Management",
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              menu: [
                {
                  icon: "/navigation_icons/computer.svg",
                  path: "/training",
                  type: "LINK",
                  label: "Training Records",
                },
                {
                  icon: "/navigation_icons/receipt_list.svg",
                  path: "/document_by_category/Training Curriculums",
                  type: "LINK",
                  label: "Training Curriculums",
                },
              ],
              type: "MENU",
              label: "Training",
            },
          ],
        },
      }).then(() => {
        done();
      });
    });
  });

  context("Login admin user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  // Scenario 9a - Newly Created Training Curriculum Document

  context("Create Training Curriculum form", () => {
    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Training Curriculum Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Training Curriculum Form" });
    });

    it("Enter description 'New Training Curriculum Form description'", () => {
      cy.drEnterDocumentDescription({
        description: "New Training Curriculum Form description",
      });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Training Curriculum ' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Training Curriculum test" });
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
          cy.contains("Periodic Training").should("exist");
          cy.contains("Documents to Train on").should("exist");
          cy.contains("Refresh/repeat training periodically?").should("exist");
          cy.contains("Training Frequency (in days)").should("exist");
          cy.contains("Trainees Details").should("exist");
          cy.contains("Groups to Train").should("exist");
          cy.contains("Users to Train (if applicable)").should("exist");
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

  context("Create Training Curriculum document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle({ name: "Test Training Curriculum" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Test Training Curriculum Description" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify created training curriculum document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.get("[data-cy=\"field-document.docId\"]").should("exist");
      cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
      cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.details\"]").should("exist");
    });

    context("Verify created training curriculum document tabs content", () => {
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
            cy.get("[data-cy=\"field-document.docId\"]").should("exist");
            cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
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
            cy.contains("Periodic Training").should("exist");
            cy.contains("Documents to Train on").should("exist");
            cy.contains("Refresh/repeat training periodically?").should("exist");
            cy.contains("Trainees Details").should("exist");
            cy.contains("Groups to Train").should("exist");
            cy.contains("Users to Train (if applicable)").should("exist");
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
        cy.verifyAddRemoveReference({ formId: "FM-00001" });
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
      it("Select Documents to Train on 'New Training Curriculum Form'", () => {
        cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("New Training Curriculum Form");
      });

      it("Select Refresh/repeat training periodically? 'Yes'", () => {
        cy.get("[name=training-refresh-training-periodically]").first().arrowClick();
      });

      it("Enter Training Frequency (in days)", () => {
        cy.get("[name=training-validity]").arrowType("5");
      });

      it("Select Groups to train 'Developers'", () => {
        cy.get("[data-cy=training-select-groups-to-train]").autocompleteSelect("Developers");
      });

      it("Select Users to train", () => {
        cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
      });
    });

    context("Enter values for Details tab added fields", () => {
      it("Fill text field", () => {
        cy.get("[name^=fb-textfield-]").arrowType("Training Curriculum Text Field");
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

  // Scenario 9b - Existing Training Curriculum Record

  context("Select exisiting Draft training curriculum document", () => {
    it("Navigate to Training Curriculum", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Filter by Training Curriculum Id", () => {
      cy.trClearFilters();
      cy.trLandingPagetrId({ trId: "TC-00001" });
    });

    it("Select first document", () => {
      cy.trSelectFirstDocument();
    });
  });

  context("Verify Draft training curriculum document", () => {
    it("Verify predefined fields", () => {
      cy.verifyTitleDescriptionFields();
      cy.get("[data-cy=\"field-document.docId\"]").should("exist");
      cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
      cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Verify tabs", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.details\"]").should("exist");
    });

    context("Verify Draft training curriculum document tabs content", () => {
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
            cy.get("[data-cy=\"field-document.docId\"]").should("exist");
            cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
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
          cy.contains("Periodic Training").should("exist");
          cy.contains("Documents to Train on").should("exist");
          cy.contains("Refresh/repeat training periodically?").should("exist");
          cy.contains("Training Frequency (in days)").should("exist");
          cy.contains("Trainees Details").should("exist");
          cy.contains("Groups to Train").should("exist");
          cy.contains("Users to Train (if applicable)").should("exist");
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
          cy.verifyAddRemoveReference({ formId: "FM-00001" });
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

  context("Approve and Release training curriculum document", () => {
    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add Approver", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve training curriculum document", () => {
      cy.ebApprove();
    });
  });

  context("Select exisiting released training curriculum document", () => {
    it("Navigate to Training Curriculum", () => {
      cy.navigToTrainingCurriculums();
    });

    it("Filter by Training Curriculum Id", () => {
      cy.trClearFilters();
      cy.trLandingPagetrId({ trId: "TC-00001" });
    });

    it("Select first document", () => {
      cy.trSelectFirstDocument();
    });
  });

  context("Verify released training curriculum document", () => {
    it("Verify predefined fields", () => {
      cy.get("[id='field-name']").contains("Test Training Curriculum");
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Test Training Curriculum Description");
    });

    it("Verify document header details", () => {
      cy.verifyDocumentHeaderDetails();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });

    it("Verify tabs", () => {
      cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      cy.get("[data-cy=\"tabId.details\"]").should("exist");
    });

    context("Verify released training curriculum document tabs content", () => {
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
          cy.contains("Periodic Training").should("exist");
          cy.contains("Documents to Train on").should("exist");
          cy.contains("Refresh/repeat training periodically?").should("exist");
          cy.contains("Training Frequency (in days)").should("exist");
          cy.contains("Trainees Details").should("exist");
          cy.contains("Groups to Train").should("exist");
          cy.contains("Users to Train (if applicable)").should("exist");
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
});

export { };
