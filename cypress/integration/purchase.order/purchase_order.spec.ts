import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let adminEmployee;
let docTypeId;

context("Create company via API and create Purchase Order Form document", () => {
  it("[API] Creates company", (done: any) => {
    SystemRequirement("REQ-0400");
    SystemRequirement("REQ-0440");
    cy.authApiLogin({
      email: CONFIG.SUPERADMIN_EMAIL,
      password: CONFIG.SUPERADMIN_PASSWORD,
    }).then((response) => {
      loginResponse = response;

      cy.cmpCreateCompany({
        specFilePath: __filename,
        payload: {
          companyAdminEmail: USERS[1].email,
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: USERS[5].email,
          maxRevisionStages: 3,
          numOfDocDigits: 5,
          remoteValidatorBundleName: "default",
          slackIntegrationEnabled: false,
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
        createdCompany.documentTypes.forEach((item: { documentTypeName: string; id: any }) => {
          if (item.documentTypeName === "Purchase Order")
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
      email: USERS[1].email,
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;

      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          navigation: [
            {
              label: "Dashboard",
              path: "/",
              type: "LINK",
            },
            {
              label: "Document Control",
              type: "MENU",
              menu: [
                {
                  label: "Document List",
                  path: "/document_revision",
                  type: "LINK",
                },
                {
                  label: "Approval Requests",
                  path: "/change_request",
                  type: "LINK",
                },
              ],
            },
            {
              label: "User Management",
              path: "/user_management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
              type: "LINK",
            },
            {
              label: "Group Management",
              path: "/group_management",
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
              type: "LINK",
            },
            {
              label: "Purchase Order",
              path: "/document_by_type/" + docTypeId,
              type: "LINK",
            },
          ],
        },
      }).then(() => {
        done();
      });
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
    cy.drClickCreateDocumentWithApiCall();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });
});

context("Create Part document for PO", () => {
  it("Navigates to document list", () => {
    cy.navigToDocumentList();
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
    cy.drClickCreateDocumentWithoutApiCall();
  });
});

context("Create Purchase Order document with Product option from Form document", () => {
  it("Click on 'Purchase Order' on sidebar", () => {
    cy.navigToPurchaseOrder();
  });

  it("Click on 'Create PO' button", () => {
    cy.poCreateNew();
  });

  it("Check for PO ID uniqueness - ID should be PO-00001", () => {
    SystemRequirement("REQ-1270");
    cy.poCheckStatus( "PO-00001" );
  });

  it("Click on 'Purchase Order' on sidebar", () => {
    cy.navigToPurchaseOrder();
  });

  it("Click on existing PO that was created before", () => {
    SystemRequirement("REQ-1370");
    SystemRequirement("REQ-1210");
    cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
  });

  it("Check status of PO should be Draft", () => {
    SystemRequirement("REQ-1280", "REQ-0020", "REQ-1610");
    cy.poCheckStatus("Draft" );
  });

  it("Uploads text.docx", () => {
    SystemRequirement("REQ-1350");
    cy.atchUploadAttachment({ fileName: "test.docx" });
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

  it.skip("Check currency options dropdown", () => {
    SystemRequirement("REQ-1320");
    cy.poCheckCurrency();
  });

  it("Select Currency 'USD'", () => {
    cy.poSelectCurrency({ currencyValue: "USD" });
  });

  it("Enter Shipping Cost", () => {
    cy.poShippingCost({ number: "2" });
  });

  it("Check Subtotal value", () => {
    SystemRequirement("REQ-1430");
    cy.poCheckAmount({ number: "$10.00" });
  });

  it("Check Tax value", () => {
    SystemRequirement("REQ-1450");
    cy.poCheckAmount({ number: "$0.65" });
  });

  it("Check Total value", () => {
    SystemRequirement("REQ-1440");
    cy.poCheckAmount({ number: "$30.65" });
  });

  it("Enter description 'New Purchase Order'", () => {
    SystemRequirement("REQ-1290");
    cy.drEnterDocumentDescription({ description: "New Purchase Order" });
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });
});

context("Create Purchase Order document with Service option from Form document", () => {
  it("Click on 'Purchase Order' on sidebar", () => {
    cy.navigToPurchaseOrder();
  });

  it("Click on 'Create PO' button", () => {
    cy.poCreateNew();
  });

  it("Check for PO ID uniqueness - ID should be PO-00002", () => {
    SystemRequirement("REQ-1270");
    cy.poCheckStatus( "PO-00002" );
  });

  it("Check status of PO should be Draft", () => {
    SystemRequirement("REQ-1280", "REQ-1610", "REQ-0020");
    cy.poCheckStatus( "Draft" );
  });

  it("Click on 'Add item' button", () => {
    cy.poAddNewFieldItem();
  });

  it("Click on 'Service' select option", () => {
    SystemRequirement("REQ-1390");
    SystemRequirement("REQ-1420");
    cy.poSelectOption({ optionName: "service" });
  });

  it("Enter ServiceID", () => {
    SystemRequirement("REQ-1420");
    cy.poEnterServiceID({ serviceId: "SRV123" });
  });

  it("Enter Description", () => {
    SystemRequirement("REQ-1420");
    cy.poEnterDescription({ description: "Description for SRV123" });
  });

  it("Enter Quantity Ordered", () => {
    SystemRequirement("REQ-1420");
    cy.poEnterQuantityOrdered({ quantity: "5" });
  });

  it("Select Units", () => {
    SystemRequirement("REQ-1420");
    cy.poSelectUnits();
  });

  it("Select GL code", () => {
    SystemRequirement("REQ-1420");
    cy.poSelectGLCode();
  });

  it("Enter number of Units", () => {
    SystemRequirement("REQ-1420");
    cy.poNumberOfUnits({ number: "2" });
  });

  it("Add Required Date", () => {
    SystemRequirement("REQ-1420");
    cy.poAddDateRequired();
  });

  it("Click on 'Add' inside PO dialog box", () => {
    cy.poAddPOButtonClick();
  });

  it.skip("Check currency options dropdown", () => {
    SystemRequirement("REQ-1320");
    cy.poCheckCurrency();
  });

  it("Select Currency 'EUR'", () => {
    cy.poSelectCurrency({ currencyValue: "EUR" });
  });

  it("Check for conversion message", () => {
    SystemRequirement("REQ-1330");
    cy.poCheckMessageForConversionSite();
  });

  it("Enter Shipping Cost", () => {
    cy.poShippingCost({ number: "2" });
  });

  it("Check Subtotal value", () => {
    SystemRequirement("REQ-1430");
    cy.poCheckAmount({ number: "€10.00" });
  });

  it("Check Total value", () => {
    SystemRequirement("REQ-1440");
    cy.poCheckAmount({ number: "€30.00" });
  });

  it("Check if total converted to dollars is shown", () => {
    SystemRequirement("REQ-1460");
    cy.poConvertedToDollarsMessage();
  });
});

context("Creates second line item and checks ID and if all line item details are optional", () => {
  it("Click on 'Add item' button to add another Product line item", () => {
    SystemRequirement("REQ-1390");
    cy.poAddNewFieldItem();
  });

  it("Click on 'Add' inside PO dialog box to check if all line item details are optional", () => {
    SystemRequirement("REQ-1400");
    cy.poAddPOButtonClick();
  });

  it("Check line item IDs if they are unique, should be '1' and '2'", () => {
    SystemRequirement("REQ-1360");
    SystemRequirement("REQ-1380");
    cy.poCheckForLineItemsAndTheirID({ firstId: "1", secondId: "2" });
  });

  it("Enter description 'New Purchase Order with Service item'", () => {
    SystemRequirement("REQ-1290");
    cy.poEnterDocumentDescription({ description: "New Purchase Order with Service item" });
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });
});

context("Creates second PO form document and checks if both documents are available when creating new PO", () => {
  it("Navigate to document list", () => {
    cy.navigToDocumentList();
  });

  it("Click on 'Create a document'", () => {
    cy.cmpClickCreateNewDocument();
  });

  it("Enter title 'New Purchase Order Form 2'", () => {
    cy.drEnterDocumentTitle({ name: "New Purchase Order Form 2" });
  });

  it("Enter description 'New Purchase Order Form description 2'", () => {
    cy.drEnterDocumentDescription({ description: "New Purchase Order Form description 2" });
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
    cy.drClickCreateDocumentWithApiCall();
  });

  it("Approve and release document", () => {
    cy.drApproveAndReleaseDocument();
  });

  it("Click on 'Purchase Order' on sidebar", () => {
    cy.navigToPurchaseOrder();
  });

  it("Click on 'Create PO' button", () => {
    cy.poClickCreatePO();
  });

  it("Check if two options are available when two forms with PO exist", () => {
    SystemRequirement("REQ-1260");
    cy.poCheckIfFormPopUpIsActive("New Purchase Order Form", "New Purchase Order Form 2");
  });

  it("Close dialog box", () => {
    cy.poCloseFormPopUpOnLandingPage();
  });
});

context("Check for Landing page columns and values", () => {
  it("Check if most recent added item is fist on list", () => {
    SystemRequirement("REQ-1180");
    cy.filterGetFirstValueFromList({ value: "PO-00002" });
  });

  it("Check for Landing page default columns", () => {
    SystemRequirement("REQ-1120");
    cy.filterCheckHeaderValues("PO #",
      "Revision", "PO Status",
      "Supplier",
      "Part Number",
      "Amount", "Requestor",
      "Issue Date");
  });
});

context("Test the filter inside PO", () => {
  it("Enter version number '1' inside filter", () => {
    cy.filterPOVersion({ version: "1" });
  });

  it("Check if item with right version is displayed", () => {
    cy.poCheckForSpecificPOItemValue({ itemValue: "1" });
  });

  it("Check if number of displayed filtered items is '2", () => {
    SystemRequirement("REQ-1200");
    cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "2" });
  });

  it("Clear filter", () => {
    SystemRequirement("REQ-1190");
    cy.filterClear();
  });

  it("Enter all fields to check if all filter fields are working", () => {
    SystemRequirement("REQ-1150");
    cy.filterPO({
      docId: "PO-00001", version: "2", poStatus: "WIP", supplier: "Test",
      partNumber: "PRT-0004", amount: "10", owner: "tester", issueDate: "10/10/2020",
    }).wait(2000);
  });

  it("Navigate to Document List", () => {
    cy.wait(1000).navigToDocumentList();
  });

  it("Navigate to Purchase Order", () => {
    cy.navigToPurchaseOrder();
  });

  it.skip("Check if all filter values persist after changing landing page", () => {
    SystemRequirement("REQ-1170");
    cy.filterCheckIfPOFilterPersists({
      docId: "PO-00001", version: "2", poStatus: "WIP", supplier: "Test",
      partNumber: "PRT-0004", amount: "10", owner: "tester", issueDate: "10/10/2020",
    });
  });

  it("Clear filter", () => {
    SystemRequirement("REQ-1190");
    cy.filterClear();
  });
});

export { };

