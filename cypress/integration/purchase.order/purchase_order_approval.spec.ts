/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { SystemRequirement } from "../../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let docTypeId;

context("Create company via API and create Purchase Order Form document", () => {
  it("[API] Creates company", (done: any) => {
    cy.authApiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;

      cy.cmpCreateCompany({
        payload: {
          companyAdminEmail: "enlil.testmail+cy1@gmail.com",
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: "enlil.testmail+cy5@gmail.com",
          maxRevisionStages: 3,
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
        adminEmployee = createdCompany.employees.find((employee) => employee.user.name === "Company Admin");
        createdCompany.documentTypes.forEach((item: { documentTypeName: string; id: any }) => {
          if (item.documentTypeName == "Purchase Order")
          {
            docTypeId = item.id;
          }
        });
        done();
      });
    });
  });

  it("[API] Updates company", (done: any) => {
    cy.authApiLogin({
      email: "enlil.testmail+cy1@gmail.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;

      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          navigation:
          [
            {
              label: "Dashboard",
              path: "/",
              type: "LINK"
            },
            {
              label: "Document Control",
              type: "MENU",
              menu: [
                {
                  label: "Document List",
                  path: "/document_revision",
                  type: "LINK"
                },
                {
                  label: "Approval Requests",
                  path: "/change_request",
                  type: "LINK"
                },
              ],
            },
            {
              label: "User Management",
              path: "/user_management",
              restrictedToUsersWithTags:[
                GroupTag.USER_MANAGEMENT
              ],
              type: "LINK"
            },
            {
              label: "Group Management",
              path: "/group_management",
              restrictedToUsersWithTags:[
                GroupTag.GROUP_MANAGEMENT,
              ],
              type: "LINK"
            },
            {
              label: "Purchase Order",
              path: "/document_by_type/" + docTypeId,
              type: "LINK",
            }
          ],
        }).then(() => {
        done();
      });
    });
  });

  it("[API] Login second tester", (done: any) => {
    cy.authApiLogin({
      email: "enlil.testmail+cy2@gmail.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;
      multipleCompanies = loginResponse.employees.length > 1 ? true : false;
      done();
    });
  });

  it("Logs user in", () => {
    cy.authLogin({
      email: "enlil.testmail+cy2@gmail.com",
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

  it("Click on 'Purchase Order' outputdocument type", () => {
    cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
  });

  it("Click 'Add New Field'", () => {
    cy.fbAddNewFieldOption();
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

  it("Click create document after filling document", () => {
    cy.drClickCreateDocument();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
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
    cy.fbAddNewFieldOption();
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

  it("Click create document after filling document", () => {
    cy.drClickCreateDocument();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
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

  it("Select Users 'Second Tester'", () => {
    cy.poAMSelectUsers("Second Tester");
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

  it("Select Users 'Third Tester'", () => {
    cy.poAMSelectUsers("Third Tester");
  });

  it("Add second POAM level", () => {
    cy.poAddPOButtonClick();
  });

  it("Click 'Save' document", () => {
    cy.poSaveDocument();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });
});

context("Test the POAM when approving Purchase Order", () => {
  it("Click on 'Purchase Order' on sidebar", () => {
    cy.navigToPurchaseOrder();
  });

  it("Click on 'Create PO' button", () => {
    cy.poCreateNew().wait(1000);
  });

  it("Enter description 'POAM test", () => {
    SystemRequirement("REQ-1290");
    cy.poEnterDocumentDescription({ description: "POAM test" });
  });
  
  it("Enter Shipping Cost '210'", () => {
    cy.poShippingCost({ number: "21" });
  });

  it("Save document", () => {
    cy.poSaveDocument();
  });

  it("Click on 'Add Approver'", () => {
    cy.poAMCheckForApproval();
  });

  it("Check approval icon if it's gray", () => {
    cy.poAMCheckApprovalIconIfItsGray();
  });

  it("Try to approve document without approver when it contains POAM", () => {
    cy.poAMApproveButton();
  });

  it("Check if error message says that approver must be added", () => {
    SystemRequirement("REQ-1500");
    cy.poAMCheckForAlertMessage();
  });

  it("Select 'Thrid Tester' as approver", () => {
    cy.poAMSelectApprover("Third Tester");
  });

  it("Check if selected approver has approval signature right by his name", () => {
    SystemRequirement("REQ-1510");
    cy.poAMCheckIfApproverHasApprovalSign();
  });

  it("Check approval icon if it's green", () => {
    cy.poAMCheckApprovalIconIfItsGreen();
  });

  it("Create document in 'Pending for approval' state", () => {
    cy.poAMApproveButton();
  });

  it("Navigate to AR List", () => {
    cy.navigToApprovalRequestList();
  });

  it("Select last created AR from list", () => {
    cy.poClickOnSpecificPOFromList({ item: "AR00004" });
  });

  it("Withdraw PO that's set for approval", () => {
    SystemRequirement("REQ-1530");
    cy.arWithdrawSubmission();
  });

  it("Click on 'Purchase Order' on sidebar", () => {
    cy.navigToPurchaseOrder();
  });

  it("Click on 'Create PO' button", () => {
    cy.poCreateNew().wait(1000);
  });

  it("Enter description 'POAM test", () => {
    SystemRequirement("REQ-1290");
    cy.poEnterDocumentDescription({ description: "POAM test" });
  });
  
  it("Enter Shipping Cost '210'", () => {
    cy.poShippingCost({ number: "21" });
  });

  it("Save document", () => {
    cy.poSaveDocument();
  });

  it("Click on 'Add Approver'", () => {
    SystemRequirement("REQ-1490");
    cy.poAMCheckForApproval();
  });

  it("Select 'Thrid Tester' as approver", () => {
    cy.poAMSelectApprover("Third Tester");
  });

  it("Create document in 'Pending for approval' state", () => {
    SystemRequirement("REQ-1490");
    cy.poAMApproveButton();
  });

  it("Log out with 'Second Tester'", () => {
    cy.authLogout();
  });

  it("Log in with 'Third Tester'", () => {
    cy.authLogin({ 
      email: "enlil.testmail+cy3@gmail.com", 
      password: "Tester1!" });
  });

  it("Selects company", () => {
    cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
  });

  it("Click on 'Reject' AR and enter confirmation password", () => {
    SystemRequirement("REQ-1570");
    cy.poRejectAR({ password: "Tester1!" });
  });
  
  it("Click on 'Purchase Order' on sidebar", () => {
    cy.navigToPurchaseOrder();
  });

  it("Clear filters", () => {
    cy.filterClear();
  });

  it("Select rejected PO from list", () => {
    cy.poClickOnSpecificPOFromList({ item: "PO-00002" });
  });

  it("Verify rejected PO status, should be 'Draft'", () => {
    SystemRequirement("REQ-1570");
    cy.poVerifyStatus({ status: "Draft"});
  });
});

export { };

