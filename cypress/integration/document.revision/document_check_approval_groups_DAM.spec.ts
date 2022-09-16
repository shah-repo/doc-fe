// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let company;
let adminEmployeeLoginResponse;
let employeeLoginAdmin;

const ADMIN_USER = USERS[10];
const FIRST_USER = USERS[11];
const SECOND_USER = USERS[12];
const THIRD_USER = USERS[13];
const INDIVIDUAL_USER = USERS[14];

const FormDAM = "Form DAM";
const DAMDocument = "DAM Document";
const documentOne = "Document One";

const docTypeOne = "Design Document";
const docTypeTwo = "Clinical Document";
const docTypeOnePrefix = "DD";
const docTypeTwoPrefix = "CD";

const roleOne = "Role One";
const roleTwo = "Role Two";

const groupName = "Test_dam group";

context("Document Approver Requirement on DAM with the groups", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API] Prepare company", () => {
    it("[API] Creates company", (done: any) => {
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
          employeeLoginAdmin = company.employees.find((employee) => employee.user.email === ADMIN_USER.email);
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
  });

  context("Create group and add members.", () => {
    context("Create 'Group'", () => {
      it("Navigate to Group Management", () => {
        cy.grpNavigateToGroupManagement();
      });

      it("Click 'Add Group'", () => {
        cy.fbClickButton({ el: "Group-openDialog" });
      });

      it("Select 'Official' radio button", () => {
        cy.grpSelectOfficial();
      });

      it("Enter Group Name " + groupName, () => {
        cy.grpEnterGroupName({ name: groupName });
      });

      it("Assigns permissions to the group", () => {
        cy.grpAddPermission({ permission: "CR_ON_APPROVER_LIST" });
        cy.grpAddPermission({ permission: "CR_OWNER_AS_APPROVER" });
      });

      it("Select Members", () => {
        cy.grpTypeMembers(USERS[11].name, USERS[12].name);
      });

      it("Click Save button", () => {
        cy.grpSaveGroup();
      });
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

    it(`Type a title: '${FormDAM}'`, () => {
      cy.drEnterDocumentTitle({ name: `${FormDAM}` });
    });

    it(`Type a description: '${FormDAM}'`, () => {
      cy.drEnterDocumentDescription({ description: FormDAM });
    });

    it("Fill in document type: Form", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Fill in output document type: Document Approval Matrix", () => {
      cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drCreateNewDocumentFromForm();
      });
    });
  });

  context("Fills in Title and Description", () => {
    it(`Type a title: ${DAMDocument}`, () => {
      cy.drEnterDocumentTitle({ name: `${DAMDocument}` });
    });

    it(`Type a description: ${DAMDocument}`, () => {
      cy.drEnterDocumentDescription({ description: DAMDocument });
    });

    it("Upload attachment 'image.jpg'", () => {
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context(`Add New Role: ${roleOne}`, () => {
    it("Open approval roles tab", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetFieldLocks,
      ],
      () => {
        cy.drSelectApprovalRolesTab();
      });
    });

    it("Open 'Add Role' dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.drAddAnotherRoleBtn();
      });
    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving users: ${FIRST_USER.name}`, () => {
      cy.drEnterApprovingUsers(FIRST_USER.name);
    });


    it(`Add approving groups: ${groupName}`, () => {
      cy.drEnterApprovingGroups(groupName);
    });

    it("Verify the group present in list", () => {
      cy.get("[name^=\"groups\"]").should("contain", `${groupName}`);
    });
    it("Save role", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.drAddApprovalRole();
      });
    });
  });

  context(`Add New Role: ${roleTwo}`, () => {
    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
    });

    it(`Fill role name: ${roleTwo}`, () => {
      cy.drEnterApprovalRole({ name: roleTwo });
    });

    it(`Add approving users: ${SECOND_USER.name}`, () => {
      cy.drEnterApprovingUsers(SECOND_USER.name);
    });

    it(`Add approving groups: ${groupName}`, () => {
      cy.drEnterApprovingGroups(groupName);
    });

    it("Save role", () => {
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

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 0 });
    });

    it(`Mark 'Approvals Numeric' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 1 });
    });

    it("Save Approval Matrix Item", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
      });
    });
  });

  context("Add Another Document Type", () => {
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
      cy.drAddAMItemValue({ identity: "documentType", value: docTypeTwo });
    });

    it(`Mark 'Approvals Numeric' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 0 });
    });

    it(`Mark 'Approvals Numeric' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 1 });
    });

    it("Save Approval Matrix Item", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
        cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").arrowClick();
      });
    });

    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("'Approve and Release' the document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.get("span[data-cy=documentTypeApprovalMatrix]").eq(0).should("exist");
    });

    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: `${documentOne}` });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: documentOne });
    });

    it(`Fill in document type: ${docTypeOne}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeOne });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save document.", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("'Approve & Release' Document & confirm the user and roles selected.", () => {
    it("click on 'Approve and Release' button", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
    });

    it("Verify the group members", () => {
      cy.get("[data-cy^=field-approvals]").eq(0).autocompleteSelect(`${FIRST_USER.name}`);
      cy.get("[data-cy^=field-approvals]").eq(0).autocompleteSelect(`${SECOND_USER.name}`);
    });

    it(`Verify roles should be checked`, () => {
      cy.get(`[data-cy="group-0"]`).parent().parent()
        .should("contain.text", roleOne)
        .and("contain.text", roleTwo);
    });
  });
});

