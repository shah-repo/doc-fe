/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let secondEmployee;
let thirdEmployee;
let developersGroup;

context("PO approval test", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("Create company via API and create Purchase Order Form document", () => {
    it("[API] Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
            documentTypes: [
              {
                documentTypeName: "PO Part",
                documentTypeAcronym: "PRT-",
                group: "PART",
                isQms: true,
              },
            ],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          done();
        });
      });
    });

    it("[API] Create group with access to restricted doc_types", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        cy.grpAPICreateNewGroup({
          payload: {
            name: "Group with access to restricted doc types",
            tags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
            permissions: [],
            employees: [{ id: secondEmployee.id }, { id: thirdEmployee.id }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }, { id: thirdEmployee.id }],
        },
      });
    });

    it("[API] Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Purchase Order Form" });
    });

    it("Enter description 'New Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
    });

    it("Click 'Add New Field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Select 'Purchase Order' from list", () => {
      cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
    });

    it("Fill label field with 'New Purchase Order with Product item'", () => {
      cy.fbEnterPOLabelName({ name: "New Purchase Order with Product item" });
    });

    it("Click 'Add' to finish adding new field", () => {
      cy.fbAddNewFieldButton();
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

  context("Create Purchase Order Approval Matrix document with from Form document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New POAM Form'", () => {
      cy.drEnterDocumentTitle({ name: "New POAM Form" });
    });

    it("Enter description 'New POAM Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New POAM Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'PO Approval Matrix' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "PO Approval Matrix" });
    });

    it("Click 'Add New Field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Select 'PO Approval Matrix' from list", () => {
      cy.fbSelectItemFromNewFieldList({ field: "PO Approval Matrix" });
    });

    it("Fill label field with 'New POAM'", () => {
      cy.fbEnterPOLabelName({ name: "New POAM" });
    });

    it("Click 'Add' to finish adding new field", () => {
      cy.fbAddNewFieldButton();
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

    it("Create new POAM document from Form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title 'New POAM'", () => {
      cy.drEnterDocumentTitle({ name: "New POAM" });
    });

    it("Enter description 'New POAM description'", () => {
      cy.drEnterDocumentDescription({ description: "New POAM description" });
    });

    it("Click on 'Add Item'", () => {
      cy.poAddNewFieldItem();
    });

    it("Enter Level Name value to be '1'", () => {
      cy.poAMEnterLevelName({ name: "1" });
    });

    it("Enter Limit value to be '200'", () => {
      cy.poAMEnterLimit({ limit: "200" });
    });

    it(`Select Users '${USERS[2].name}'`, () => {
      cy.poAMSelectUsers(USERS[2].name);
    });

    it("Add first POAM level", () => {
      cy.poAddPOButtonClick();
    });

    it("Click on 'Add Item'", () => {
      cy.poAddNewFieldItem();
    });

    it("Enter Level Name value to be '2'", () => {
      cy.poAMEnterLevelName({ name: "2" });
    });

    it("Enter Limit value to be '400'", () => {
      cy.poAMEnterLimit({ limit: "400" });
    });

    it(`Select Users '${USERS[3].name}'`, () => {
      cy.poAMSelectUsers(USERS[3].name);
    });

    it("Add second POAM level", () => {
      cy.poAddPOButtonClick();
    });

    it("Click 'Save' document", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
        });
      cy.wait(500);
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Test the POAM when approving Purchase Order", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on 'Create PO' button", () => {
      cy.poClickCreatePO();
    });

    it("Enter description 'POAM test", () => {
      cy.drEnterDocumentDescriptionWithWait({ description: "POAM test" });
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
    });

    it("Click on 'Service' select option", () => {
      cy.poSelectOption({ optionName: "service" });
    });

    it("Enter ServiceID", () => {
      cy.poEnterServiceID({ serviceId: "SRV123" });
    });

    it("Enter Description", () => {
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "1" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "190" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save document", () => {
      cy.poSaveDocument();
    });

    it("Check approval icon if it's gray", () => {
      cy.poAMCheckApprovalIconIfItsGray();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
    });

    it("Check if error message says that approvers are not present", () => {
      SystemRequirement("REQ-1500");
      cy.poAMCheckForAlertMessage();
    });

    it("Check if selected approver has approval signature right by his name", () => {
      SystemRequirement("REQ-1510");
      cy.poAMCheckIfApproverHasApprovalSign();
      cy.unClick();
    });

    it("Add an Approval", () => {
      cy.wait(2000);
      cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul[role=\"listbox\"]>li").contains(USERS[2].name).click();
      });
    });

    it("Check approval icon if it's colored", () => {
      cy.poAMCheckApprovalIconIfItsRed();
    });

    it("Create document in 'Pending approval' state", () => {
      SystemRequirement("REQ-1520");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
    });

    it("Click on 'Withdraw Submission' button", () => {
      SystemRequirement("REQ-1530");
      cy.get("[data-cy=\"document.revision.withdraw.alert\"]").click();
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.EmployeesGet,
        CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"AlertDialog-continueButton\"]").click();
      });
    });

    it("Enter description 'POAM test", () => {
      cy.drEnterDocumentDescriptionWithWait({ description: "POAM test" });
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
    });

    it("Click on 'Service' select option", () => {
      cy.poSelectOption({ optionName: "service" });
    });

    it("Enter ServiceID", () => {
      cy.poEnterServiceID({ serviceId: "SRV234" });
    });

    it("Enter Description", () => {
      cy.poEnterDescription({ description: "Description for SRV234" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "1" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "190" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save document", () => {
      cy.poSaveDocument();
    });

    it("Add an Approval", () => {
      cy.wait(2000);
      cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul[role=\"listbox\"]>li").contains(USERS[3].name).click();
      });
    });

    it("Create document in 'Pending approval' state", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
    });

    it(`Log out with '${USERS[2].name}'`, () => {
      cy.authLogout();
    });

    it(`Log in with '${USERS[3].name}'`, () => {
      cy.authLogin({
        email: USERS[3].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Check for PO notification on dashboard", () => {
      SystemRequirement("REQ-2150", "REQ-3860", "REQ-2210");
      cy.arCheckDashboardPONotificationExistance({ shouldExist: true });
      cy.get("[data-cy=\"pendingActionsPO\"]").should("contain.text", "PURCHASE ORDER: PO-00001, Rev A")
        .and("contain.text", USERS[2].name).and("contain.text", "$380.00");
    });

    it("Click on 'Reject' PO and enter confirmation password", () => {
      cy.get("[data-cy=\"transition-reject\"]").first().click().wait(300);
      cy.get("#AlertDialog-continueButton").click();
      cy.checkToastMessage({ exists: false });
    });

    it("Navigate to Doc List", () => {
      cy.navigToDocumentList().wait(2000);
    });

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });

    it("Clear filters", () => {
      cy.filterClear();
    });

    it("Select rejected PO from list", () => {
      cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
    });

    it("Verify rejected PO status, should be 'Draft'", () => {
      SystemRequirement("REQ-0020", "REQ-0570", "REQ-1570");
      cy.poVerifyStatus({ status: "Draft" });
    });
  });
});

export { };

