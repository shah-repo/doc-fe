import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

context("DAM and POAM", () => {
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
            documentTypes: [],
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

    context("Scenario 12a - DAM for Newly Created NCO", () => {
      context("Go to Document List and create a document", () => {
        it("Navigates to document list", () => {
          cy.navigToDocumentList();
        });

        it("Clicks on 'create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context("Create DAM FORM", () => {
        it("Enters title", () => {
          cy.drEnterDocumentTitle({ name: `DAM FORM` });
        });

        it("Enters description", () => {
          cy.drEnterDocumentDescription({ description: "DAM FORM Description" });
        });

        it("Select 'Form' document type from dropdown", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Selects output document type: Document Approval Matrix", () => {
          cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Click CREATE DOCUMENT", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("'Approve and Release' the DAM Form", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });

        it("Create New Document out of the Form", () => {
          cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]").arrowClick();
        });

        it(`Enters title`, () => {
          cy.drEnterDocumentTitle({ name: "DAM Title" });
        });

        it("Enters description", () => {
          cy.drEnterDocumentDescription({ description: "DAM Description" });
        });
      });

      context("Verify DAM", () => {
        it("Navigate to document list landing page", () => {
          cy.navigToDocumentList();
        });

        it("Filter document by name and status, and select it", () => {
          cy.drFilterDocListByNameAndStatus({ title: "DAM Title", status: "Draft" });
        });

        it("Verify that DAM contains Overview, Matrix Details and Approval roles tab", () => {
          cy.get("[data-cy=\"tabId.overview\"]").should("exist");
          cy.get("[data-cy=\"tabId.matrixdetails\"]").should("exist");
          cy.get("[data-cy=\"tabId.approvalroles\"]").should("exist");
        });
      });

      context("Verify this row is fixed, user should not be able to add/ edit new rows", () => {
        it("Verify there is no ADD A FIELD button", () => {
          cy.get("button[data-cy=\"form.builder.add.field\"]").should("not.exist");
        });

        it("Verify there is no EDIT A FIELD button", () => {
          cy.get("button[data-cy=\"edit-schema-item\"]").should("not.exist");
        });
      });

      context("Verify that user should not be able to rearrange the order of the Tabs", () => {
        it("should not be able to rearrange the order of the Tabs", () => {
          cy.verifyFixedTab();
        });
      });

      context("Verify DAM opens to the Overview tab by default", () => {
        it("Verify Overview as default selected tab", () => {
          cy.verifySelectedTab({ tab: "overview" });
        });

        it("Verify Document ID exist", () => {
          cy.get("[data-cy=\"field-document.docId\"]").should("exist");
        });

        it("Verify Training required exist", () => {
          cy.get("[data-cy=\"field-retrain\"]").should("exist");
        });

        it("Verify Attachments exist", () => {
          cy.get("[data-cy=\"AttachmentFieldPresenter-field\"]").should("exist");
        });

        it("Verify that Form Options should appear for this tab", () => {
          cy.verifyFormOptionsVisibility({ visibility: true });
        });
      });

      context("Click Matrix Details Tab, clicking on it should open that tab and close the other one", () => {
        it("Navigate to Matrix Details Tab", () => {
          cy.drSelectMatrixDetailsTab();
          cy.verifySelectedTab({ tab: "matrixdetails" });
        });
      });

      context("Verify table header content", () => {
        it("Verify table header contains: Prefix, Internal type, Document Type, Training, Signature, Category", () => {
          cy.get("table").contains("th", "Prefix");
          cy.get("table").contains("th", "Internal type");
          // cy.get("table").contains("th", "Document Type"); this is failing
          cy.get("table").contains("th", "Training");
          cy.get("table").contains("th", "Signature");
          cy.get("table").contains("th", "Category");
        });
      });

      context(`Add New Role: Role One`, () => {
        it("Open approval roles tab", () => {
          cy.drSelectApprovalRolesTab();
        });

        it("Open 'Add Role' dialog", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.drAddAnotherRoleBtn();
          });
        });

        it(`Fill role name: Role One`, () => {
          cy.drEnterApprovalRole({ name: "Role One" });
        });

        it(`Add approving users: ${USERS[2].name}`, () => {
          cy.drEnterApprovingUsers(USERS[2].name);
        });

        it("Save role", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
            cy.drAddApprovalRole();
          });
        });

        it("Verify that Approval roles tab contains: Approval role, Approving users, Approving groups", () => {
          cy.get("[data-cy=\"form.builder.approval.role\"]").should("exist");
          cy.get("[data-cy=\"form.builder.approving.users\"]").should("exist");
          cy.get("[data-cy=\"form.builder.approving.groups\"]").should("exist");
        });
      });

      context("User should be able to Add line item", () => {
        it("Open matrix details tab", () => {
          cy.drSelectMatrixDetailsTab();
        });

        it(`Verify table header contains: Approvals numeric, Approvals numeric alpha,  Approvals alpha,
        Approvals administrative`, () => {
          cy.get("table").contains("th", "Approvals Numeric");
          cy.get("table").contains("th", "Approvals Numeric Alpha");
          cy.get("table").contains("th", "Approvals Alpha");
          cy.get("table").contains("th", "Approvals Administrative");
        });

        it("Click on 'Add Item' button", () => {
          cy.drAddApprovalMatrixItem();
        });

        it(`Add prefix: "DT"`, () => {
          cy.drAddAMItemValue({ identity: "prefix", value: "DT" });
        });

        it("Add internalType", () => {
          cy.drAMInternalType({ value: "OTHER" });
        });

        it(`Add document type: Developer Test`, () => {
          cy.drAddAMItemValue({ identity: "documentType", value: "Developer Test" });
        });

        it(`Mark 'Approvals Numeric' for Role One`, () => {
          cy.drAMCheckRole({ stage: "stage1", index: 0 });
        });

        it(`Mark 'Approvals Numeric Alpha' for Role One`, () => {
          cy.drAMCheckRole({ stage: "stage2", index: 0 });
        });

        it(`Mark 'Approvals Alpha' for Role One`, () => {
          cy.drAMCheckRole({ stage: "stage3", index: 0 });
        });

        it(`Mark 'Approvals Administrative' for Role One`, () => {
          cy.drAMCheckRole({ stage: "admStage", index: 0 });
        });

        it("Save Approval Matrix Item", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
            cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
          });
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

      context("Verify History tab content scroll", () => {
        it("Verify that scroll bar appearing only on hover and user can scroll the content", () => {
          cy.verifyHistoryScroll();
        });
      });

      context("'Approve and Release' the document", () => {
        it("'Approve and Release' the document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });

        it("Check doc rev 1 released status", () => {
          cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        });
      });
    });
  });
});
