// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let adminEmployeeLoginResponse;
let employeeLoginFirst;

const FormTitle = "New Form";
const DAMTitle = "My DAM";
const roleOne = "Role One";

context("Document Approval Matrix Revise", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          employeeLoginFirst = company.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create DAM", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${FormTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("fill in document type: Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("fill in output document type: Document Approval Matrix", () => {
      cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
    });
  });

  context("Save DAM And Approve & Release Document", () => {
    it("clicks on 'Create Document' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("Fills in Title and Description", () => {
    it(`type a title: ${DAMTitle}`, () => {
      cy.drEnterDocumentTitle({ name: DAMTitle });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Add New Role: Role One", () => {
    it("Open approval roles tab", () => {
      cy.drSelectApprovalRolesTab();
    });

    it("Open 'Add Role' dialog", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
        cy.drAddAnotherRoleBtn();
      });
    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving groups`, () => {
      cy.drEnterApprovingGroups("User Management", "Developers");
    });

    it("Save role", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drAddApprovalRole();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Approve & Release Document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context(`Check history is not created in group management page`, () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Open history panel", () => {
      cy.grpHistoryClickOpenButton();
    });

    it("Check history is not created", () => {
      cy.grpHistoryVerifyRecordsCount({ records: 1 });
    });

    it("Close history panel", () => {
      cy.grpHistoryClickCloseButton();
    });
  });

  context(`Check history is not created in user management page`, () => {
    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Check history is not created", () => {
      cy.usrHistoryVerifyRecordsCount({ records: 0 });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context(`Revise DAM '${DAMTitle}' and update approving groups`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${DAMTitle}'`, () => {
      cy.drFilterDocListByNameAndStatus({ title: DAMTitle, status: "Released" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.get("span[data-cy=documentTypeApprovalMatrix]").eq(0).should("exist");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Open approval roles tab", () => {
      cy.drSelectApprovalRolesTab();
    });

    it(`Remove one existing approving group`, () => {
      cy.drEditRemoveApprovingGroups({ eq: 0 }, "User Management");
    });

    it(`Add one new approving group`, () => {
      cy.drEditAddApprovingGroups({ eq: 0 }, "Company Admin");
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Revised document 'Approve and Release'", () => {
    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it("Type password in Approve and Release dialog", () => {
      cy.get("input[name=password]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
    });

    it("'Approve and Release' the document", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.ReleaseDocRev,
        () => {
          cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Check history is not created in group management page`, () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Open history panel", () => {
      cy.grpHistoryClickOpenButton();
    });

    it("Check history is not created", () => {
      cy.grpHistoryVerifyRecordsCount({ records: 1 });
    });

    it("Close history panel", () => {
      cy.grpHistoryClickCloseButton();
    });
  });

  context(`Check history is not created in user management page`, () => {
    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Check history is not created", () => {
      cy.usrHistoryVerifyRecordsCount({ records: 0 });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });
});

