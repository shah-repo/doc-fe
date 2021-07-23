// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let dateOfStepCompletion;
let dateOfStepCompletionOneMinuteLater;
let createdCompany;
let loginResponse;
let multipleCompanies;
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
              {
                documentTypeName: "Purchase Order test",
                documentTypeAcronym: "POT-",
                group: "PO",
                category: "Purchase Order",
                isQms: true,
                privateNumberPool: true,
                needsSignature: true,
                fieldsConfig: {
                  C: {
                    visible: false,
                    required: false,
                  },
                  D: {
                    label: "Description",
                    visible: true,
                    required: false,
                  },
                  E: {
                    visible: false,
                    required: true,
                  },
                  F: {
                    visible: false,
                    required: true,
                  },
                  G: {
                    visible: false,
                    required: false,
                  },
                  I: {
                    label: "Revise PO",
                    visible: true,
                  },
                  J: {
                    visible: false,
                  },
                  K: {
                    label: "Cancel PO",
                    visible: true,
                  },
                  L: {
                    label: "Correct PO",
                    visible: true,
                  },
                  M: {
                    label: "Type of Change",
                    visible: true,
                    required: true,
                  },
                  N: {
                    label: "Add Approvers",
                    visible: false,
                    required: false,
                  },
                  O: {
                    label: "PO History",
                    visible: true,
                  },
                  R: {
                    visible: false,
                  },
                  S: {
                    label: "Revise PO",
                    visible: true,
                  },
                  V: {
                    label: "Create PO",
                    visible: true,
                  },
                  A1: {
                    label: "Draft",
                    visible: true,
                  },
                  A2: {
                    label: "Void",
                    visible: true,
                  },
                  A3: {
                    label: "History",
                    visible: true,
                  },
                  A4: {
                    visible: false,
                  },
                  A5: {
                    label: "Pending Approval",
                    visible: true,
                  },
                  A6: {
                    label: "Draft",
                    visible: true,
                  },
                  P1: {
                    label: "Draft",
                    visible: true,
                  },
                  P2: {
                    label: "Void",
                    visible: true,
                  },
                  P3: {
                    label: "History",
                    visible: true,
                  },
                  P4: {
                    visible: false,
                  },
                  P5: {
                    label: "Pending Approval",
                    visible: true,
                  },
                  P6: {
                    label: "Draft",
                    visible: true,
                  },
                },
                schema: [
                  {
                    name: "po-status-built-in",
                    type: "select",
                    index: 0,
                    label: "PO Status",
                    options: [
                      {
                        text: "Open",
                        value: "Open",
                      },
                      {
                        text: "Closed",
                        value: "Closed",
                      },
                      {
                        text: "Cancelled",
                        value: "Cancelled",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "PO Status",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "po-supplier-built-in",
                    type: "supplier",
                    index: 1,
                    label: "Supplier ",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Supplier",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "po-items-built-in",
                    type: "purchaseorder",
                    index: 2,
                    label: "Purchase Order",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Purchase Order",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                ],
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
      cy.poCheckStatus("Draft" );
    });

    it("Uploads text.docx", () => {
      SystemRequirement("REQ-1350");
      cy.atchUploadAttachment({ fileName: "test.docx" });
    });

    it("Click on 'Add item' button", () => {
      SystemRequirement("REQ-1360");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.poAddNewFieldItem();
      });
    });

    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      SystemRequirement("REQ-1400");
      cy.poAddPOButtonClick();
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
      cy.poAddDateRequired();
    });

    it("Check Tax box", () => {
      SystemRequirement("REQ-1450");
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Click on 'Add item' button to add item without Part Number", () => {
      SystemRequirement("REQ-1360");
      cy.get("[data-cy=\"fb-control-btn\"]").last().click();
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

    it("Check line items have unique IDs", () => {
      SystemRequirement("REQ-1380");
      cy.poCheckForLineItemsAndTheirID({ firstId: "1", secondId: "2" });
    });

    it("Check currency options dropdown", () => {
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
      cy.poCheckAmount({ number: "$30.00" });
    });

    it("Check Tax value", () => {
      SystemRequirement("REQ-1450");
      cy.poCheckAmount({ number: "$1.95" });
    });

    it("Check Total value", () => {
      SystemRequirement("REQ-1440");
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
        SystemRequirement("REQ-1290");
        cy.drEnterDocumentDescription({ description: "New Purchase Order" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Check PO status contains 'Open', 'Closed', 'Cancelled'", () => {
        SystemRequirement("REQ-1470");
        cy.get("[id$=\"select-po-status-built-in\"]").eq(0).click();
        cy.get("ul[role=listbox]>li").should("contain", "Open")
          .and("contain", "Closed")
          .and("contain", "Cancelled");
        cy.unClick();
      });

      it("Select 'Open' for PO status", () => {
        cy.get("[id$=\"po-status-built-in\"]").eq(0).click();
        cy.get("ul[role=listbox]>li").contains("Open").click();
      });

      it("Save PO document", () => {
        SystemRequirement("REQ-1290");
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
        SystemRequirement("REQ-1490");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        });
      });

      it("Click 'Approve' button", () => {
        dateOfStepCompletion = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        dateOfStepCompletionOneMinuteLater = moment().add(1, "minutes")
          .tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
        cy.get("[data-cy=\"form.builder.request.approve\"]").click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove,
          CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks], () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });

      it("Check if approver ID and date time are recorded", () => {
        SystemRequirement("REQ-1540", "REQ-1550");
        cy.get("[name*='fb-po-approvals-']>div").eq(4).should("contain", USERS[1].name)
          .and("contain", "Approved")
          .and("contain", (dateOfStepCompletion || dateOfStepCompletionOneMinuteLater));
      });

      it("Check if PO state is blank", () => {
        SystemRequirement("REQ-1560");
        cy.get("[data-cy=\"DocumentRevisionList-item\"]:nth-child(1)>a:nth-child(1)>div")
          .should("have.text", ("Revision" + String.fromCharCode(160) + "1"));
      });
    });
  });

  context("Revise PO and Close it", () => {
    it("Click on 'Revise PO'", () => {
      SystemRequirement("REQ-1600");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[data-cy=\"updateRecord\"]").click();
      });
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
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevs], () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
        cy.checkToastMessage({ exists: false });
      });
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
      });
    });

    it("Click 'Submit for Approval' button", () => {
      SystemRequirement("REQ-1490");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
    });

    it("Click 'Approve' button", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove,
        CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
    });

    it("Check PO status is 'Closed'", () => {
      SystemRequirement("REQ-1670");
      cy.get("[id$=\"select-po-status-built-in\"]").should("have.text", "Closed");
    });
  });

  context("Create Purchase Order document with Service option from Form document", () => {
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
      cy.poCheckStatus( "Draft" );
    });

    it("Click on 'Add item' button", () => {
      SystemRequirement("REQ-1360");
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
      cy.poAddDateRequired();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Click on 'Add item' button", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").last().click();
    });

    it("Click on 'Service' select option", () => {
      SystemRequirement("REQ-1390", "REQ-1420");
      cy.poSelectOption({ optionName: "service" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.get("button[data-cy=\"fb-control-btn\"]").last().click({ force: true });
    });

    it("Select Supplier", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").type("SUP-00004{downarrow}{enter}");
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
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Change description and release document", () => {
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

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
      });
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
      });
    });

    it("Click 'Approve' button", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove,
        CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
    });

    it("Check PO status is 'Closed'", () => {
      SystemRequirement("REQ-1670");
      cy.get("[id$=\"select-po-status-built-in\"]").should("have.text", "Closed");
    });
  });

  context("Revise PO and Cancel it", () => {
    it("Click on 'Revise PO'", () => {
      SystemRequirement("REQ-1600");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev, CyRoutes.GetRequiredApproversDocRev], () => {
        cy.get("[data-cy=\"updateRecord\"]").click();
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
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocRevs], () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
        cy.checkToastMessage({ exists: false });
      });
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
      });
    });

    it("Click 'Void' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
        cy.get("[name=\"voidDescription\"]").type("Voiding");
        cy.get("[data-cy=\"fb-control-btn\"]").last().click();
      });
    });

    it("Click 'Approve' button", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove,
        CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
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

    it("Clear filter", () => {
      SystemRequirement("REQ-1190");
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocRevDocTypeCategory, () => {
        cy.filterClear();
      });
    });

    it("Check if number of displayed filtered items is '2'", () => {
      SystemRequirement("REQ-1200");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "2" });
    });

    it("Enter all fields to check if all filter fields are working", () => {
      SystemRequirement("REQ-1150", "REQ-3870");
      cy.filterPO({
        docId: "POT-00001", version: "1", poStatus: "Closed", supplier: "Supplier",
        partNumber: "PRT-00004 - 1", amount: "51.95", owner: USERS[1].name, issueDate: "N/A",
      }).wait(2000);
    });

    it("Check if number of displayed filtered items is '1'", () => {
      SystemRequirement("REQ-1200");
      cy.filterCheckNumberOfDisplayedRecords({ numberOfRecords: "1" });
    });

    it("Navigate to Document List", () => {
      cy.wait(1000).navigToDocumentList();
    });

    it("Navigate to Purchase Order", () => {
      cy.navigToPurchaseOrder();
    });

    it("Check if all filter values persist after changing landing page", () => {
      SystemRequirement("REQ-1170");
      cy.filterCheckIfPOFilterPersists({
        docId: "POT-00001", version: "1", poStatus: "Closed", supplier: "Supplier",
        partNumber: "PRT-00004 - 1", amount: "51.95", owner: USERS[1].name, issueDate: "N/A",
      });
    });

    it("Clear filter", () => {
      SystemRequirement("REQ-1190");
      cy.filterClear();
    });
  });
});

export { };

