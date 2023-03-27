// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { POPart } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let dateOfStepCompletion;
let dateOfStepCompletionOneMinuteLater;
let createdCompany;
let loginResponse;
let adminEmployee;
let supplierDocumentType;
let secondEmployee;
let group;
const documentSupplierRevisionName = "New suplier for PO";

context("PO test", () => {
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
            companyAdminEmail: USERS[11].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[12], USERS[13], USERS[14]],
            documentTypes: [
              POPart,
              PurchaseOrderDocType,
            ],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[12].email);
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[12].email,
      }).then((response) => {
        loginResponse = response;
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
        email: USERS[11].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[11], employeeId: adminEmployee.id });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order test" });
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

  context("Create Form Part document to create Part", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enters title 'New Part Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Part Form" });
    });

    it("Enters description 'New Part Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part Form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'PO Part' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "PO Part" });
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
    });
  });

  context("Create Part document for PO", () => {
    it("Navigates to parts list", () => {
      cy.navigToParts();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clicks on 'Add new part' button", () => {
      cy.ptClickCreateNewPart();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create Supplier form for PO", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
    });
  });

  context("Create Purchase Order document with Product option from Form document", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Create PO' button", () => {
      cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check for PO ID uniqueness - ID should be POT-00001", () => {
      SystemRequirement("REQ-1270");
      cy.poCheckStatus( "POT-00001" );
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on existing PO that was created before", () => {
      SystemRequirement("REQ-1370", "REQ-1210");
      cy.poClickOnSpecificPOFromList({ item: "POT-00001" });
    });

    it("Check status of PO should be Draft", () => {
      SystemRequirement( "REQ-0020", "REQ-1280", "REQ-1610");
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Uploads text.docx", () => {
      SystemRequirement("REQ-1350");
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add item' button", () => {
      SystemRequirement("REQ-1360");
      cy.poAddNewFieldItem();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      SystemRequirement("REQ-1400");
      cy.get("[data-cy=\"common.add\"]").click();
      cy.get("p[class*='MuiFormHelperText-root']>span")
        .contains("The Part Number field is required when Supplier Part Number is empty.");
      cy.get("p[class*='MuiFormHelperText-root']>span")
        .contains("The Supplier Part Number field is required when Part Number is empty.");
    });

    it("Select Part Number", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectPartNumber({ partNo: "PRT-00004 - 1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Quantity Ordered", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterQuantityOrdered({ quantity: "5" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectGLCode();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Supplier Part Number", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Unit Price", () => {
      SystemRequirement("REQ-1410");
      cy.poNumberOfUnits({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      SystemRequirement("REQ-1410");
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax box", () => {
      SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add item' button to add item without Part Number", () => {
      cy.poAddNewFieldItem();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Supplier Part Number", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Quantity Ordered", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterQuantityOrdered({ quantity: "10" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectGLCode();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Unit Price", () => {
      SystemRequirement("REQ-1410");
      cy.poNumberOfUnits({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      SystemRequirement("REQ-1410");
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Tax box", () => {
      SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check line items have unique IDs", () => {
      SystemRequirement("REQ-1380");
      cy.poCheckForLineItemsAndTheirID({ firstId: "1", secondId: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Check currency options dropdown", () => {
      SystemRequirement("REQ-1320");
      cy.poCheckCurrency();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Currency 'USD'", () => {
      cy.poSelectCurrency({ currencyValue: "USD" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
      cy.wait(3000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn on autosave", () => {
      cy.cmpTurnOnAutosave();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check Subtotal value", () => {
      SystemRequirement("REQ-1430");
      cy.poCheckAmount({ number: "$30.00" });
    });

    it("Check Tax value", () => {
      SystemRequirement("REQ-1450");
      cy.poCheckTax({ number: "2.775000" });
    });

    it("Check Total value", () => {
      cy.get("[data-cy=\"poTotal\"]").should("have.text", "$34.77");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });
  });

  context("Turn on autosave", () => {
    it("Turn on autosave", () => {
      cy.cmpTurnOnAutosave();
    });
  });

  context("Add Supplier to PO", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Create A New Supplier'", () => {
      SystemRequirement("REQ-4900");
      cy.get("[data-cy=\"form.builder.create.new.supplier\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Supplier Name 'Supplier'", () => {
      cy.get("[data-cy=\"name\"]").arrowType("Supplier");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Supplier Address/Phone as 'Supplier Description'", () => {
      cy.xpath("//div[@data-cy='description']/../div[2]").eq(1).arrowClick().wait(1000);
      cy.get("[data-cy='description'] div[contenteditable]").eq(1).clear();
      cy.get("[data-cy='description'] div[contenteditable]").eq(1).arrowType("Supplier Description");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("Select Document Type 'Supplier'", () => {
      cy.get("[name=\"document.documentType.id\"]").autocompleteSelect("Supplier");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create new supplier", () => {
      cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify autosave of Requestor change while PO status autosave is in process", () => {
    it("Select PO Status", () => {
      cy.poSelectPOStatus({ status: "Open" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("While autosaving, select requestor", () => {
      cy.get("[name^=po-requestor-]").click().autocompleteSelect(`${USERS[11].name} - ${USERS[11].email}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });
  });

  context("Verify autosave of Order Date change while Supplier autosave is in process", () => {
    it("Select Supplier", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect(`${documentSupplierRevisionName}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("While autosaving, select order date", () => {
      cy.get("[name^=\"ordered-\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Add description and Approve document", () => {
    it("Enter description 'New Purchase Order'", () => {
      SystemRequirement("REQ-1290");
      cy.drEnterDocumentDescription({ description: "New Purchase Order" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Check PO status contains 'Open', 'Closed', 'Cancelled'", () => {
      SystemRequirement("REQ-1470");
      cy.get("[id$=\"select-po-status-built-in\"]").eq(0).arrowClick();
      cy.get("ul>li[role=option]").should("contain", "Open")
        .and("contain", "Closed")
        .and("contain", "Cancelled");
      cy.unClick();
    });

    it("Select 'Open' for PO status", () => {
      cy.get("[id$=\"po-status-built-in\"]").eq(0).arrowClick({ force: true });
      cy.get("ul>li[role=option]").contains("Open").arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("delete line item and check for autosave", () => {
      cy.get("[data-cy=\"poItems\"]").eq(1).find("td").eq(0).click();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Submit for Approval' button", () => {
      SystemRequirement("REQ-1490");
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Approve' button", () => {
      dateOfStepCompletion = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
      dateOfStepCompletionOneMinuteLater = moment().add(1, "minutes")
        .tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
      cy.poApproveWithoutApi();
    });

    it("Check if approver ID and date time are recorded", () => {
      SystemRequirement("REQ-1540", "REQ-1550");
      cy.get("[name*='fb-po-approvals-']>div").eq(4).each(($el) => {
        let text = $el.text();
        text = text.replace(/\u00a0/g, " ");
        expect(text).to.be.oneOf([USERS[11].name + " | APPROVED | " + dateOfStepCompletion + USERS[11].email,
          USERS[11].name + " | APPROVED | " + dateOfStepCompletionOneMinuteLater + USERS[11].email]);
      });
    });

    it("Check if PO state is blank", () => {
      SystemRequirement("REQ-1560");
      cy.get("[data-cy=\"note-icon\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`[data-cy="revision"]`).eq(0).contains("Revision 1");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Revise PO and Close it", () => {
    it("Click on 'Revise PO'", () => {
      SystemRequirement("REQ-1600");
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Select 'Correct PO' revision stage", () => {
      cy.drChooseTypeOfRevisionChangeOption({ option: "Correct PO" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Close' for PO status", () => {
      SystemRequirement("REQ-1670");
      cy.poSelectPOStatus({ status: "Close" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an approver", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").scrollIntoView().arrowClick().wait(2000);
      cy.get(`[data-cy^="fb-po-approvals-"]`).autocompleteSelect(`${USERS[11].name}{enter}`, { force: true });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Submit for Approval' button", () => {
      SystemRequirement("REQ-1490");
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Approve' button", () => {
      cy.poApproveWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check PO status is 'Closed'", () => {
      SystemRequirement("REQ-1670");
      cy.get("[id$=\"select-po-status-built-in\"]").should("have.text", "Closed");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create Purchase Order document with Service option from Form document", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Create PO' button", () => {
      cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check for PO ID uniqueness - ID should be POT-00002", () => {
      SystemRequirement("REQ-1270");
      cy.poCheckStatus( "POT-00002" );
    });

    it("Check status of PO should be Draft", () => {
      SystemRequirement("REQ-0020", "REQ-1280", "REQ-1610");
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
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
      SystemRequirement("REQ-1390", "REQ-1420");
      cy.poSelectOption({ optionName: "service" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter ServiceID", () => {
      SystemRequirement("REQ-1420");
      cy.poEnterServiceID({ serviceId: "SRV123" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Description", () => {
      SystemRequirement("REQ-1420");
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      SystemRequirement("REQ-1420");
      cy.poEnterQuantityOrdered({ quantity: "5" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Units", () => {
      SystemRequirement("REQ-1420");
      cy.poSelectUnits();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select GL code", () => {
      SystemRequirement("REQ-1420");
      cy.poSelectGLCode();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter number of Units", () => {
      SystemRequirement("REQ-1420");
      cy.poNumberOfUnits({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Required Date", () => {
      SystemRequirement("REQ-1420");
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click on 'Service' select option", () => {
      SystemRequirement("REQ-1390", "REQ-1420");
      cy.poSelectOption({ optionName: "service" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.get("button[data-cy=\"fb-control-btn\"]").last().arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Supplier", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00004");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    // getting into ENC-13547 issue on save
    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Check currency options dropdown", () => {
      SystemRequirement("REQ-1320");
      cy.poCheckCurrency();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Currency 'EUR'", () => {
      cy.poSelectCurrency({ currencyValue: "EUR" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check for conversion message", () => {
      SystemRequirement("REQ-1330");
      cy.poCheckMessageForConversionSite();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn on autosave", () => {
      cy.cmpTurnOnAutosave();
    });

    it("Check Subtotal value", () => {
      SystemRequirement("REQ-1430");
      cy.poCheckAmount({ number: "€10.00" });
    });

    it("Check Total value", () => {
      SystemRequirement("REQ-1440");
      cy.unClick();
      cy.poCheckTotalAmount({ number: "€12.00" });
    });

    it("Check if total converted to dollars is shown", () => {
      SystemRequirement("REQ-1460");
      cy.poConvertedToDollarsMessage();
      cy.checkToastMessage({ exists: false });
    });

    // getting into ENC-13547 issue on save
    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Change description", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter description 'New Purchase Order with Service item'", () => {
      SystemRequirement("REQ-1290");
      cy.drEnterDocumentDescription({ description: "New Purchase Order with Service item" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Closed' for PO status", () => {
      SystemRequirement("REQ-1670");
      cy.poSelectPOStatus({ status: "Closed" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Add Required Date", () => {
      cy.get("[name^=\"ordered-\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });
  });

  context("Add approver and release document", () => {
    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.get("[data-cy^=\"fb-po-approvals-\"]").autocompleteSelect(USERS[11].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select '${USERS[11].name}' for Requestor`, () => {
      cy.get("[data-cy^=\"po-requestor-\"]").arrowClick();
      cy.get("[data-cy^=\"po-requestor-\"]").autocompleteSelect(USERS[11].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.drCheckProgressBarAndListLoaderShouldNotExists();
      cy.wait(5000);
    });

    it("Click 'Approve' button", () => {
      cy.poApproveWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check PO status is 'Closed'", () => {
      SystemRequirement("REQ-1670");
      cy.get("[id$=\"select-po-status-built-in\"]").should("have.text", "Closed");
    });
  });

  context("Revise PO and Cancel it", () => {
    it("Click on 'Revise PO'", () => {
      SystemRequirement("REQ-1600");
      cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Select 'Cancel PO' revision stage", () => {
      cy.drChooseTypeOfRevisionChangeOption({ option: "Cancel PO" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Select 'Cancelled' for PO status", () => {
      SystemRequirement("REQ-1660");
      cy.poSelectPOStatus({ status: "Cancelled" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.get("[data-cy^=\"fb-po-approvals-\"]").autocompleteSelect(USERS[11].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click 'Void' button", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.drCheckProgressBarAndListLoaderShouldNotExists();
      cy.wait(5000);
      cy.landingPageLoadingElementShouldNotExist();

      cy.get("[name=\"voidDescription\"]").arrowType("Voiding");
      cy.unClick();
      cy.get("[data-cy=\"fb-control-btn\"]").last().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Approve' button", () => {
      cy.poApproveWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check PO status is 'Cancelled'", () => {
      SystemRequirement("REQ-1660");
      cy.get("[id$=\"select-po-status-built-in\"]").should("have.text", "Cancelled");
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
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order test" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

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

    it("Check if two options are available when two forms with PO exist", () => {
      SystemRequirement("REQ-1260");
      cy.poCheckIfFormPopUpIsActive({
        type: "Purchase Order test",
        list: ["New Purchase Order Form", "New Purchase Order Form 2"],
      });
    });

    it("Close dialog box", () => {
      cy.unClick();
      cy.poCloseFormPopUpOnLandingPage();
    });
  });

  context("Check for Landing page columns and values", () => {
    it("Check if most recent added item is fist on list", () => {
      SystemRequirement("REQ-1180");
      cy.filterGetFirstValueFromList({ value: "POT-00002" });
    });

    it("Check for Landing page default columns", () => {
      SystemRequirement("REQ-1120");
      cy.filterCheckHeaderValues("PO #",
        "REVISION", "PO STATUS",
        "SUPPLIER",
        "PART NUMBER",
        "AMOUNT", "REQUESTOR",
        "ISSUE DATE");
    });
  });

  context("Test the filter inside PO", () => {
    it("Clear filter", () => {
      cy.filterClear();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter version number '1' inside filter", () => {
      cy.filterPOVersion({ version: "1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check if item with right version is displayed", () => {
      cy.poCheckForSpecificPOItemValue({ itemValue: "1.1" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clear filter", () => {
      SystemRequirement("REQ-1190");
      cy.filterClear();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check if number of displayed filtered items is '2'", () => {
      SystemRequirement("REQ-1200");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "2" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter all fields to check if all filter fields are working", () => {
      SystemRequirement("REQ-1150", "REQ-3870");
      cy.filterPO({
        docId: "POT-00001", version: "1.1", poStatus: "Closed", supplier: "New suplier for PO",
        partNumber: "PRT-00004 - 1", amount: "12.93", owner: USERS[11].name, issueDate: "N/A",
      });
    });

    it("Check if number of displayed filtered items is '1'", () => {
      SystemRequirement("REQ-1200");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "1" });
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Purchase Order", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check if all filter values persist after changing landing page", () => {
      SystemRequirement("REQ-1170");
      cy.filterCheckIfPOFilterPersists({
        docId: "POT-00001", version: "1.1", poStatus: "Closed", supplier: "New suplier for PO",
        partNumber: "PRT-00004 - 1", amount: "12.93", owner: USERS[11].name, issueDate: "N/A",
      });
    });

    it("Clear filter", () => {
      SystemRequirement("REQ-1190");
      cy.filterClear();
    });
  });
});
