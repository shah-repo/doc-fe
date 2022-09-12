// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
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
let createdRevisePoFormDocumentId;
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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              POPart,
              PurchaseOrderDocType,
            ],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
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
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
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
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order test" });
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
        cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      });
    });

    it("Check for PO ID uniqueness - ID should be POT-00001", () => {
      SystemRequirement("REQ-1270");
      cy.poCheckStatus( "POT-00001" );
    });

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
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
    });

    it("Uploads text.docx", () => {
      SystemRequirement("REQ-1350");
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.progressBarShouldAppear();
    });

    it("Click on 'Add item' button", () => {
      SystemRequirement("REQ-1360");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.poAddNewFieldItem();
      });
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
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.wait(2000);
    });

    it("Check Tax box", () => {
      SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.poAddPOButtonClick();
      });
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.wait(2000);
    });

    it("Click on 'Add item' button to add item without Part Number", () => {
      cy.poAddNewFieldItem();
      cy.wait(2000);
    });

    it("Enter Supplier Part Number", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
    });

    it("Enter Quantity Ordered", () => {
      SystemRequirement("REQ-1410");
      cy.poEnterQuantityOrdered({ quantity: "10" });
    });

    it("Select Units", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      SystemRequirement("REQ-1410");
      cy.poNumberOfUnits({ number: "2" });
    });

    it("Add Required Date", () => {
      SystemRequirement("REQ-1410");
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.wait(2000);
    });

    it("Check Tax box", () => {
      SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.poAddPOButtonClick();
      });
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Check line items have unique IDs", () => {
      SystemRequirement("REQ-1380");
      cy.poCheckForLineItemsAndTheirID({ firstId: "1", secondId: "2" });
    });

    it("Check currency options dropdown", () => {
      SystemRequirement("REQ-1320");
      cy.poCheckCurrency();
    });

    it("Select Currency 'USD'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.poSelectCurrency({ currencyValue: "USD" });
      });
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
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
      SystemRequirement("REQ-1440");
      cy.unClick();
      cy.get("[data-cy=\"poTotal\"]").should("have.text", "$52.77");
    });

    context("Add Supplier to PO", () => {
      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'Create A New Supplier'", () => {
        SystemRequirement("REQ-4900");
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[data-cy=\"form.builder.create.new.supplier\"]").arrowClick();
        });
      });

      it("Enter Supplier Title 'Supplier'", () => {
        cy.get("[data-cy=\"name\"]").arrowType("Supplier");
      });

      it("Enter Supplier Description 'Supplier Description'", () => {
        cy.xpath("//div[@data-cy=\"description\"]/../div[2]").eq(1).arrowClick();
        cy.get("[data-cy=\"description\"]>div>div>div>div>div[contenteditable]").eq(1).clear()
          .arrowType("Supplier Description").wait(500);
        cy.unClick();
        cy.checkToastMessage({ exists: false });
      });

      it("Select Document Type 'Supplier'", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetSpecificDocumentType, () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[name=\"document.documentType.id\"]").autocompleteSelect("Supplier");
        });
      });

      it("Create new supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev, CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"common.confirm\"]").arrowClick();
        });
      });
    });

    context("Verify autosave of Requestor change while PO status autosave is in process", () => {
      it("Select PO Status", () => {
        cy.get("[id$=\"po-status-built-in\"]").eq(0).arrowClick({ force: true });
        cy.get("ul>li[role=option]").contains("Open").arrowClick({ force: true });
        cy.unClick();
      });

      it("While autosaving, select requestor", () => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
          req.reply((res) => {
            res.setDelay(10000);
            res.setThrottle(10);
          });
        }).as("response");

        cy.get("[data-cy^=\"po-requestor-\"]").autocompleteSelect(`${USERS[1].name}`);
      });
    });

    context("Verify autosave of Order Date change while Supplier autosave is in process", () => {
      it("Clear selected Supplier", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"po-supplier-built-in\"]").parent()
            .find("button").eq(0).arrowClick({ force: true });
        });
      });

      it("Select Supplier", () => {
        cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect(`${documentSupplierRevisionName}`);
        cy.unClick();
      });

      it("While autosaving, select order date", () => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/document_revisions/*" }, (req) => {
          req.reply((res) => {
            res.setDelay(10000);
            res.setThrottle(10);
          });
        }).as("response");

        cy.get("[name^=\"ordered-\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
        cy.wait("@response", { responseTimeout: 60 * 1000 });
      });
    });

    context("Add description and Approve document", () => {
      it("Enter description 'New Purchase Order'", () => {
        SystemRequirement("REQ-1290");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.drEnterDocumentDescription({ description: "New Purchase Order" });
        });
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
      });

      it("navigate to Line Items", () => {
        cy.drSelectLineItems();
      });

      it("delete line item and check for autosave", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"poItems\"]").eq(1).find("td").eq(0).click();
        });
      });

      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Click 'Submit for Approval' button", () => {
        SystemRequirement("REQ-1490");
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'Approve' button", () => {
        dateOfStepCompletion = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfStepCompletionOneMinuteLater = moment().add(1, "minutes")
          .tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        cy.ebApprove();
      });

      it("Check if approver ID and date time are recorded", () => {
        SystemRequirement("REQ-1540", "REQ-1550");
        cy.get("[name*='fb-po-approvals-']>div").eq(4).each(($el) => {
          let text = $el.text();
          text = text.replace(/\u00a0/g, " ");
          expect(text).to.be.oneOf([USERS[1].name + " | APPROVED | " + dateOfStepCompletion + USERS[1].email,
            USERS[1].name + " | APPROVED | " + dateOfStepCompletionOneMinuteLater + USERS[1].email]);
        });
      });

      it("Check if PO state is blank", () => {
        cy.get("[data-cy=\"note-icon\"]").arrowClick();
        cy.get(" [data-cy^=\"revision\"]").eq(0)
          .then(($el) => {
            const text = $el.text();
            expect(text.replace(/\u00a0/g, " ")).to.contain("Revision 1");
          });
      });
    });
  });

  context("Revise PO and Close it", () => {
    it("Click on 'Revise PO'", () => {
      SystemRequirement("REQ-1600");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select 'Correct PO' revision stage", () => {
      cy.drChooseTypeOfRevisionChangeOption({ option: "Correct PO" });
    });

    it("Select 'Close' for PO status", () => {
      SystemRequirement("REQ-1670");
      cy.poSelectPOStatus({ status: "Close" });
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.url().then((url: any) => {
        createdRevisePoFormDocumentId = url.split("/").pop();
      });
    });

    it("Reload PO", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdRevisePoFormDocumentId}/version/${docIdFromUrl}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.visit(newPMUrl);
        });
      });
    });

    it("Click 'Submit for Approval' button", () => {
      SystemRequirement("REQ-1490");
      cy.pmSubmitForApproval();
    });

    it("Click 'Approve' button", () => {
      cy.ebApprove();
    });

    it("Check PO status is 'Closed'", () => {
      SystemRequirement("REQ-1670");
      cy.get("[id$=\"select-po-status-built-in\"]").should("have.text", "Closed");
    });
  });

  context("Create Purchase Order document with Service option from Form document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on 'Create PO' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      });
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
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
    });

    it("Click on 'Service' select option", () => {
      SystemRequirement("REQ-1390", "REQ-1420");
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
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.wait(2000);
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Click on 'Add item' button", () => {
      cy.poAddNewFieldItem();
    });

    it("Click on 'Service' select option", () => {
      SystemRequirement("REQ-1390", "REQ-1420");
      cy.poSelectOption({ optionName: "service" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.get("button[data-cy=\"fb-control-btn\"]").last().arrowClick({ force: true });
      cy.wait(2000);
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.wait(2000);
    });

    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Supplier", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00004");
      cy.wait(2000);
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.wait(2000);
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Check currency options dropdown", () => {
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
      cy.unClick();
      cy.wait(2000);
    });

    it("Check Subtotal value", () => {
      SystemRequirement("REQ-1430");
      cy.poCheckAmount({ number: "€10.00" });
    });

    it("Check Total value", () => {
      SystemRequirement("REQ-1440");
      cy.unClick();
      cy.poCheckTotalAmount({ number: "€30.00" });
    });

    it("Check if total converted to dollars is shown", () => {
      SystemRequirement("REQ-1460");
      cy.poConvertedToDollarsMessage();
      cy.checkToastMessage({ exists: false });
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  });

  context("Change description and release document", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
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
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.wait(2000);
    });

    it("Add Required Date", () => {
      cy.get("[name^=\"ordered-\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.wait(2000);
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy^=\"po-requestor-\"]").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Approve' button", () => {
      cy.ebApprove();
    });

    it("Check PO status is 'Closed'", () => {
      SystemRequirement("REQ-1670");
      cy.get("[id$=\"select-po-status-built-in\"]").should("have.text", "Closed");
    });
  });

  context("Revise PO and Cancel it", () => {
    it("Click on 'Revise PO'", () => {
      SystemRequirement("REQ-1600");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions, CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[data-cy=\"updateRecord\"]").arrowClick();
      });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select 'Cancel PO' revision stage", () => {
      cy.drChooseTypeOfRevisionChangeOption({ option: "Cancel PO" });
    });

    it("Select 'Cancelled' for PO status", () => {
      SystemRequirement("REQ-1660");
      cy.poSelectPOStatus({ status: "Cancelled" });
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.url().then((url: any) => {
        createdRevisePoFormDocumentId = url.split("/").pop();
      });
    });

    it("Reload PO", () => {
      cy.url().then((url: any) => {
        const docIdFromUrl = url.split("/").pop();
        // eslint-disable-next-line max-len
        const newPMUrl = `${CONFIG.FE_URL}/document_revision/${createdRevisePoFormDocumentId}/version/${docIdFromUrl}`;
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails,
          CyRoutes.GetAvailableApprovers,
          CyRoutes.GetAutocompleteOptions], () => {
          cy.visit(newPMUrl);
        });
      });
    });

    it("Click 'Void' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        cy.get("[name=\"voidDescription\"]").arrowType("Voiding");
        cy.get("[data-cy=\"fb-control-btn\"]").last().arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Approve' button", () => {
      cy.ebApprove();
    });

    it("Check PO status is 'Cancelled'", () => {
      SystemRequirement("REQ-1660");
      cy.get("[id$=\"select-po-status-built-in\"]").should("have.text", "Cancelled");
    });
  });


  context("Creates second PO form document and checks if both documents are available when creating new PO", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

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
    });

    it("Enter version number '1' inside filter", () => {
      cy.filterPOVersion({ version: "1" });
    });

    it("Check if item with right version is displayed", () => {
      cy.poCheckForSpecificPOItemValue({ itemValue: "1.1" });
    });

    it("Clear filter", () => {
      SystemRequirement("REQ-1190");
      cy.filterClear();
    });

    it("Check if number of displayed filtered items is '2'", () => {
      SystemRequirement("REQ-1200");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "2" });
    });

    it("Enter all fields to check if all filter fields are working", () => {
      SystemRequirement("REQ-1150", "REQ-3870");
      cy.filterPO({
        docId: "POT-00001", version: "1.1", poStatus: "Closed", supplier: "New suplier for PO",
        partNumber: "PRT-00004 - 1", amount: "10.93", owner: USERS[1].name, issueDate: "N/A",
      });
    });

    it("Check if number of displayed filtered items is '1'", () => {
      SystemRequirement("REQ-1200");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "1" });
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Navigate to Purchase Order", () => {
      cy.navigToPurchaseOrder();
    });

    it("Check if all filter values persist after changing landing page", () => {
      SystemRequirement("REQ-1170");
      cy.filterCheckIfPOFilterPersists({
        docId: "POT-00001", version: "1.1", poStatus: "Closed", supplier: "New suplier for PO",
        partNumber: "PRT-00004 - 1", amount: "10.93", owner: USERS[1].name, issueDate: "N/A",
      });
    });

    it("Clear filter", () => {
      SystemRequirement("REQ-1190");
      cy.filterClear();
    });
  });
});
