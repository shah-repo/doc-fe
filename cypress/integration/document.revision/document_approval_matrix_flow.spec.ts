// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let adminEmployeeLoginResponse;
let employeeLoginAdmin;
let employeeLoginIndividual;
let adminEmployee;
let docTypes: any[];
const DAMDocumentTypes: string[] = [];

const groupOne = "Group One";
const groupTwo = "Group Two";

const ADMIN_USER = USERS[10];
const FIRST_USER = USERS[11];
const SECOND_USER = USERS[12];
const THIRD_USER = USERS[13];
const INDIVIDUAL_USER = USERS[14];

const FormTitle = "New Form";
const DAMTitle = "My DAM";
const DDTitle = "DD Test";
const CDTitle = "CD Test";
const DWOTSTitle = "Document Without Training & Signature Test";

const docTypeOne = "Design Document";
const docTypeTwo = "Clinical Document";
const docTypeOnePrefix = "DD";
const docTypeTwoPrefix = "CD";
const docTypeThreePrefix = "DWOTS";
const docTypeThree = "Document Without Training & Signature";

const roleOne = "Role One";
const roleTwo = "Role Two";
const individualRole = "Role Three";

context("Document Approval Matrix Flow", () => {
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
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER, INDIVIDUAL_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          adminEmployee = company.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          docTypes = company.documentTypes || [];
          employeeLoginAdmin = company.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          employeeLoginIndividual = company.employees.find((employee) => employee.user.email === INDIVIDUAL_USER.email);
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        done();
      });
    });
  });

  context("Log in admin, select company and open group management", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: employeeLoginAdmin.id });
    });

    it("Open Group Management", () => {
      cy.grpNavigateToGroupManagement();
    });
  });

  context("Add Group One", () => {
    it("Open 'Add Group' dialog", () => {
      cy.wait(1500);
      cy.grpClickAddGroup();
    });

    it("Create official group", () => {
      cy.grpSelectOfficial();
    });

    it(`Fill group name: ${groupOne}`, () => {
      cy.grpEnterGroupName({ name: groupOne });
    });

    it("Select members: Admin & Second", () => {
      cy.grpTypeMembers(ADMIN_USER.name, SECOND_USER.name);
    });

    it("Add parent group: Everyone", () => {
      cy.grpAddParentGroups("Everyone");
    });

    it("Save group", () => {
      cy.grpSaveGroup();
    });
  });

  context("Add Group Two", () => {
    it("Open 'Add Group' dialog", () => {
      cy.wait(1500);
      cy.grpClickAddGroup();
    });

    it("Create official group", () => {
      cy.grpSelectOfficial();
    });

    it(`Fill group name: ${groupTwo}`, () => {
      cy.grpEnterGroupName({ name: groupTwo });
    });

    it("Select members: Second & Third", () => {
      cy.grpTypeMembers(SECOND_USER.name, THIRD_USER.name);
    });

    it("Add parent group: Everyone", () => {
      cy.grpAddParentGroups("Everyone");
    });

    it("Save group", () => {
      cy.grpSaveGroup();
    });
  });

  context("Create DAM", () => {
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
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("fill in output document type: Document Approval Matrix", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save DAM And Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]").arrowClick();
      });
    });
  });

  context("Check Document Types are present in DAM", () => {
    it("Open matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Approval Matrix document types", () => {
      cy.get(`[data-cy="documentTypeApprovalMatrix"]`).each(($el) => {
        DAMDocumentTypes.push($el.get(0).innerText);
      });
    });

    it("Check Document types", () => {
      SystemRequirement("REQ-0480");
      let exists = true;
      docTypes = docTypes || [];
      docTypes.forEach((type) => {
        if (!DAMDocumentTypes.includes(type.documentTypeName)) {
          exists = false;
        }
      });
      cy.wrap(exists).should("eq", true);
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

    it(`Add approving groups: ${groupOne}`, () => {
      cy.drEnterApprovingGroups(groupOne);
    });

    it("Save role", () => {
      SystemRequirement("REQ-0590");
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drAddApprovalRole();
      });
    });
  });

  context("Add New Document Type", () => {
    it("Open matrix details tab", () => {
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

    it("Mark needs signature", () => {
      cy.drAMCheckValue({ identity: "needsSignature" });
    });

    it("Mark needs training", () => {
      cy.drNewTypeTrainingSelect();
    });

    it("Add Category", () => {
      cy.drAddAMItemValue({ identity: "category", value: "Test" });
    });

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 0 });
    });

    it("Save Approval Matrix Item", () => {
      SystemRequirement("REQ-0630", "REQ-0640", "REQ-0650");
      SystemRequirement("REQ-4360");
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
      });
    });

    it("Save document", () => {
      cy.drClickCreateSupplierWithApiCall();
    });
  });

  context("Add Another Document Type without training", () => {
    it("Click on 'Add Item' button", () => {
      cy.drAddApprovalMatrixItem();
    });

    it(`Add prefix: ${docTypeThreePrefix}`, () => {
      cy.drAddAMItemValue({ identity: "prefix", value: docTypeThreePrefix });
    });

    it("Add internalType", () => {
      cy.drAMInternalType({ value: "OTHER" });
    });

    it(`Add document type: ${docTypeThree}`, () => {
      cy.drAddAMItemValue({ identity: "documentType", value: docTypeThree });
    });

    it("Ensure 'Training Required' not selected", () => {
      cy.get(`[data-cy="trainingReq"] input[type=checkbox]`).should("not.be.checked");
    });

    it("Save Approval Matrix Item", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Check All Doc Types", () => {
    let newDocTypes: string[] = [];

    it("[API]Fetch Document Types", (done: any) => {
      cy.drGetDocumentType({
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        employeeId: adminEmployee.id,
      }).then((response: any) => {
        const types = response || [];
        newDocTypes = types.map((t) => t.documentTypeName);
        done();
      });
    });

    it("Check Document types", () => {
      SystemRequirement("REQ-0480");
      let exists = true;
      docTypes = docTypes || [];
      docTypes.push({ documentTypeName: docTypeOne });
      docTypes.forEach((type) => {
        if (!newDocTypes.includes(type.documentTypeName)) {
          exists = false;
        }
      });
      cy.wrap(exists).should("eq", true);
    });
  });

  context(`Create document of new doc type: ${docTypeOne}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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

  context("Save document, Check Roles are enforced and 'Approve & Release' Document", () => {
    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Training Required' should be checked because of DAM", () => {
      SystemRequirement("REQ-0270");
      cy.drIsTrainingRequired({ shouldBe: true });
    });

    it("Verify training can be deselected", () => {
      SystemRequirement("REQ-0290");
      cy.drClickTrainingRequired();
      cy.drIsTrainingRequired({ shouldBe: false });
    });

    it(`Check ${roleOne} exists and is checked - Approve & Release`, () => {
      cy.drReleaseDocAfterRoleExistsAndChecked({ group: 0, role: roleOne });
    });
  });

  context(`Create document of new doc type: ${docTypeThree}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${DWOTSTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it(`fill in document type: ${docTypeThree}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeThree });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save document, Check Roles are enforced and 'Approve & Release' Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Training Required' should not be checked because of DAM", () => {
      SystemRequirement("REQ-0270");
      cy.drIsTrainingRequired({ shouldBe: false });
    });

    it("Verify training can be selected", () => {
      SystemRequirement("REQ-0290");
      cy.drClickTrainingRequired();
      cy.drIsTrainingRequired({ shouldBe: true });
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context(`Revise DAM: Open '${DAMTitle}'`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${DAMTitle}'`, () => {
      cy.dlClearFilters();
      cy.get("#root").contains(DAMTitle).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.get("span[data-cy=documentTypeApprovalMatrix]").eq(0).should("exist");
    });
  });

  context("Add New Role: Role Two", () => {
    it("Open approval roles tab", () => {
      cy.drSelectApprovalRolesTab();
    });

    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
    });

    it(`Fill role name: ${roleTwo}`, () => {
      cy.drEnterApprovalRole({ name: roleTwo });
    });

    it(`Add approving groups: ${groupTwo}`, () => {
      cy.drEnterApprovingGroups(groupTwo);
    });

    it("Save role", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drAddApprovalRole();
      });
    });
  });

  context("Add Individual Role", () => {
    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
    });

    it(`Fill role name: ${individualRole}`, () => {
      cy.drEnterApprovalRole({ name: individualRole });
    });

    it(`Add approving users: ${INDIVIDUAL_USER.name}`, () => {
      cy.drEnterApprovingUsers(INDIVIDUAL_USER.name);
    });

    it("Save role", () => {
      SystemRequirement("REQ-0600");
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drAddApprovalRole();
      });
    });
  });

  context("Add New Document Type", () => {
    it("Open matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Click on 'Add Item' button", () => {
      cy.drAddApprovalMatrixItem();
    });

    it(`Add prefix: ${docTypeTwoPrefix}`, () => {
      cy.drAddAMItemValue({ identity: "prefix", value: docTypeTwoPrefix });
    });

    it("Add internalType", () => {
      cy.drAMInternalType({ value: "OTHER" });
    });

    it(`Add document type: ${docTypeTwo}`, () => {
      SystemRequirement("REQ-0400");
      cy.drAddAMItemValue({ identity: "documentType", value: docTypeTwo });
    });

    it("Mark needs signature", () => {
      cy.drAMCheckValue({ identity: "needsSignature" });
    });

    it("Add Category", () => {
      cy.drAddAMItemValue({ identity: "category", value: "Test" });
    });

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 0 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 0 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 1 });
    });

    it(`Mark 'Approvals Alpha' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 0 });
    });

    it(`Mark 'Approvals Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 1 });
    });

    it(`Mark 'Approvals Alpha' for ${individualRole}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 2 });
    });

    it(`Mark 'Approvals Administrative' for ${individualRole}`, () => {
      SystemRequirement("REQ-0660", "REQ-0670");
      SystemRequirement("REQ-2780", "REQ-4390");
      cy.drAMCheckRole({ stage: "admStage", index: 2 });
    });

    it("Save Approval Matrix Item", () => {
      SystemRequirement("REQ-0630", "REQ-0640", "REQ-0650");
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").click();
      });
    });
  });

  context("'Approve & Release' Document", () => {
    it("Approve and Release the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Check All Doc Types", () => {
    let newDocTypes: string[] = [];

    it("[API]Fetch Document Types", (done: any) => {
      cy.drGetDocumentType({
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        employeeId: adminEmployee.id,
      }).then((response: any) => {
        const types = response || [];
        newDocTypes = types.map((t) => t.documentTypeName);
        done();
      });
    });

    it("Check Document types", () => {
      SystemRequirement("REQ-0480");
      let exists = true;
      docTypes = docTypes || [];
      docTypes.push({ documentTypeName: docTypeTwo });
      docTypes.forEach((type) => {
        if (!newDocTypes.includes(type.documentTypeName)) {
          exists = false;
        }
      });
      cy.wrap(exists).should("eq", true);
    });
  });

  context(`Create document of new doc type: ${docTypeTwo}`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${CDTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it(`fill in document type: ${docTypeTwo}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeTwo });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save document, Check Group Role is enforced and Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it(`Check ${roleOne} exists and is checked - Approve & Release`, () => {
      SystemRequirement("REQ-4220", "REQ-4270");
      cy.drReleaseDocAfterRoleExistsAndChecked({ group: 0, role: roleOne });
    });
  });

  context("Change to Administrative Change", () => {
    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Upgrade to administrative change", () => {
      cy.drAdministrativeRevisionLevel();
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("'Approve & Release' Document", () => {
    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it(`Enforce user rule, Add ${INDIVIDUAL_USER.name} to approvers`, () => {
      SystemRequirement("REQ-4270");
      cy.drAddApprover({ name: INDIVIDUAL_USER.name });
    });

    it("Type password in Approve and Release dialog", () => {
      cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
    });

    it("'Approve and Release' the document", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.ReleaseDocRev,
        () => {
          cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
        });
    });
  });

  context("No validation error, submission is successful", () => {
    it("Check returned errors are empty", () => {
      SystemRequirement("REQ-0010");
      cy.checkToastMessage({ exists: false });
    });
  });

  context(`Login ${INDIVIDUAL_USER.name} user now`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: INDIVIDUAL_USER, employeeId: employeeLoginIndividual.id });
    });
  });

  context("Approve document in review", () => {
    it(`approve document`, () => {
      cy.arApproveARFromDashboard();
    });
  });

  context("Login admin user now", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: ADMIN_USER, employeeId: employeeLoginAdmin.id });
    });
  });

  context(`Revise DAM: Open '${DAMTitle}'`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${DAMTitle}'`, () => {
      cy.get("#root").contains(DAMTitle).arrowClick();
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });
  });
});
