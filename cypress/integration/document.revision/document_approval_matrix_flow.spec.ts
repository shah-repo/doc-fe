// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { NavigationItems } from "../../../src/state/ducks/auth/types";
import { CyRoutes } from "../../support/routes";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

const runId = new Date().valueOf();
let company;
let loginResponse;
let multipleCompanies = false;
let employee;
let docTypes: any[];
const DAMDocumentTypes: string[] = [];

const groupOne = "Group One";
const groupTwo = "Group Two";

const memberAdmin = "Admin";
const memberSecond = "Second";
const memberThird = "Third";
const individualMember = "Importer Admin";

const FormTitle = "New Form";
const DAMTitle = "My DAM";
const DDTitle = "Test DD";
// const DevDTitle = "Test Dev Document";

const roleOne = "Role One";
const roleTwo = "Role Two";
const individualRole = "Role Three";

context("Document Approval Matrix Flow", () => {

  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: "zoran.kovacevic+admin@codecons.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [
              {
                name: "Second Tester",
                email: "enlil.testmail+cy2@gmail.com",
              },
              {
                name: "Third Tester",
                email: "enlil.testmail+cy3@gmail.com",
              },
              {
                name: "Fourth Tester",
                email: "enlil.testmail+cy4@gmail.com",
              }],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          company = response;
          employee = company.employees.find((employee) => employee.user.name === "Admin");
          docTypes = company.documentTypes || [];
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Log in user, select company and open group management", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: "zoran.kovacevic+admin@codecons.com",
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
      cy.grpSelectGroupType({ isOfficial: true });
    });

    it(`Fill group name: ${groupOne}`, () => {
      cy.grpTypeGroupName({ name: groupOne });
    });

    it("Select members: Admin & Second", () => {
      cy.grpTypeMembers(memberAdmin, memberSecond);
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
      cy.grpSelectGroupType({ isOfficial: true });
    });

    it(`Fill group name: ${groupTwo}`, () => {
      cy.grpTypeGroupName({ name: groupTwo });
    });

    it("Select members: Second & Third", () => {
      cy.grpTypeMembers(memberSecond, memberThird);
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

  context("Open 'Create Document'", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
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
      cy.drAddOutputDocType({ documentType: "Document Approval Matrix" });
    });
  });

  context("Fill in approval matrix attributes", () => {
    it("open add field dialogue", () => {
      cy.fbAddNewField();
    });

    it("select 'Approval Matrix'", () => {
      cy.fbSelectApprovalMatrix();
    });

    it("add 'Approval Matrix' field", () => {
      cy.fbAddField();
    });
  });

  context("Save DAM And Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context("Create New Document out of the Form", () => {
    it("open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("Document Types are present in DAM", () => {
    it("Approval Matrix document types", () => {
      cy.get(`[data-cy="documentTypeApprovalMatrix"]`).each(($el) => {
        DAMDocumentTypes.push($el.get(0).innerText);
      });
    });

    it("Check Document types", () => {
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

  context("Add Role One", () => {
    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving groups: ${groupOne}`, () => {
      cy.drEnterApprovingGroups(groupOne);
    });

    it("Save role", () => {
      SystemRequirement("REQ-0590");

      cy.drAddApprovalRole();
    });
  });

  context("Add Role Two", () => {
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

    it(`Add approving users: ${individualMember}`, () => {
      cy.drEnterApprovingUsers(individualMember);
    });

    it("Save role", () => {
      SystemRequirement("REQ-0600");

      cy.drAddApprovalRole();
    });
  });

  context("Add New Document Type", () => {
    it("Click on 'Add Item' button", () => {
      cy.drAddApprovalMatrixItem();
    });

    it("Add prefix", () => {
      cy.drAddAMItemValue({ identity: "prefix", value: "DD" });
    });

    it("Add internalType", () => {
      cy.drAMInternalType({ value: "OTHER" });
    });

    it("Add document type", () => {
      cy.drAddAMItemValue({ identity: "documentType", value: "Design Document" });
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

  context("Approve & Release Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocument();
    });
  });

  context("Check All Doc Types", () => {
    let newDocTypes: string[] = [];

    it("[API]Fetch Document Types", (done: any) => {
      cy.drGetDocumentType({
        sessionId: loginResponse.sessionId as unknown as string,
        employeeId: employee.id,
      }).then((response: any) => {
        const types = response || [];
        newDocTypes = types.map((t) => t.documentTypeName);
        done();
      });
    });

    it("Check Document types", () => {
      let exists = true;
      docTypes = docTypes || [];
      docTypes.push({ documentTypeName: "Design Document" });
      docTypes.forEach((type) => {
        if (!newDocTypes.includes(type.documentTypeName)) {
          exists = false;
        }
      });
      cy.wrap(exists).should("eq", true);
    });
  });

  context("Open 'Create Document'", () => {
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

    it("fill in document type: Design Document", () => {
      cy.drSelectDocumentType({ documentType: "Design Document" });
    });
  });

  context("Save document, Check Roles are enforced and 'Approve & Release' Document", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it(`Check ${roleOne} exists and is checked`, () => {
      cy.drRoleExistsAndChecked({ group: 0, role: roleOne });
    });

    it("'Approve and Release' the document", () => {
      cy.drSelectTemplateReleaseDocument({ template: "Initial AR Form" });
    });
  });
  /*
 // BUG: Only first Document type is shown in document listing. Shall be uncommented once this bug is fixed.
  context(`Open '${DAMTitle}' Document and Revise Document`, () => {
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

  context("Add New Document Type", () => {
    it("Click on 'Add Item' button", () => {
      cy.wait(1000);
      cy.drAddApprovalMatrixItem();
    });

    it("Add prefix", () => {
      cy.drAddAMItemValue({ identity: "prefix", value: "DED" });
    });

    it("Add internalType", () => {
      cy.drAMInternalType({ value: "OTHER" });
    });

    it("Add document type", () => {
      cy.drAddAMItemValue({ identity: "documentType", value: "Develop Document" });
    });

    it("Mark needs signature", () => {
      cy.drAMCheckValue({ identity: "needsSignature" });
    });

    it("Add Category", () => {
      cy.drAddAMItemValue({ identity: "category", value: "Test" });
    });

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 2 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 2 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 0 });
    });

    it(`Mark 'Approvals Alpha' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 2 });
    });

    it(`Mark 'Approvals Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 0 });
    });

    it(`Mark 'Approvals Alpha' for ${individualRole}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 1 });
    });

    it(`Mark 'Approvals Administrative' for ${individualRole}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 1 });
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
      cy.drApproveAndReleaseDocument();
    });
  });

  context("Check All Doc Types", () => {
    let newDocTypes: string[] = [];

    it("[API]Fetch Document Types", (done: any) => {
      cy.drGetDocumentType({
        sessionId: loginResponse.sessionId as unknown as string,
        employeeId: employee.id,
      }).then((response: any) => {
        const types = response || [];
        newDocTypes = types.map((t) => t.documentTypeName);
        done();
      });
    });

    it("Check Document types", () => {
      let exists = true;
      docTypes = docTypes || [];
      docTypes.push({ documentTypeName: "Develop Document" });
      docTypes.forEach((type) => {
        if (!newDocTypes.includes(type.documentTypeName)) {
          exists = false;
        }
      });
      cy.wrap(exists).should("eq", true);
    });
  });

  context("Create New Document of newly created Type, open 'Create Document'", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${DevDTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("fill in document type: Develop Document", () => {
      cy.drSelectDocumentType({ documentType: "Develop Document" });
    });
  });

  context("Save document, Check Roles are enforced", () => {
    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("click on 'Approve and Release' button", () => {
      cy.drApproveAndReleaseDialog();
    });

    it(`Check ${roleOne} exists and is checkeded`, () => {
      cy.drRoleExistsAndChecked({ group: 0, role: roleOne });
    });
  });

  context("'Approve & Release' Document and Revise Document", () => {
    it("'Approve and Release' the document", () => {
      cy.drSelectTemplateReleaseDocument({ template: "Initial AR Form" });
    });
  }); */

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

    it(`Add ${individualMember} to approvers`, () => {
      cy.drAddApprover({ name: individualMember });
    });

    it("'Approve and Release' the document", () => {
      cy.drSelectTemplateReleaseDocument({ template: "Initial AR Form" });
    });
  });

  context("No validation error, submission is successful", () => {
    it("Check returned errors are empty", () => {
      SystemRequirement("REQ-0010");

      cy.checkToastMessage({ exists: false });
    });
  });

  context("Login importer admin user now", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: "enlil.testmail+cy5@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context("Approve document in review", () => {
    it(`approve document`, () => {
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
        sessionId: loginResponse.sessionId as unknown as string,
        employeeId: employee.id,
      }).then((response: any) => {
        newDocTypes = response || [];
        done();
      });
    });

    it("change name 'Design Document' to 'Develop Document'", () => {
      let payload: any = newDocTypes.find((el) => el.documentTypeName === "Design Document");
      const documentId = payload.id;
      payload = JSON.parse(JSON.stringify(payload));

      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.id;
      delete payload.pageDetails;
      delete payload.groupOptions;

      payload.documentTypeName = "Develop Document";
      cy.drUpdateDocumentTypeName({
        sessionId: loginResponse.sessionId as unknown as string,
        employeeId: employee.id,
        id: documentId,
        payload,
      });
    });
  });

  context("Login admin user now", () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context(`Create Document`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Check edited document type exists", () => {
    it("fill in document type: Develop Document", () => {
      cy.drSelectDocumentType({ documentType: "Develop Document" });
    });
  });

});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };
