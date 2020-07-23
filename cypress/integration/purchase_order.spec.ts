/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../src/state/ducks/auth/types";
import { SystemRequirement } from "../utils/context/systemRequirement";

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

const runId = new Date().valueOf();
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
          companyAcronym: `T1${runId}`,
          companyAdminEmail: "enlil.testmail+cy1@gmail.com",
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
              label: "Document List",
              path: "/document_revision",
              type: "LINK"
            },
            {
              label: "Approval Request List",
              path: "/change_request",
              type: "LINK"
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
    cy.cmpNavigateToDocumentList();
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
    cy.drSelectOutputDocType({ documentType: "Purchase Order" });
  });

  it("Click 'Add New Field'", () => {
    cy.fbAddNewFieldOption();
  });

  it("Select 'Purchase Order' from list", () => {
    cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
  });

  it("Fill label field with 'New Purchase Order'", () => {
    cy.fbEnterPOLabelName({ name: "New Purchase Order" });
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

context("Create Part document for PO", () => {
  it("Navigates to document list", () => {
    cy.cmpNavigateToDocumentList();
  });

  it("Clicks on 'create a document' button", () => {
    cy.cmpClickCreateNewDocument();
  });

  it("Enters title 'New Part'", () => {
    cy.drEnterDocumentTitle({ name: "New Part" });
  });

  it("Enters description 'New Part description'", () => {
    cy.drEnterDocumentDescription({ description: "New Part description" });
  });

  it("Selects 'PO Part' document type from dropdown", () => {
    cy.drSelectDocumentType({ documentType: "PO Part" });
  });

  it("Click create document after filling document", () => {
    cy.drClickCreateDocument();
  });
});

context("Create Purchase Order document from Form document", () => {
  it("Click on 'Purchase Order' on sidebar", () => {
    cy.cmpNavigateToPurchaseOrder();
  });

  it("Click on 'Create PO' button", () => {
    cy.poCreateNew();
  });

  it("Click on 'Add item' button", () => {
    cy.poAddNewFieldItem();
  });

  it("Select Part Number", () => {
    SystemRequirement("REQ-1410");
    cy.poSelectPartNumber();
  });

  it("Enter Quantity Ordered", () => {
    SystemRequirement("REQ-1410");
    cy.poEnterQuantityOrdered({ quantity: "5" });
  });

  it("Select Units", () => {
    SystemRequirement("REQ-1410");
    cy.poSelectUnits();
  });

  it("Select GL code", () => {
    SystemRequirement("REQ-1410");
    cy.poSelectGLCode();
  });

  it("Enter Supplier Part Number", () => {
    SystemRequirement("REQ-1410");
    cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
  });

  it("Enter number of Units", () => {
    SystemRequirement("REQ-1410");
    cy.poNumberOfUnits({ number: "2" });
  });

  it("Add Required Date", () => {
    SystemRequirement("REQ-1410");
    cy.poAddDateRequired();
  });

  it("Check Tax box", () => {
    SystemRequirement("REQ-1450");
    cy.poSelectTaxCheckbox();
  });

  it("Click on 'Add' inside PO dialog box", () => {
    cy.poAddPOButtonClick();
  });

  it("Select Currency 'USD'", () => {
    cy.poSelectCurrency();
  });

  it("Enter Shipping Cost", () => {
    cy.poShippingCost({ number: "2" });
  });

  it("Check Subtotal value", () => {
    SystemRequirement("REQ-1430");
    cy.poCheckAmount({ number: "\$10.00" });
  });

  it("Check Tax value", () => {
    SystemRequirement("REQ-1450");
    cy.poCheckAmount({ number: "\$0.65" });
  });

  it("Check Total value", () => {
    SystemRequirement("REQ-1440");
    cy.poCheckAmount({ number: "\$12.65" });
  });

  it("Enter description 'New Purchase Order'", () => {
    SystemRequirement("REQ-1290");
    cy.poEnterDocumentDescription({ description: "New Purchase Order" });
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });
});


export { };
