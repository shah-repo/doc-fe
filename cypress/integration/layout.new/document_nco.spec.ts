import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
const randomNumberForCompany = Math.round(Math.random() * 100000) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

context("Verify new Layout for NCO for newly created Enlil items.", () => {
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

    context("Login user", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({
          USER: USERS[1],
          employeeId: adminEmployee.id,
        });
      });
    });

    context("Go to Document List and create a document", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Select Document Type 'Form' with output NCO and check Page default fields", () => {
      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'NCO' output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
      });

      it("Verify 'Title' field is visible", () => {
        cy.get("[data-cy=\"field-name\"]").should("exist");
      });

      it("Verify 'Description' field is visible", () => {
        cy.get("[data-cy=\"description\"]").should("exist");
      });

      it("Verify Default fields", () => {
        cy.verifyDefaultFields();
      });

      it("Verify Output document type", () => {
        cy.get("[data-cy=\"field-outputDocumentTypes\"]").should("exist");
      });

      it("Verify 'Selected Users' field is visible", () => {
        cy.get("[data-cy=\"field-securityEmployees\"]").should("exist");
      });

      it("Verify 'Selected Groups' field is visible", () => {
        cy.get("[data-cy=\"field-securityGroups\"]").should("exist");
      });

      it("Verify that Form Options should Not appear for this tab", () => {
        cy.verifyFormOptions({ visible: "not.exist" });
      });
    });

    context("Fill in the fields and click 'Create document'", () => {
      it("Enters title NCO Form", () => {
        cy.drEnterDocumentTitle({ name: "NCO Form" });
      });

      it("Enters description 'New NCO Form description'", () => {
        cy.drEnterDocumentDescription({ description: "New NCO Form description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click CREATE DOCUMENT", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Verify created form document", () => {
      it("Verify that the top left of the page displays: Icon and document type, Doc ID, Rev stage, status (Draft)",
        () => {
          cy.verifyDocumentHeaderDetails();
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        });
    });

    context("Verify that it contains Overview and Details tab", () => {
      it("Verify tabs", () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
        cy.get("[data-cy=\"tabId.details\"]").should("exist");
      });
    });

    context("Verify Form opens to the Overview tab by default", () => {
      it("Verify Overview as default selected tab", () => {
        cy.verifySelectedTab({ tab: "overview" });
      });

      it("Verify Default fields", () => {
        cy.verifyDefaultFields();
      });

      it("Verify that Form Options should appear for this tab", () => {
        cy.verifyFormOptions({ visible: "exist" });
      });
    });

    context("Click Details Tab, clicking on it should open that tab and close the other one", () => {
      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });
    });

    context("Verify that Details tab contains", () => {
      it("Verify Predefined schema fields and FB fields defined in Template", () => {
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
        cy.contains("If the whitelabeling section is empty, the system will use default Enlil colors.").should("exist");
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

      it("Verify that Form Options should appear for this tab", () => {
        cy.verifyFormOptions({ visible: "exist" });
      });
    });

    context("Release the form", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Click 'Create New' and new document NCO should be created", () => {
      it("Click 'Create New' button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle({ name: "NCO Record Document" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription({ description: "NCO Record Description" });
      });
    });

    context("Verify the same things that were verified on the form regarding NCO", () => {
      it("Verify Default fields", () => {
        cy.verifyDefaultFields();
      });
    });

    context("Verify all tabs are displayed in Overview and Details tab as it should", () => {
      it("Verify tabs", () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
        cy.get("[data-cy=\"tabId.details\"]").should("exist");
      });
    });

    context("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
      it("Verify there is no ADD A FIELD button", () => {
        cy.get("button[data-cy=\"form.builder.add.field\"]").should("not.exist");
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify there is no ADD A FIELD button", () => {
        cy.get("button[data-cy=\"form.builder.add.field\"]").should("not.exist");
      });

      it("Verify there is no EDIT A FIELD button", () => {
        cy.get("button[data-cy=\"edit-schema-item\"]").should("not.exist");
      });
    });

    context("Verify that user should not be able to rearrange the order of the Tabs", () => {
      it("Verify there is no drag A FIELD button", () => {
        cy.get("button[data-cy=\"drag-schema-item\"]").should("not.exist");
      });
    });

    context("Verify that right side panel opens by default to the References tab and that", () => {
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
    });

    context("Verify References tab contains the following:", () => {
      it("Verify References tab General Info", () => {
        cy.verifyReferencesGeneralInfo({ user: USERS[1].name });
      });

      it("Verify Add/Remove References", () => {
        cy.get("[data-cy=\"field-referenceTo\"]").should("exist");
        cy.get("[data-cy=\"referenceTo\"]").arrowClick();
        cy.drSelectReferences("FM-00001");
        cy.drRemoveReferences({ reference: "FM-00001" });
      });

      it("Verify Referenced By, Training, Release Date and Form Info", () => {
        cy.verifyReferencesOtherInfo();
      });

      it("Open migrate form tab", () => {
        cy.drSelectMigrateFormTab();
      });

      it("Select migration form", () => {
        cy.get("[data-cy=\"field-changeDocumentForm\"]").eq(0).arrowClick();
      });
    });

    context("Verify Revisions tab", () => {
      it("Open revisions tab, click and verify current revision", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drClickRevisionsSidePanel();
          cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
          cy.recCheckRevisionStage({ stage: "Revision 1" });
          cy.get("[data-cy=\"HeaderInfo-Rev\"]").contains("Rev 1");
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

      it("Add another group permission", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks, CyRoutes.PatchDocSecurity], () => {
          cy.drAddGroupFromPermissionTab("Developers");
        });
      });
    });

    context("Verify Bookmarks tab", () => {
      it("Open bookmarks tab", () => {
        cy.drSelectBookmarksTab();
      });
    });

    context("Verify Revision History tab", () => {
      it("Open revision history tab", () => {
        cy.drSelectRevisionHistoryTab();
        cy.get("[data-cy=\"Revision History-detail\"]").should("be.visible");
      });
    });
    // Hover over the history panel in overview tab

    // Verify that scroll bar appearing only on hover.

    // Click and drag the scroll bar and verify that user can scroll history tab.

    context("Fill in the fields and add DAM json, Page details json, Navigation json and add Employee list", () => {
      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it(`Enters company name '${newCompanyName}'`, () => {
        cy.get("[name^=company-name-]").arrowType(newCompanyName);
      });

      it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
        cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
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
    });

    context("Approve and release", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Verify that NCO is released and that it contains Overview and Details tab", () => {
      it("Verify that NCO is released", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      });

      it("Verify tabs", () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
        cy.get("[data-cy=\"tabId.details\"]").should("exist");
      });
    });
  });
});
