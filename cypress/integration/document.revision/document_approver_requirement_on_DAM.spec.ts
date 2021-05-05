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
let multipleCompanies = false;

const ADMIN_USER = USERS[10];
const FIRST_USER = USERS[11];
const SECOND_USER = USERS[12];
const THIRD_USER = USERS[13];
const INDIVIDUAL_USER = USERS[14];

const ARDocument = "AR Document";
const FormDAM = "Form DAM";
const DAMDocument = "DAM Document";
const documentOne = "Document One";
const documentTwo = "Document Two";

const docTypeOne = "Design Document";
const docTypeTwo = "Clinical Document";
const docTypeOnePrefix = "DD";
const docTypeTwoPrefix = "CD";

const roleOne = "Role One";
const roleTwo = "Role Two";
const roleThree = "Role Three";

context("Document Approver Requirement on Document Approval Matrix", () => {

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
  });

  context("Create DAM", () => {
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

    it("Open add field dialogue", () => {
      cy.fbAddNewField();
    });

    it("Select 'Approval Matrix'", () => {
      cy.fbSelectApprovalMatrix();
    });

    it("Add 'Approval Matrix' field", () => {
      cy.fbAddField();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save DAM And Approve & Release Document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create New Document out of the Form", () => {
    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });
  });

  context("Fills in Title and Description", () => {
    it(`Type a title: ${DAMDocument}`, () => {
      cy.drEnterDocumentTitle({ name: `${DAMDocument}` });
    });

    it(`Type a description: ${DAMDocument}`, () => {
      cy.drEnterDocumentDescription({ description: DAMDocument });
    });
  });

  context(`Add New Role: ${roleOne}`, () => {
    it("Open 'Add Role' dialog", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.drAddAnotherRoleBtn();
      });
      cy.wait(500);
    });

    it(`Fill role name: ${roleOne}`, () => {
      cy.drEnterApprovalRole({ name: roleOne });
    });

    it(`Add approving users: ${FIRST_USER.name}`, () => {
      cy.drEnterApprovingUsers(FIRST_USER.name);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
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

    it("Save role", () => {
      cy.drAddApprovalRole();
    });
  });

  context(`Add New Role: ${roleThree}`, () => {
    it("Open 'Add Role' dialog", () => {
      cy.drAddAnotherRoleBtn();
    });

    it(`Fill role name: ${roleThree}`, () => {
      cy.drEnterApprovalRole({ name: roleThree });
    });

    it(`Add approving users: ${THIRD_USER.name}`, () => {
      cy.drEnterApprovingUsers(THIRD_USER.name);
    });

    it("Save role", () => {
      cy.drAddApprovalRole();
    });
  });

  context("Add New Document Type", () => {
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

    it(`Mark 'Approvals Numeric' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 1 });
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

    it(`Mark 'Approvals Administrative' for ${roleOne}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 0 });
    });

    it(`Mark 'Approvals Administrative' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 1 });
    });

    it("Save Approval Matrix Item", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").click();
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

    it("Add Category", () => {
      cy.drAddAMItemValue({ identity: "category", value: "Test" });
    });

    it(`Mark 'Approvals Numeric' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 1 });
    });

    it(`Mark 'Approvals Numeric' for ${roleThree}`, () => {
      cy.drAMCheckRole({ stage: "stage1", index: 2 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 1 });
    });

    it(`Mark 'Approvals Numeric Alpha' for ${roleThree}`, () => {
      cy.drAMCheckRole({ stage: "stage2", index: 2 });
    });

    it(`Mark 'Approvals Alpha' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 1 });
    });

    it(`Mark 'Approvals Alpha' for ${roleThree}`, () => {
      cy.drAMCheckRole({ stage: "stage3", index: 2 });
    });

    it(`Mark 'Approvals Administrative' for ${roleTwo}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 1 });
    });

    it(`Mark 'Approvals Administrative' for ${roleThree}`, () => {
      cy.drAMCheckRole({ stage: "admStage", index: 2 });
    });

    it("Save Approval Matrix Item", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Save").click();
    });
  });

  context("Approve & Release Document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
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

  context("Save document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
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
    it("Type a title", () => {
      cy.drEnterDocumentTitle({ name: `${documentTwo}` });
    });

    it("Type a description", () => {
      cy.drEnterDocumentDescription({ description: documentTwo });
    });

    it(`Fill in document type: ${docTypeTwo}`, () => {
      cy.drSelectDocumentType({ documentType: docTypeTwo });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Save document", () => {
    it("Clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context(`Create approval request: ${ARDocument}`, () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.cmpClickCreateApprovalRequest();
    });

    it(`Enter title AR title: ${ARDocument}`, () => {
      cy.arEnterApprovalRequestTitle({ title: ARDocument });
    });

    it(`Enter description: ${ARDocument}`, () => {
      cy.arEnterApprovalRequestDescription({ description: ARDocument });
    });

    it("Add created document revision", () => {
      cy.arClickAddDocument().wait(500);
      cy.arChoseSpecificProposedDocument({ name: documentOne });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add created document revision", () => {
      cy.arClickAddDocument().wait(500);
      cy.arChoseSpecificProposedDocument({ name: documentTwo });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it(`Verify approver is disabled for ${roleOne}`, () => {
      cy.arApproverRoleStatus({ roleName: roleOne, enabled: false });
    });

    it(`Verify approver is disabled for ${roleTwo}`, () => {
      cy.arApproverRoleStatus({ roleName: roleTwo, enabled: false });
    });

    it(`Verify approver is disabled for ${roleThree}`, () => {
      cy.arApproverRoleStatus({ roleName: roleThree, enabled: false });
    });

    it(`Verify approver is marked for ${roleOne}`, () => {
      cy.arApproverRoleStatus({ roleName: roleOne, enabled: true });
    });

    it(`Verify approver is marked for ${roleTwo}`, () => {
      cy.arApproverRoleStatus({ roleName: roleTwo, enabled: true });
    });

    it(`Verify approver is marked for ${roleThree}`, () => {
      cy.arApproverRoleStatus({ roleName: roleThree, enabled: true });
    });

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
      cy.wait(2000);
    });

    it("Add first approver to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: FIRST_USER.email });
    });

    it("Add second approver to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: SECOND_USER.email });
    });

    it("Add third approver to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: THIRD_USER.email });
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });

    it("Verify AR status is 'In Review'", () => {
      cy.arVerifyStatus({ status: "In Review" });
    });
  });

  context(`Login ${FIRST_USER.name} user now`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: FIRST_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context("Approve document in review", () => {
    it(`Approve document`, () => {
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

  context(`Login ${SECOND_USER.name} user now`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: SECOND_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context("Approve document in review", () => {
    it(`Approve document`, () => {
      cy.get("#root").contains("Approve").click();
    });

    it("Confirm password", () => {
      cy.get(`[data-cy="transition.action.password"]`).type("Tester1!");
      cy.wrapWithWaitOnApiCall(CyRoutes.ChangeRequestApprove, () => {
        cy.get(`[data-cy="passwordConfirm"]`).click();
      });
      cy.checkToastMessage({ exists: false });
    });
  });

  context(`Login ${THIRD_USER.name} user now`, () => {
    it("Logout the user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: THIRD_USER.email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: company.name, multiple: true });
    });
  });

  context("Approve document in review", () => {
    it(`Approve document`, () => {
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

  context("No validation error, submission is successful", () => {
    it("Check returned errors are empty", () => {
      cy.checkToastMessage({ exists: false });
    });
  });

  context(`Login admin '${ADMIN_USER.name}' user now`, () => {
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

  context(`Open AR Doc: ${ARDocument}`, () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it(`Select '${ARDocument}'`, () => {
      cy.alClearFilters();
      cy.get("#root").contains(ARDocument).click();
    });

    it("Close Approval Request", () => {
      cy.arCloseAR();
    });
  });

  context(`Open created documents, ${documentOne} and ${documentTwo}`, () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter the Released documents", () => {
      cy.dlFilterByStatus({ status: "Released" });
    });

    it(`select '${documentOne}'`, () => {
      cy.get("#root").contains(documentOne).click();
    });

    it("Verify Document status is 'Released'", () => {
      cy.arVerifyStatus({ status: "Released" });
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter the Released document", () => {
      cy.dlFilterByStatus({ status: "Released" });
    });

    it(`Select '${documentTwo}'`, () => {
      cy.get("#root").contains(documentTwo).click();
    });

    it("Verify Document status is 'Released'", () => {
      SystemRequirement("REQ-0870");
      cy.arVerifyStatus({ status: "Released" });
    });
  });

});
