// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let supplierDocumentType;
let secondEmployee;
let group;
const documentSupplierRevisionName = "New suplier for PO";

context("PO test", () => {
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
                category: "Parts",
                isQms: true,
              },
            ],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Creates suplier document for PO", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Supplier Document</p>",
            document: {
              docId: "SUP-00004",
              documentType: {
                id: supplierDocumentType[0].id,
              },
              securityList: {
                operators: [],
                securityEmployees: [],
                securityGroups: [
                  {
                    id: group.body[0].id,
                  },
                ],
              },
            },
            name: documentSupplierRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API] Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
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

    it("Click 'Add New Field'", () => {
      cy.fbAddNewFieldWhenHidden();
    });

    it("Add supplier form builder field", () => {
      cy.fbSelectCustomFieldToAdd({ name: "Supplier" });
    });

    it("Fill label field with 'Supplier'", () => {
      cy.fbEnterLabel({ label: "Supplier" });
    });

    it("Click 'Add' to finish adding new field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create Form Part document to create Part", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Part Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Part Form" });
    });

    it("Enters description 'New Part Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part Form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'PO Part' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "PO Part" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create Part document for PO", () => {
    it("Navigates to parts list", () => {
      cy.navigToParts();
    });

    it("Clicks on 'Add new part' button", () => {
      cy.ptClickCreateNewPart();
    });

    it("Clicks on 'PO Part' Form", () => {
      cy.ptSelectPartFormFromMultiSelect({ partForm: "PO Part" });
    });

    it("Enters title 'New Part'", () => {
      cy.drEnterDocumentTitle({ name: "New Part" });
    });

    it("Enters description 'New Part description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Create Supplier form for PO", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Supplier Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Supplier Form" });
    });

    it("Enters description 'New Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "New Supplier Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Suppliers' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Suppliers" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create Purchase Order document with Product option from Form document", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on 'Create PO' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.poClickCreatePO();
      });
    });

    it("Check for PO ID uniqueness - ID should be PO-00001", () => {
      // SystemRequirement("REQ-1270");
      cy.poCheckStatus( "PO-00001" );
    });

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on existing PO that was created before", () => {
      // SystemRequirement("REQ-1370");
      // SystemRequirement("REQ-1210");
      cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
    });

    it("Check status of PO should be Draft", () => {
      SystemRequirement( "REQ-0020");
      // SystemRequirement("REQ-1280", "REQ-1610");
      cy.poCheckStatus("Draft" );
    });

    it("Uploads text.docx", () => {
      // SystemRequirement("REQ-1350");
      cy.atchUploadAttachment({ fileName: "test.docx" });
    });

    it("Click on 'Add item' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.poAddNewFieldItem();
      });
    });

    it("Select Part Number", () => {
      // SystemRequirement("REQ-1410");
      cy.poSelectPartNumber({ partNo: "PRT-00004 - 1" });
    });

    it("Enter Quantity Ordered", () => {
      // SystemRequirement("REQ-1410");
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      // SystemRequirement("REQ-1410");
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      // SystemRequirement("REQ-1410");
      cy.poSelectGLCode();
    });

    it("Enter Supplier Part Number", () => {
      // SystemRequirement("REQ-1410");
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
    });

    it("Enter number of Units", () => {
      // SystemRequirement("REQ-1410");
      cy.poNumberOfUnits({ number: "2" });
    });

    it("Add Required Date", () => {
      // SystemRequirement("REQ-1410");
      cy.poAddDateRequired();
    });

    it("Check Tax box", () => {
      // SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Click on 'Add item' button to add item without Part Number", () => {
      cy.poAddNewFieldItem();
    });

    it("Enter Quantity Ordered", () => {
      // SystemRequirement("REQ-1410");
      cy.poEnterQuantityOrdered({ quantity: "10" });
    });

    it("Select Units", () => {
      // SystemRequirement("REQ-1410");
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      // SystemRequirement("REQ-1410");
      cy.poSelectGLCode();
    });

    it("Enter Supplier Part Number", () => {
      // SystemRequirement("REQ-1410");
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
    });

    it("Enter number of Units", () => {
      // SystemRequirement("REQ-1410");
      cy.poNumberOfUnits({ number: "2" });
    });

    it("Add Required Date", () => {
      // SystemRequirement("REQ-1410");
      cy.poAddDateRequired();
    });

    it("Check Tax box", () => {
      // SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Check currency options dropdown", () => {
      // SystemRequirement("REQ-1320");
      cy.poCheckCurrency();
    });

    it("Select Currency 'USD'", () => {
      cy.poSelectCurrency({ currencyValue: "USD" });
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
    });

    it("Check Subtotal value", () => {
      // SystemRequirement("REQ-1430");
      cy.poCheckAmount({ number: "$30.00" });
    });

    it("Check Tax value", () => {
      // SystemRequirement("REQ-1450");
      cy.poCheckAmount({ number: "$1.95" });
    });

    it("Check Total value", () => {
      // SystemRequirement("REQ-1440");
      cy.poCheckAmount({ number: "$51.95" });
    });

    context("Add Supplier to PO", () => {
      it("Click 'Create A New Supplier'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[data-cy=\"form.builder.create.new.supplier\"]").click();
        });
      });

      it("Enter Supplier Title 'Supplier'", () => {
        cy.get("[data-cy=\"name\"]").type("Supplier");
      });

      it("Enter Supplier Description 'Supplier Description'", () => {
        cy.ebEnterPartDescription({ description: "Supplier Description" });
        cy.checkToastMessage({ exists: false });
      });

      it("Select Document Type 'Supplier'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetSpecificDocumentType, () => {
          cy.get("[name=\"document.documentType.id\"]").type("{downarrow}{enter}");
        });
      });

      it("Create new supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev], () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });
    });

    context("Add description and Approve document", () => {
      it("Enter description 'New Purchase Order'", () => {
        // SystemRequirement("REQ-1290");
        cy.drEnterDocumentDescription({ description: "New Purchase Order" });
      });

      it("Save PO document", () => {
        // SystemRequirement("REQ-1290");
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PatchDocRev], () => {
            cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
          });
        cy.checkToastMessage({ exists: false });
        cy.wait(2000);
      });

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
        });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        });
      });

      it("Click 'Approve' button", () => {
        cy.get("[data-cy=\"form.builder.request.approve\"]").click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove], () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });
    });
  });

  context("Create Purchase Order document with Service option from Form document", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on 'Create PO' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.poClickCreatePO();
      });
    });

    it("Check for PO ID uniqueness - ID should be PO-00002", () => {
      // SystemRequirement("REQ-1270");
      cy.poCheckStatus( "PO-00002" );
    });

    it("Check status of PO should be Draft", () => {
      SystemRequirement("REQ-0020");
      // SystemRequirement("REQ-1280", "REQ-1610");
      cy.poCheckStatus( "Draft" );
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
    });

    it("Click on 'Service' select option", () => {
      // SystemRequirement("REQ-1390");
      // SystemRequirement("REQ-1420");
      cy.poSelectOption({ optionName: "service" });
    });

    it("Enter ServiceID", () => {
      // SystemRequirement("REQ-1420");
      cy.poEnterServiceID({ serviceId: "SRV123" });
    });

    it("Enter Description", () => {
      // SystemRequirement("REQ-1420");
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      // SystemRequirement("REQ-1420");
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      // SystemRequirement("REQ-1420");
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      // SystemRequirement("REQ-1420");
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      // SystemRequirement("REQ-1420");
      cy.poNumberOfUnits({ number: "2" });
    });

    it("Add Required Date", () => {
      // SystemRequirement("REQ-1420");
      cy.poAddDateRequired();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
    });

    it("Click on 'Service' select option", () => {
      // SystemRequirement("REQ-1390");
      // SystemRequirement("REQ-1420");
      cy.poSelectOption({ optionName: "service" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Select Supplier", () => {
      cy.get("[data-cy^=\"supplier-\"]").type("SUP-00004{downarrow}{enter}");
    });

    it("Check currency options dropdown", () => {
      // SystemRequirement("REQ-1320");
      cy.poCheckCurrency();
    });

    it("Select Currency 'EUR'", () => {
      cy.poSelectCurrency({ currencyValue: "EUR" });
    });

    it("Check for conversion message", () => {
      // SystemRequirement("REQ-1330");
      cy.poCheckMessageForConversionSite();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
    });

    it("Check Subtotal value", () => {
      // SystemRequirement("REQ-1430");
      cy.poCheckAmount({ number: "€10.00" });
    });

    it("Check Total value", () => {
      // SystemRequirement("REQ-1440");
      cy.poCheckAmount({ number: "€30.00" });
    });

    it("Check if total converted to dollars is shown", () => {
      // SystemRequirement("REQ-1460");
      cy.poConvertedToDollarsMessage();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Change description and release document", () => {
    it("Enter description 'New Purchase Order with Service item'", () => {
      // SystemRequirement("REQ-1290");
      cy.drEnterDocumentDescription({ description: "New Purchase Order with Service item" });
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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
      cy.fbClickAddNewHiddenBtn();
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

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on 'Create PO' button", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
        cy.poClickCreatePO();
      });
    });

    it("Check if two options are available when two forms with PO exist", () => {
      // SystemRequirement("REQ-1260");
      cy.poCheckIfFormPopUpIsActive("New Purchase Order Form", "New Purchase Order Form 2");
    });

    it("Close dialog box", () => {
      cy.poCloseFormPopUpOnLandingPage();
    });
  });

  context("Check for Landing page columns and values", () => {
    it("Check if most recent added item is fist on list", () => {
      // SystemRequirement("REQ-1180");
      cy.filterGetFirstValueFromList({ value: "PO-00002" });
    });

    it("Check for Landing page default columns", () => {
      // SystemRequirement("REQ-1120");
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
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
        cy.filterPOVersion({ version: "1" });
      });
    });

    it("Check if item with right version is displayed", () => {
      cy.poCheckForSpecificPOItemValue({ itemValue: "1" });
    });

    it("Check if number of displayed filtered items is '2", () => {
      // SystemRequirement("REQ-1200");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "2" });
    });

    it("Clear filter", () => {
      // SystemRequirement("REQ-1190");
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
        cy.filterClear();
      });
    });

    it("Enter all fields to check if all filter fields are working", () => {
      // SystemRequirement("REQ-1150");
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

    it("Check if all filter values persist after changing landing page", () => {
      // SystemRequirement("REQ-1170");
      cy.filterCheckIfPOFilterPersists({
        docId: "PO-00001", version: "2", poStatus: "WIP", supplier: "Test",
        partNumber: "PRT-0004", amount: "10", owner: "tester", issueDate: "10/10/2020",
      });
    });

    it("Clear filter", () => {
      // SystemRequirement("REQ-1190");
      cy.filterClear();
    });
  });
});

export { };

