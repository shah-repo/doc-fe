// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let adminEmployeeLoginResponse;
let employeeLoginFirst;

const INDIVIDUAL_USER = USERS[14];

const FormTitle = "New Form";
const DAMTitle = "My DAM";
const DDTitle = "DD Test";
const docTypeOne = "Design Document";
const docTypeOnePrefix = "DD";
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [INDIVIDUAL_USER],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
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
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
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

    it("fill in output document type: Document Approval Matrix", () => {
      cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save DAM And Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]").arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Fills in Title and Description", () => {
    it(`type a title: ${DAMTitle}`, () => {
      cy.drEnterDocumentTitle({ name: DAMTitle });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });
  });

  context("Add New Role: Role One", () => {
    it("Open approval roles tab", () => {
      cy.drSelectApprovalRolesTab();
    });

    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving user: ${INDIVIDUAL_USER.name}`, () => {
      cy.drEnterApprovingUsers(INDIVIDUAL_USER.name);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Add New Document Type", () => {
    it("Open matrix details tab", () => {
      cy.cmpTurnOffAutosave();
      cy.drSelectMatrixDetailsTab();
    });

    it("Click on 'Add Item' button", () => {
      cy.drAddApprovalMatrixItem();
    });

    it(`Add prefix: ${docTypeOnePrefix}`, () => {
      cy.drAddAMItemValue({ identity: "prefix", value: docTypeOnePrefix });
    });

    it("Add internalType", () => {
      cy.drAMInternalType({ value: "OTHER" });
    });

    it(`Add document type: ${docTypeOne}`, () => {
      cy.drAddAMItemValue({ identity: "documentType", value: docTypeOne });
    });

    it("Add Category", () => {
      cy.drAddAMItemValue({ identity: "category", value: "Test" });
    });

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 0 });
    });

    it("Save Approval Matrix Item", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickCreateSupplierWithoutApiCall();
    });
  });

  context("Approve & Release Document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context(`Create document of new doc type: ${docTypeOne}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${DDTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it(`fill in document type: ${docTypeOne}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeOne });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save and 'Approve & Release' Document", () => {
    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Check approvals enforcement", () => {
      cy.drCheckApprovalsEnforcment();
    });

    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it(`Enforce user rule, Add ${INDIVIDUAL_USER.name} to approvers`, () => {
      cy.drAddApprover({ name: INDIVIDUAL_USER.name });
    });

    it(`${roleOne} should be checked`, () => {
      cy.get(`[data-cy="group-0"]`).contains(roleOne);
      cy.get(`[data-cy="checked-0"]`).should("be.visible");
    });

    it("Type password in Approve and Release dialog", () => {
      cy.get("input[name=password]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
    });

    it("'Approve and Release' the document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Revise DAM '${DAMTitle}' and change to Administrative Change`, () => {
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

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.get("span[data-cy=documentTypeApprovalMatrix]").eq(0).should("exist");
    });

    it("Upgrade to administrative change", () => {
      cy.drSelectOverviewTab();
      cy.drAdministrativeRevisionLevel();
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Revision should be upgraded after 'Approve and Release'", () => {
    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it("Type password in Approve and Release dialog", () => {
      cy.get("input[name=password]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
    });

    it("Verify revision status is 'Revision 1.1  - Draft'", () => {
      cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 1.1", status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("'Approve and Release' the document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Create document of doc type: ${docTypeOne}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${DDTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it(`fill in document type: ${docTypeOne}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeOne });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save and 'Approve & Release' Document", () => {
    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Check approvals enforcement", () => {
      cy.drCheckApprovalsEnforcment();
    });

    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it(`Enforce user rule, Add ${INDIVIDUAL_USER.name} to approvers`, () => {
      cy.drAddApprover({ name: INDIVIDUAL_USER.name });
    });

    it(`${roleOne} should be checked`, () => {
      cy.get(`[data-cy="group-0"]`).contains(roleOne);
      cy.get(`[data-cy="checked-0"]`).should("be.visible");
    });

    it("Type password in Approve and Release dialog", () => {
      cy.get("input[name=password]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
    });

    it("'Approve and Release' the document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Revise DAM and remove approvers", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${DAMTitle}'`, () => {
      cy.dlClearFilters();
      cy.get("#root").contains(DAMTitle).click();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.get("span[data-cy=documentTypeApprovalMatrix]").eq(0).should("exist");
    });

    it("Click edit DAM", () => {
      cy.drClickDAMEditBtn();
    });

    it(`Uncheck Approvals Numeric for ${roleOne}`, () => {
      cy.get("div:nth-child(2) > div> table > tbody > tr:nth-child(26) > td:nth-child(1)").click();
    });
  });

  context("'Approve & Release' Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and Release the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context(`Create document of new doc type: ${docTypeOne} without approvers`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${DDTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it(`fill in document type: ${docTypeOne}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeOne });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it(`${roleOne} should not exist`, () => {
      cy.get(`[data-cy="group-0"]`).should("not.exist");
      cy.get(`[data-cy="checked-0"]`).should("not.exist");
    });

    it("Type password in Approve and Release dialog", () => {
      cy.get("input[name=password]").type(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
    });

    it("'Approve and Release' the document", () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });
  });
});
