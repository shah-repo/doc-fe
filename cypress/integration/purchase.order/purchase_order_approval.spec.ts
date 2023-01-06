/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let createdCompany;
let loginResponse;
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
                group: DOC_TYPE_GROUP.PART,
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
      }).then((response) => {
        loginResponse = response;
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
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create Purchase Order Approval Matrix document with from Form document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Create new POAM document from Form", () => {
      cy.drCreateNewDocumentFromForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter title 'New POAM'", () => {
      cy.drEnterDocumentTitle({ name: "New POAM" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter description 'New POAM description'", () => {
      cy.wait(2000);
      cy.drEnterDocumentDescription({ description: "New POAM description" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to MatrixDetails tab", () => {
      cy.drSelectMatrixDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add Item'", () => {
      cy.get(`div[name="po-levels-built-in"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
    });

    it("Enter Level Name value to be '1'", () => {
      cy.poAMEnterLevelName({ name: "1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Limit value to be '200'", () => {
      cy.poAMEnterLimit({ limit: "200" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select Users '${USERS[2].name}'`, () => {
      cy.poAMSelectUsers(USERS[2].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add first POAM level", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add Item'", () => {
      cy.get(`div[name="po-levels-built-in"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Level Name value to be '2'", () => {
      cy.poAMEnterLevelName({ name: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Limit value to be '400'", () => {
      cy.poAMEnterLimit({ limit: "400" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select Users '${USERS[3].name}'`, () => {
      cy.poAMSelectUsers(USERS[3].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add second POAM level", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Test the POAM when approving Purchase Order", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Create PO' button", () => {
      cy.poClickCreatePO();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter description 'POAM test", () => {
      cy.drEnterDocumentDescription({ description: "POAM testing description" });
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Service' select option", () => {
      cy.poSelectOption({ optionName: "service" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter ServiceID", () => {
      cy.poEnterServiceID({ serviceId: "SRV123" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Description", () => {
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "190" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add required order date", () => {
      cy.poAddDateRequired();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check approval icon if it's gray", () => {
      cy.poAMCheckApprovalIconIfItsGray();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Check if error message says that approvers are not present", () => {
      SystemRequirement("REQ-1500");
      cy.poAMCheckForAlertMessage();
    });

    it("Check if selected approver has approval signature right by his name", () => {
      SystemRequirement("REQ-1510");
      cy.poAMCheckIfApproverHasApprovalSign();
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select '${USERS[2].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("[data-cy='po-requestor-autocomplete']").autocompleteSelect(USERS[2].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.poSaveDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check approval icon if it's colored", () => {
      cy.poAMCheckApprovalIconIfItsRed();
    });

    it("Create document in 'Pending approval' state", () => {
      SystemRequirement("REQ-1520");
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Withdraw Submission' button", () => {
      SystemRequirement("REQ-1530");
      cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter description 'POAM test", () => {
      cy.drEnterDocumentDescription({ description: "POAM test" });
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Service' select option", () => {
      cy.poSelectOption({ optionName: "service" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter ServiceID", () => {
      cy.poEnterServiceID({ serviceId: "SRV234" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Description", () => {
      cy.poEnterDescription({ description: "Description for SRV234" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "190" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.poSaveDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.get("[data-cy^=\"fb-po-approvals-\"]").autocompleteSelect(USERS[3].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create document in 'Pending approval' state", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it(`Log out with '${USERS[2].name}'`, () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check for PO notification on dashboard", () => {
      SystemRequirement("REQ-2150", "REQ-3860", "REQ-2210");
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `${USERS[2].name}needs your approval forPO-00001` });
      cy.dashToggleMoreDetailsForListItemNumber({ listItemNumb: 0 });
      cy.get("div").contains("Total:USD 380.00")
        .should("exist");
    });

    it("Click on 'Reject' PO and enter confirmation password", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.dashToggleMoreDetailsForListItemNumber({ listItemNumb: 0 });
      cy.dashRejectApprovalForListItem({ listItem: `${USERS[2].name}needs your approval forPO-00001` });
    });

    it("Navigate to Doc List", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filters", () => {
      cy.filterClear();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select rejected PO from list", () => {
      cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify rejected PO status, should be 'Draft'", () => {
      SystemRequirement("REQ-0020", "REQ-0570", "REQ-1570");
      cy.poVerifyStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });
  });
});

