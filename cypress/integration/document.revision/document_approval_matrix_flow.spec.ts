// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { NavigationItems } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let adminEmployeeLoginResponse;
let multipleCompanies = false;
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
const IMPORTER_USER = USERS[15];

const FormTitle = "New Form";
const DAMTitle = "My DAM";
const DDTitle = "DD Test";
const CDTitle = "CD Test";
const DWOTSTitle = "Document Without Training & Signature Test";

const docTypeOne = "Design Document";
const docTypeTwo = "Clinical Document";
const newDocTypeOne = "Edited Design Document";
const docTypeOnePrefix = "DD";
const docTypeTwoPrefix = "CD";
const docTypeThreePrefix = "DWOTS";
const docTypeThree = "Document Without Training & Signature";

const roleOne = "Role One";
const roleTwo = "Role Two";
const individualRole = "Role Three";

context("Document Approval Matrix Flow", () => {

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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [FIRST_USER, SECOND_USER, THIRD_USER, INDIVIDUAL_USER],
            documentTypes: [],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          adminEmployee = company.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          docTypes = company.documentTypes || [];
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        multipleCompanies = adminEmployeeLoginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Log in admin, select company and open group management", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: multipleCompanies });
    });

    it("Open Group Management", () => {
      cy.navigClickOnItem({ navigItem: NavigationItems.GROUP_MANAGEMENT });
    });
  });

  context("Add Group One", () => {
    it("Open 'Add Group' dialog", () => {
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
      cy.grpAddGroup();
    });

    it("Close group dialog", () => {
      cy.grpCloseGroupBtn();
    });
  });

  context("Add Group Two", () => {
    it("Open 'Add Group' dialog", () => {
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
      cy.grpAddGroup();
    });

    it("Close group dialog", () => {
      cy.grpCloseGroupBtn();
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

    it("open add field dialogue", () => {
      cy.fbAddNewField();
    });

    it("select 'Approval Matrix'", () => {
      cy.fbSelectApprovalMatrix();
    });

    it("add 'Approval Matrix' field", () => {
      cy.fbAddField();
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
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("Check Document Types are present in DAM", () => {
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

  context("fills in Title and Description", () => {
    it(`type a title: ${DAMTitle}`, () => {
      cy.drEnterDocumentTitle({ name: `${DAMTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });
  });

  context("Add New Role: Role One", () => {
    it("Open 'Add Role' dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesGet, CyRoutes.GroupsGet], () => {
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
    it("Click on 'Add Item' button", () => {
      cy.drOpenCloseSidebarDrawer();
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
      SystemRequirement("REQ-0470");
      cy.drNewTypeTrainingSelect();
    });

    it("Add Category", () => {
      cy.drAddAMItemValue({ identity: "category", value: "Test" });
    });

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 0 });
    });

    it("Save Approval Matrix Item", () => {
      SystemRequirement("REQ-0630", "REQ-0650");
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").click();
      });
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
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").click();
    });
  });

  context("Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
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
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Training Required' should be checked because of DAM", () => {
      SystemRequirement("REQ-0270");
      cy.drIsTrainingRequired({ shouldBe: true });
    });

    it("Verify training can be deselected", () => {
      SystemRequirement("REQ-0290");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
        cy.drClickTrainingRequired();
      });
      cy.drIsTrainingRequired({ shouldBe: false });
    });

    it(`Check ${roleOne} exists and is checked - Approve & Release`, () => {
      cy.wait(5000);
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
      cy.get("#root").contains(DAMTitle).click();
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });
  });

  context("Add New Role: Role Two", () => {
    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
      cy.wait(1000);
    });

    it(`Fill role name: ${roleTwo}`, () => {
      cy.drEnterApprovalRole({ name: roleTwo });
    });

    it(`Add approving groups: ${groupTwo}`, () => {
      cy.drEnterApprovingGroups(groupTwo);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
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

      cy.drAddApprovalRole();
    });
  });

  context("Add New Document Type", () => {
    it("Click on 'Add Item' button", () => {
      cy.drOpenCloseSidebarDrawer();
      cy.wait(1000);
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
      cy.drAMCheckRole({ stage: "admStage", index: 2 });
    });

    it("Save Approval Matrix Item", () => {
      SystemRequirement("REQ-0630", "REQ-0650");

      cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").click();
    });
  });

  context("'Approve & Release' Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

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
      cy.wait(5000);
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
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("'Approve & Release' Document", () => {
    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it(`Enforce user rule, Add ${INDIVIDUAL_USER.name} to approvers`, () => {
      cy.drAddApprover({ name: INDIVIDUAL_USER.name });
    });

    it("'Approve and Release' the document", () => {
      cy.wrapWithWaitOnApiCall(
        CyRoutes.ReleaseDocRev,
        () => {
          cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
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

    it("Logs user in", () => {
      cy.authLogin({
        email: INDIVIDUAL_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context("Approve document in review", () => {
    it(`approve document`, () => {
      cy.wait(1000);
      cy.get("#root").contains("Approve").click();
    });

    it("Confirm password", () => {
      cy.get(`[data-cy="transition.action.password"]`).type("Tester1!");
      cy.wrapWithWaitOnApiCall(CyRoutes.ChangeRequestApprove,
        () => {
          cy.get(`[data-cy="passwordConfirm"]`).click();
        });
    });
  });

  context("Rename document type", () => {
    let newDocTypes: any[] = [];

    it("[API]Fetch Document Types", (done: any) => {
      cy.drGetDocumentType({
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        employeeId: adminEmployee.id,
      }).then((response: any) => {
        newDocTypes = response || [];
        done();
      });
    });

    it(`change name '${docTypeOne}' to '${newDocTypeOne}'`, () => {
    // SystemRequirement("REQ-0430");
      cy.drUpdateDocumentTypeName({
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        employeeId: adminEmployee.id,
        id: newDocTypes.find((el) => el.documentTypeName === docTypeOne).id,
        payload: {
          documentTypeName: newDocTypeOne,
        },
      });
    });
  });

  context("Login admin user now", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context(`Revise DAM: Open '${DAMTitle}'`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it(`select '${DAMTitle}'`, () => {
      cy.get("#root").contains(DAMTitle).click();
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });
  });

  context("Check edited document type is displayed", () => {
    const documentTypes: string[] = [];
    it("Approval Matrix document types", () => {
      cy.get(`[data-cy="documentTypeApprovalMatrix"]`).each(($el) => {
        documentTypes.push($el.get(0).innerText);
      });
    });

    it(`find changed document type '${newDocTypeOne}'`, () => {
    // SystemRequirement("REQ-0530");
      const exists = documentTypes.includes(newDocTypeOne);
      cy.wrap(exists).should("eq", true);
    });
  });
});
