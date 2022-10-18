import moment from "moment";
import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { verifyHistoryContent } from "../../utils/context/historyContent";
import { Part } from "./../../utils/constants/documentTypes/part";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let developersGroup;
let partDocumentType;
let createdPartDocument;
let approvalRequestDocumentType;

const PART_DOCUMENT_TYPE_NAME = "Part";
const currentDate = moment().tz("America/Los_Angeles").format("YYMMDD");

const owner = USERS[1].name;
const userOne = USERS[2].name;
const userTwo = USERS[3].name;
const userThree = USERS[4].name;
const groupOne = "Developers";
const groupTwo = "Company Admin";
const groupThree = "User Management";
const docTitle = "Component specification title";
const formTitle = "Component specification Form";
const formDescription = "Component specification Form Description";

const FIELD_HEADERS = [
  "Initial Quantity",
  "Usable Quantity",
  "Expiration Date",
  "Part Selection",
  "100% Inspection Override",
  "form.builder.approvals",
  "fb-textfield",
  "fb-radiobutton-group",
];

context("Verify New Layout for PART_LOT internal type, Component specification", () => {
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
            documentTypes: [Part],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: groupOne,
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
          tags: [
            ...developersGroup.body[0].tags,
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
                  restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
                },
              ],
              type: "MENU",
              label: "Supplier Management",
              restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              type: "CATEGORY",
              label: "Purchase Orders",
              category: "Purchase Order",
              restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
            },
            {
              icon: "/navigation_icons/cart-simple-in.svg",
              type: "CATEGORY",
              label: "Receiving",
              category: "Receive",
              restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
            },
            {
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
                },
                {
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
                  restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
                },
                {
                  icon: "/navigation_icons/lhr_icon.svg",
                  type: "CATEGORY",
                  label: "LHR",
                  category: "Lhr",
                  restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
            },
            {
              icon: "/navigation_icons/group-management.svg",
              path: "/group_management",
              type: "LINK",
              label: "Group Management",
              restrictedToUsersWithTags: [GroupTag.GROUP_MANAGEMENT],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [GroupTag.USER_MANAGEMENT],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [GroupTag.DOCUMENT_TYPE_MANAGEMENT],
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

  context("Create Part Document", () => {
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
                effectiveDate: new Date().toISOString(),
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

  context("Scenario 6a - Newly Created PART_LOT internal type, Component specification", () => {
    context("Create a document type 'Form' for migration with output CSL and add FB fields", () => {
      it("Navigate to Document List", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document'", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enter title ${formTitle}`, () => {
        cy.drEnterDocumentTitle({ name: "migration form" });
      });

      it(`Enter description ${formDescription}`, () => {
        cy.drEnterDocumentDescription({ description: "Migration form description" });
      });

      it("Click on 'Form' document type", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Click on 'Component specification Lot' document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Component Specification Lot" });
        cy.unClick();
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Add Fields in Details tab for migration form", () => {
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

      it("Approve and released", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create a document type 'Form' with output CSL and add FB fields", () => {
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

      it("Click on 'Component specification Lot' document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Component Specification Lot" });
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
            cy.get(`[data-cy="Initial Quantity"]`).should("exist");
            cy.get(`[data-cy="Usable Quantity"]`).should("exist");
            cy.get(`[data-cy="Expiration Date"]`).should("exist");
            cy.get(`[data-cy="Part Selection"]`).should("exist");
            cy.get(`[data-cy="100% Inspection Override"]`).should("exist");
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

    context("Create Component specification Lot document", () => {
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

    context("Verify created Component specification Lot document", () => {
      it("Verify predefined fields", () => {
        cy.get("[data-cy=\"field-name\"]").should("exist");
        cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
      });

      it("Verify document header details", () => {
        cy.verifyDocumentHeaderDetails();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      });

      it("Verify tabs", () => {
        cy.verifyTabs("overview", "details");
      });

      context("Verify created Component specification Lot document tabs content", () => {
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
              cy.get(`[data-cy="Initial Quantity"]`).should("exist");
              cy.get(`[data-cy="Usable Quantity"]`).should("exist");
              cy.get(`[data-cy="Expiration Date"]`).should("exist");
              cy.get(`[data-cy="Part Selection"]`).should("exist");
              cy.get(`[data-cy="100% Inspection Override"]`).should("exist");
            });
          });

          context("Verify Details tab added fields", () => {
            it("Navigate to Details tab", () => {
              cy.drSelectDetailsTab();
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
          cy.get("[data-cy=\"referenceTo\"]").arrowClick();
          cy.get("[data-cy=\"referenceTo\"]").arrowType("FM-00001");
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
          cy.drSelectDetailsTab();
        });

        it("Verify form info should have migrated form 'FM-00002'", () => {
          cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
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
            actions: [{ key: "Access granted to group", value: groupOne }],
          },
          {
            owner,
            actions: [{ key: "Access granted to user", value: userOne }],
          },
          {
            owner,
            actions: [{ key: "Form Set To", value: "FM-00002 - revision 1 - migration form" }],
          },
          {
            owner,
            actions: [{ key: "Name changed", value: docTitle }],
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
      });

      context("Enter values for Details tab added fields", () => {
        it("Navigate to overview Tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Fill text field", () => {
          cy.get("[name^=fb-textfield-]").arrowType("Component specification Text Field");
          cy.unClick();
        });

        it("Select radio button option", () => {
          cy.get("[name^=fb-radiobutton-group-]").last().arrowClick();
        });

        it("Save document", () => {
          cy.drClickCreateDocumentWithoutApiCall();
        });

        it("Turn on autosave", () => {
          cy.cmpTurnOnAutosave();
        });
      });
    });
  });

  context("Scenario 6b - Existing PART_LOT internal type, Component specification items", () => {
    context("Select exisiting Draft Component specification Lot document", () => {
      it("Navigate to Lot", () => {
        cy.navigToLots();
      });

      it("Select lot document", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Verify WIP Component specification Lot document", () => {
      it("Verify predefined fields", () => {
        cy.get("[data-cy=\"field-name\"]").should("exist");
        cy.get(`[data-cy="AttachmentFieldPresenter-field"]`).should("exist");
      });

      it("Verify document header details", () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.WIP,
          title: "Lots",
          docId: `LOT #${currentDate}01`,
          revision: "Rev A",
        });
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      });

      it("Verify tabs", () => {
        cy.verifyTabs("overview", "details");
      });

      context("Verify Draft Component specification Lot document tabs content", () => {
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
              cy.get("[data-cy=\"field-name\"]").should("exist");
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
            cy.get(`[data-cy="Initial Quantity"]`).should("exist");
            cy.get(`[data-cy="Usable Quantity"]`).should("exist");
            cy.get(`[data-cy="Expiration Date"]`).should("exist");
            cy.get(`[data-cy="Part Selection"]`).should("exist");
            cy.get(`[data-cy="100% Inspection Override"]`).should("exist");
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
            cy.get("[data-cy=\"referenceTo\"]").arrowClick();
            cy.get("[data-cy=\"referenceTo\"]").arrowType("FM-00001");
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
              actions: [{ key: "Access granted to group", value: groupTwo }],
            },
            {
              owner,
              actions: [{ key: "Access granted to user", value: userTwo }],
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

    context("Approve and Release Component specification Lot document", () => {
      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add Approver", () => {
        cy.pmAddApproverOnApproverList({ approver: owner });
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve Component specification Lot document", () => {
        cy.ebApprove();
      });
    });

    context("Select exisiting released Component specification Lot document", () => {
      it("Navigate to Component specification", () => {
        cy.navigToLots();
      });

      it("Select lot document", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Verify released Component specification Lot document", () => {
      it("Verify predefined fields", () => {
        cy.get("[data-cy=\"field-name\"]").should("exist");
      });

      it("Verify document header details", () => {
        cy.verifyDocumentHeaderDetails();
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("Verify tabs", () => {
        cy.verifyTabs("overview", "details");
      });

      context("Verify released Component specification Lot document tabs content", () => {
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
            cy.get(`[data-cy="Initial Quantity"]`).should("exist");
            cy.get(`[data-cy="Usable Quantity"]`).should("exist");
            cy.get(`[data-cy="Expiration Date"]`).should("exist");
            cy.get(`[data-cy="Part Selection"]`).should("exist");
            cy.get(`[data-cy="100% Inspection Override"]`).should("exist");
          });

          context("Verify Details tab added fields", () => {
            it("Navigate to Details tab", () => {
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
              actions: [{ key: "Access granted to group", value: groupThree }],
            },
            {
              owner,
              actions: [{ key: "Access granted to user", value: userThree }],
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
});

export { };

