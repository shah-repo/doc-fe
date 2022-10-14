import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
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
const docTitle = "Test NCO";
const docDescription = "Test NCO Description";
const formTitle = "New NCO Form";
const formDescription = "New NCO Form Description";
const randomNumberForCompany = Math.round(Math.random() * 100000) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

const FIELD_HEADERS = [
  "Company Details",
  "Company Name",
  "Company Abbreviation",
  "Company Admin Email",
  `Client's Logo & Avatar`,
  "Use this source to resize the company logo and avatar if needed",
  `Client's Logo (max 180px x 75px)`,
  `Client's Avatar (58px x 58px)`,
  "White-labeling",
  "Paragraph",
  "Instructions Media upload",
  "defaultBackground",
  "primary",
  "secondary",
  "Paragraph",
  "APPROVED DAM JSON",
  "Approved DAM json is used",
  "DAM JSON",
  "APPROVED PAGE DETAILS JSON",
  "Approved Page Details json is used",
  "Page Details JSON",
  "APPROVED NAVIGATION JSON",
  "Approved Navigation json is used",
  "Navigation JSON",
  "Launching Details",
  "Scheduled Go Live Date",
  "EMPLOYEES TEMPLATE LIST",
  "Users List",
  "GL Codes template list",
  `Client's GL codes list`,
  "Seed documents to be included",
  "Post Creation Records",
  "Logs Created",
];

context("Verify New Layout for NCO Document", () => {
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
            documentTypes: [NCORecord],
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

    context("Login admin user", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });
    });

    context("Create NCO form for migration", () => {
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

      it("Click on 'New Company Record' document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
        cy.unClick();
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    // Scenario 10a - Newly Created NCO Document

    context("Create NCO form", () => {
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

      it("Click on 'New Company Record' document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
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
        cy.get(`[data-cy="field-renderHTML"]`).should("exist");
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
            cy.get(`[data-cy="field-renderHTML"]`).should("exist");
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
            cy.contains("Company Details").should("exist");
            cy.contains("Company Name").should("exist");
            cy.contains("Company Abbreviation").should("exist");
            cy.contains("Company Admin Email").should("exist");
            cy.contains("Client's Logo & Avatar").should("exist");
            cy.contains("Use this source to resize the company logo and avatar if needed").should("exist");
            cy.contains("Client's Logo (max 180px x 75px)").should("exist");
            cy.contains("APPROVED DAM JSON").should("exist");
            cy.contains("Client's Avatar (58px x 58px)").should("exist");
            cy.contains("White-labeling").should("exist");
            cy.contains(
              "If the whitelabeling section is empty, the system will use default Enlil colors."
            ).should("exist");
            cy.contains("Instructions Media upload").should("exist");
            cy.contains("defaultBackground").should("exist");
            cy.contains("primary").should("exist");
            cy.contains("secondary").should("exist");
            cy.contains("APPROVED DAM JSON").should("exist");
            cy.contains("Approved DAM json is used").should("exist");
            cy.contains("DAM JSON").should("exist");
            cy.contains("APPROVED PAGE DETAILS JSON").should("exist");
            cy.contains("Approved Page Details json is used").should("exist");
            cy.contains("Page Details JSON").should("exist");
            cy.contains("APPROVED NAVIGATION JSON").should("exist");
            cy.contains("Approved Navigation json is used").should("exist");
            cy.contains("Navigation JSON").should("exist");
            cy.contains("Launching Details").should("exist");
            cy.contains("Scheduled Go Live Date").should("exist");
            cy.contains("EMPLOYEES TEMPLATE LIST").should("exist");
            cy.contains("Users List").should("exist");
            cy.contains("GL Codes template list").should("exist");
            cy.contains("Client's GL codes list").should("exist");
            cy.contains("Seed documents to be included").should("exist");
            cy.contains("Post Creation Records").should("exist");
            cy.contains("Logs Created").should("exist");
          });

          it("Verify that Form Options should appear for Details tab", () => {
            cy.get("#sm-tabpanel-1").find(".formOptionsBox").scrollIntoView().should("exist");
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

    context("Create NCO document", () => {
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

    context("Verify created NCO document", () => {
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

      context("Verify created NCO document tabs content", () => {
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
              cy.get("#sm-tabpanel-0").find(".formOptionsBox").should("be.visible");
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
            cy.contains("Company Details").should("exist");
            cy.contains("Company Name").should("exist");
            cy.contains("Company Abbreviation").should("exist");
            cy.contains("Company Admin Email").should("exist");
            cy.contains("Client's Logo & Avatar").should("exist");
            cy.contains("Use this source to resize the company logo and avatar if needed").should("exist");
            cy.contains("Client's Logo (max 180px x 75px)").should("exist");
            cy.contains("APPROVED DAM JSON").should("exist");
            cy.contains("Client's Avatar (58px x 58px)").should("exist");
            cy.contains("White-labeling").should("exist");
            cy.contains(
              "If the whitelabeling section is empty, the system will use default Enlil colors."
            ).should("exist");
            cy.contains("Instructions Media upload").should("exist");
            cy.contains("defaultBackground").should("exist");
            cy.contains("primary").should("exist");
            cy.contains("secondary").should("exist");
            cy.contains("APPROVED DAM JSON").should("exist");
            cy.contains("Approved DAM json is used").should("exist");
            cy.contains("DAM JSON").should("exist");
            cy.contains("APPROVED PAGE DETAILS JSON").should("exist");
            cy.contains("Approved Page Details json is used").should("exist");
            cy.contains("Page Details JSON").should("exist");
            cy.contains("APPROVED NAVIGATION JSON").should("exist");
            cy.contains("Approved Navigation json is used").should("exist");
            cy.contains("Navigation JSON").should("exist");
            cy.contains("Launching Details").should("exist");
            cy.contains("Scheduled Go Live Date").should("exist");
            cy.contains("EMPLOYEES TEMPLATE LIST").should("exist");
            cy.contains("Users List").should("exist");
            cy.contains("GL Codes template list").should("exist");
            cy.contains("Client's GL codes list").should("exist");
            cy.contains("Seed documents to be included").should("exist");
            cy.contains("Post Creation Records").should("exist");
            cy.contains("Logs Created").should("exist");
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
          cy.get("[data-cy='common.confirm.change']").arrowClick().wait(2000);
        });

        it("Navigate to details Tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Verify form info should have migrated form 'FM-00002'", () => {
          cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
        });

        // FIELD_HEADERS.forEach( (fieldHeader, i) => {
        //   it(`Verify migrated '${fieldHeader}' field`, () => {
        //     cy.get(`[data-cy="${fieldHeader}"]`).parent().should("contain.text", fieldHeader);
        //   });
        // });

        it("Verify migrated form info 'Company Name'", () => {
          cy.get("[data-cy='Company Name']").parent().should("contain.text", "Company Name");
        });

        it("Verify migrated form info 'Company Abbreviation'", () => {
          cy.get("[data-cy='Company Abbreviation']").parent().should("contain.text", "Company Abbreviation");
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
        it(`Enters company name '${newCompanyName}'`, () => {
          cy.get("[name^=company-name-]").arrowType(newCompanyName);
          cy.log(newCompanyName);
        });

        it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
          cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
          cy.log(newCompanyAbbr);
        });

        it(`Enters company email '${USERS[1].email}'`, () => {
          cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
        });

        it("Select 'Yes' for 'Approved DAM json is used'", () => {
          cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
        });

        it("Upload correct DAM JSON", () => {
          cy.atchUploadDOMJSONForNCO({ fileName: "doc_type_DAM.json", queue: 0 });
        });

        it("Select 'Yes' for 'Approved Page Details json is used'", () => {
          cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
        });

        it("Upload Page Details JSON", () => {
          cy.atchUploadPageDetailsJSONForNCO({ fileName: "doc_type_page_details.json", queue: 0 });
        });

        it("Select 'Yes' for 'Approved Navigation json is used'", () => {
          cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
        });

        it("Upload Navigation JSON", () => {
          cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
        });

        it("Upload Users List JSON", () => {
          cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
        });

        it("Save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Turn on autosave", () => {
          cy.cmpTurnOnAutosave();
        });
      });
    });

    // Scenario 10d - Existing NCO Document

    context("Select exisiting draft NCO document", () => {
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

    context("Verify draft NCO document", () => {
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

      context("Verify draft NCO document tabs content", () => {
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
            cy.contains("Company Details").should("exist");
            cy.contains("Company Name").should("exist");
            cy.contains("Company Abbreviation").should("exist");
            cy.contains("Company Admin Email").should("exist");
            cy.contains("Client's Logo & Avatar").should("exist");
            cy.contains("Use this source to resize the company logo and avatar if needed").should("exist");
            cy.contains("Client's Logo (max 180px x 75px)").should("exist");
            cy.contains("APPROVED DAM JSON").should("exist");
            cy.contains("Client's Avatar (58px x 58px)").should("exist");
            cy.contains("White-labeling").should("exist");
            cy.contains(
              "If the whitelabeling section is empty, the system will use default Enlil colors."
            ).should("exist");
            cy.contains("Instructions Media upload").should("exist");
            cy.contains("defaultBackground").should("exist");
            cy.contains("primary").should("exist");
            cy.contains("secondary").should("exist");
            cy.contains("APPROVED DAM JSON").should("exist");
            cy.contains("Approved DAM json is used").should("exist");
            cy.contains("DAM JSON").should("exist");
            cy.contains("APPROVED PAGE DETAILS JSON").should("exist");
            cy.contains("Approved Page Details json is used").should("exist");
            cy.contains("Page Details JSON").should("exist");
            cy.contains("APPROVED NAVIGATION JSON").should("exist");
            cy.contains("Approved Navigation json is used").should("exist");
            cy.contains("Navigation JSON").should("exist");
            cy.contains("Launching Details").should("exist");
            cy.contains("Scheduled Go Live Date").should("exist");
            cy.contains("EMPLOYEES TEMPLATE LIST").should("exist");
            cy.contains("Users List").should("exist");
            cy.contains("GL Codes template list").should("exist");
            cy.contains("Client's GL codes list").should("exist");
            cy.contains("Seed documents to be included").should("exist");
            cy.contains("Post Creation Records").should("exist");
            cy.contains("Logs Created").should("exist");
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

    context("Approve and Release NCO document", () => {
      it("'Approve and Release' the document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Select exisiting released NCO document", () => {
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

    context("Verify released NCO document", () => {
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

      context("Verify released NCO document tabs content", () => {
        context("Verify Overview tab content", () => {
          it("Verify Overview as default selected tab", () => {
            cy.isTabActive({ name: "overview", index: 0 });
          });

          it("Verify tab as fixed", () => {
            cy.verifyFixedTab();
          });

          it("Verify that Form Options should not appear for Overview tab", () => {
            cy.get("#sm-tabpanel-0").find(".formOptionsBox").should("not.exist");
          });
        });

        context("Verify Details tab content", () => {
          it("Navigate to Details tab", () => {
            cy.drSelectDetailsTab();
          });

          context("Verify Details tab predefined schema fields", () => {
            it("Verify predefined schema fields", () => {
              cy.get("#sm-tabpanel-1").should("exist");
              cy.contains("Company Details").should("exist");
              cy.contains("Company Name").should("exist");
              cy.contains("Company Abbreviation").should("exist");
              cy.contains("Company Admin Email").should("exist");
              cy.contains("Client's Logo & Avatar").should("exist");
              cy.contains("Use this source to resize the company logo and avatar if needed").should("exist");
              cy.contains("Client's Logo (max 180px x 75px)").should("exist");
              cy.contains("APPROVED DAM JSON").should("exist");
              cy.contains("Client's Avatar (58px x 58px)").should("exist");
              cy.contains("White-labeling").should("exist");
              cy.contains(
                "If the whitelabeling section is empty, the system will use default Enlil colors."
              ).should("exist");
              cy.contains("Instructions Media upload").should("exist");
              cy.contains("defaultBackground").should("exist");
              cy.contains("primary").should("exist");
              cy.contains("secondary").should("exist");
              cy.contains("APPROVED DAM JSON").should("exist");
              cy.contains("Approved DAM json is used").should("exist");
              cy.contains("DAM JSON").should("exist");
              cy.contains("APPROVED PAGE DETAILS JSON").should("exist");
              cy.contains("Approved Page Details json is used").should("exist");
              cy.contains("Page Details JSON").should("exist");
              cy.contains("APPROVED NAVIGATION JSON").should("exist");
              cy.contains("Approved Navigation json is used").should("exist");
              cy.contains("Navigation JSON").should("exist");
              cy.contains("Launching Details").should("exist");
              cy.contains("Scheduled Go Live Date").should("exist");
              cy.contains("EMPLOYEES TEMPLATE LIST").should("exist");
              cy.contains("Users List").should("exist");
              cy.contains("GL Codes template list").should("exist");
              cy.contains("Client's GL codes list").should("exist");
              cy.contains("Seed documents to be included").should("exist");
              cy.contains("Post Creation Records").should("exist");
              cy.contains("Logs Created").should("exist");
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
});
