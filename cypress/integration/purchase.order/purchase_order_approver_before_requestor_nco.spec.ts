// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { receivingReleasedDate } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { SupplierExport } from "../../utils/constants/documentTypes/supplier";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let poPageDetailsId;
const apiCreatedCompany: any = {
  employees: [],
  documentTypes: [],
};
const ownerName = USERS[1].name;
const ownerEmail = USERS[1].email;
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const poFormTitle = "New Purchase Order Form";
const poFormDescription = "New Purchase Order Form Description";
const poDescription = "Test Purchase Order";
const COLUMN_HEADERS = [
  "PO #",
  "REVISION",
  "PO STATUS",
  "PO STATE",
  "SUPPLIER",
  "PART NUMBER",
  "AMOUNT",
  "REQUESTOR",
  "ORDER DATE",
];

context("Create company with JSON's and verify Purchase Order", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ownerEmail,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              NCORecord,
              SupplierExport,
              ClinicalProtocolDocType,
              PurchaseOrderDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ownerEmail);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: ownerEmail,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login admin user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create form for NCO document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${ncoFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: ncoFormName });
    });

    it("Enters description 'New NCO Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New NCO Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'New Company Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create NCO document from Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company description" });
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      cy.get("[name^=company-name-]").arrowType(newCompanyName, { force: true });
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr, { force: true });
    });

    it(`Enters company email '${ownerEmail}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(ownerEmail, { force: true });
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get(`[name*="approved-dam-json-is-used-"]`).check("Yes", { force: true });
    });

    it("Upload DOM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "po_dam.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get(`[name*="approved-page-details-json-is-used-"]`).check("Yes", { force: true });
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get(`[name*="approved-navigation-json-is-used-"]`).check("Yes", { force: true });
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.get(`[data-cy="albumMediaButton"]`).eq(0).arrowClick({ force: true });
      cy.pmUploadAttachment({ fileName: "image.jpg" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login admin user and intercept APIs", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: ownerEmail,
      });
    });

    it("Intercept APIs", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/company/mine" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            apiCreatedCompany.employees = response.employees;
            createdCompany = response;
            adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ownerEmail);
          }
        });
      }).as("response");

      cy.intercept({ method: "GET", pathname: "/api/v1/document_type" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            apiCreatedCompany.documentTypes = res.body;
          }
        });
      }).as("response1");

      cy.intercept({ method: "GET", pathname: "/api/v1/auth/sessionDetails" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            loginResponse = res.body;
          }
        });
      }).as("response2");

      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
      cy.wait("@response");
      cy.wait("@response1");
      cy.wait("@response2");
    });
  });

  context("PO Page Details API", () => {
    it("[API] Patch page details", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        qs: {
          category: "Purchase Order",
        },
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((response) => {
        if (response.body) {
          poPageDetailsId = response.body[0].id;
        }
      }).then(() => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
        cy.cmpUpdatePageDetails({
          id: poPageDetailsId,
          payload: {
            columns: [
              {
                label: COLUMN_HEADERS[0],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "document.docId",
                showOnAndroid: true,
              },
              {
                fn: "DOCUMENT_REVISION_VERSION",
                label: COLUMN_HEADERS[1],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.version",
                sourcePath: [
                  "revisionStage:revision",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_STATUS_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[2],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_status",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[3],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "displayStatus",
                showOnAndroid: true,
              },
              {
                fn: "SUPPLIER_NAME_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[4],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.supplier",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_PART_NUMBER_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[5],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_partNumber",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_AMOUNT_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[6],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_amount",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "USER_NAME",
                label: COLUMN_HEADERS[7],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.requestor-k740hxlb",
                sourcePath: [
                  "formInput.requestor-k740hxlb",
                  "formInput.po-requestor-autocomplete",
                ],
                showOnAndroid: true,
              },
              {
                fn: "DATE_FORMAT_MM_DD_YYYY",
                label: COLUMN_HEADERS[8],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.order-date-formatted",
                sourcePath: [
                  "formInput.ordered-k6mlhan7",
                  "formInput.po-order-date",
                ],
                showOnAndroid: true,
              },
            ],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("Log out user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: ownerEmail,
      });
      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
    });
  });

  context("Create Form PO Approval matrix", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'POAM Form'", () => {
      cy.drEnterDocumentTitle({ name: "POAM Form" });
    });

    it("Enters description 'POAM Form description'", () => {
      cy.drEnterDocumentDescription({ description: "POAM Form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'PO Approval Matrix' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "PO Approval Matrix" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create POAM document for PO", () => {
    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enters title 'POAM Document'", () => {
      cy.drEnterDocumentTitle({ name: "POAM Document" });
    });

    it("Enters description 'POAM Doc description'", () => {
      cy.drEnterDocumentDescription({ description: "POAM Doc description" });
    });

    it("Navigate to MatrixDetails tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Click on 'Add Item'", () => {
      cy.get(`div[name="po-levels-built-in"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
    });

    it("Enter Level Name value to be '1'", () => {
      cy.poAMEnterLevelName({ name: "1" });
    });

    it("Enter Limit value to be '5000'", () => {
      cy.poAMEnterLimit({ limit: "5000" });
    });

    it(`Select Users '${USERS[1].name}'`, () => {
      cy.poAMSelectUsers(USERS[1].name);
    });

    it("Add first POAM level", () => {
      cy.poAddPOButtonClick();
    });

    it("Click on 'Add Item'", () => {
      cy.get(`div[name="po-levels-built-in"] button[data-cy="fb-control-btn"]`).arrowClick({ force: true });
    });

    it("Enter Level Name value to be '2'", () => {
      cy.poAMEnterLevelName({ name: "2" });
    });

    it("Enter Limit value to be '25000'", () => {
      cy.poAMEnterLimit({ limit: "25000" });
    });

    it(`Select Users '${USERS[2].name}'`, () => {
      cy.poAMSelectUsers(USERS[2].name);
    });

    it("Add second POAM level", () => {
      cy.poAddPOButtonClick();
    });

    it("Click 'Save' document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
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
      cy.drSelectOutputDocumentType({ documentType: "Parts" });
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
      cy.ptSelectPartFormFromMultiSelect({ partForm: "Parts" });
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

  context("Create Part document 2 for PO", () => {
    it("Navigates to parts list", () => {
      cy.navigToParts();
    });

    it("Clicks on 'Add new part' button", () => {
      cy.ptClickCreateNewPart();
    });

    it("Clicks on 'PO Part' Form", () => {
      cy.ptSelectPartFormFromMultiSelect({ partForm: "Parts" });
    });

    it("Enters title 'New Part'", () => {
      cy.drEnterDocumentTitle({ name: "New Part 2" });
    });

    it("Enters description 'New Part description'", () => {
      cy.drEnterDocumentDescription({ description: "New Part description 2" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Create and release PO Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enter title ${poFormTitle}`, () => {
      cy.drEnterDocumentTitle({ name: poFormTitle });
    });

    it(`Enter description ${poFormDescription}`, () => {
      cy.drEnterDocumentDescription({ description: poFormDescription });
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

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create PO from created PO form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to Purchase Order list", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click create new PO", () => {
      cy.poClickCreatePO();
    });

    it(`Enter description ${poDescription}`, () => {
      cy.drEnterDocumentDescription({ description: poDescription });
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
    });

    it("Select Order Date", () => {
      cy.get("input[name^=ordered-]").parent().find("button").arrowClick();
      cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Click on 'Add Line Item' button", () => {
      cy.poAddNewFieldItem();
    });

    it("Select Part Number", () => {
      cy.poSelectPartNumber({ partNo: "PRT-00001" });
    });

    it("Enter Supplier Part Number", () => {
      cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Add Required Date", () => {
      cy.get(`[name="date"]`).next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "100" });
    });

    it("Check Tax option", () => {
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      cy.get(`[data-cy="form.builder.add.line.item"]`).click();
    });

    it("Click on service option", () => {
      cy.poSelectOption({ optionName: "service" });
    });

    it("Select service id", () => {
      cy.poEnterServiceID({ serviceId: "SRV123" });
    });

    it("Enter Description", () => {
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "2" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Add Required Date", () => {
      cy.get(`[name="date"]`).next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Enter Unit Price", () => {
      cy.poNumberOfUnits({ number: "10" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify approver, approve and release PO", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Add Approver '${ownerName}' for Approval`, () => {
      cy.poAddApproverOnApproverList({ approver: ownerName });
    });

    it(`Replace Requestor with '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick().wait(1000);
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify approvals is added only once in approval block", () => {
      it("Verify approvers", () => {
        cy.get("[data-tag-index='0']>span>div").should("have.length", 1);
      });
      cy.get("[data-tag-index='0']>span>div")
        .should("contain.text", "Giovanni Reynolds - enlil.testmail+cy1@gmail.com");
    });

    it("Navigate to Approval block and try to remove approver", () => {
      cy.get(".MuiAutocomplete-tag").should("have.class", "Mui-disabled");
      cy.get(`[name^="fb-po-approvals-"]`).eq(1).arrowClick({ force: true }).arrowType(`{backspace}`);
      cy.unClick();
    });

    it("Check if selected approver has approval signature right by his name", () => {
      cy.contains("PO Approval sig").should("exist");
    });

    it("Check approval icon if it's colored", () => {
      cy.poAMCheckApprovalIconIfItsRed();
    });

    context("Submit for Approval and verify PO can be released", () => {
      it("Click on Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it(`Verify document header details and status is in ${STATUS_TYPES_LABEL.PENDING_APPROVAL}`, () => {
        cy.verifyHeaderInfoContent({
          status: STATUS_TYPES_LABEL.PENDING_APPROVAL,
          title: "Purchase Orders",
          docId: "PO-00001",
          revision: "Rev 1",
        });
      });

      it("Approve PO", () => {
        cy.ebApprove();
      });
    });
  });

  context("Verify released PO and it's data", () => {
    it("Verify document header details", () => {
      cy.verifyHeaderInfoContent({
        title: "Purchase Orders",
        docId: "PO-00001",
        revision: "Rev 1",
      });
    });

    it(`Verify title is ${poDescription}`, () => {
      cy.get(`[data-cy="BaseWithhtml-editor"]`).should("contain.text", poDescription);
    });

    it(`Verify PO status is Open`, () => {
      cy.get("#mui-component-select-po-status-built-in").should("contain.text", "Open");
    });

    it(`Check the Requestor field contain ${ownerName} - ${ownerEmail}`, () => {
      cy.get(`[data-cy^="po-requestor-"]`).should("have.value", `${ownerName} - ${ownerEmail}`);
    });

    it(`Verify Order Date`, () => {
      cy.get(`[name^="ordered-"]`).should("not.have.value", "");
    });

    it(`Check the Approval field contain ${ownerName} - ${ownerEmail}`, () => {
      cy.get("div.Mui-disabled.MuiChip-deletable").should("contain", `${ownerName} - ${ownerEmail}`);
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Verify part number", () => {
      cy.get("[data-cy='partNumberDocId']").eq(0).should("have.text", "PRT-00001 - 1");
    });

    it("Verify supplier number", () => {
      cy.get("[data-cy='supplierPartNumber']").eq(0).should("have.text", "PRT-0004");
    });

    it("Verify description", () => {
      cy.get("[data-cy='description']>span>span>span").should("have.text", "New Part");
    });

    it("Verify ordered quantity", () => {
      cy.get("[data-cy='order']").eq(0).should("have.text", "5");
    });

    it("Verify Date Required", () => {
      cy.get("[data-cy='formattedDate']").eq(0)
        .should("have.text", receivingReleasedDate);
    });

    it("Verify Unit", () => {
      cy.get("[data-cy='unitPrice']").eq(0).should("have.text", "$100.00");
    });

    it("Verify tax rate", () => {
      cy.get("[name='po-items-built-in.taxRate']").should("have.text", "9.25");
    });

    it("Verify tax value", () => {
      cy.get("[name='po-items-built-in.tax']").should("have.text", "46.250000");
    });

    it("Verify Grand Total", () => {
      cy.get("[data-cy='poTotal']").should("have.text", "$566.25");
    });
  });

  context("Revise record and check flow", () => {
    it("Navigate to Purchase Order", () => {
      cy.navigToPurchaseOrder();
    });

    it("Navigate to Created Record", () => {
      cy.dlSelectFirstDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("revise record", () => {
      cy.get(`[data-cy="updateRecord"]`).arrowClick();
      cy.get(`[data-cy="DocumentRevisionForm-submit"]`).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Add Approver '${USERS[2].name}' for Approval`, () => {
      cy.poAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it(`Select '${USERS[2].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick({ force: true }).arrowType(`{backspace}`);
      cy.unClick();
      cy.get(`[data-cy^="po-requestor-"]`).arrowClick({ force: true }).wait(1000);
      cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick({ force: true });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify approvals is added only once in approval block", () => {
      it("Verify approvers", () => {
        cy.get("[data-tag-index='1']>span>div").should("have.length", 1);
      });
      cy.get("[data-tag-index='1']>span>div")
        .should("contain.text", "Harry Bartoletti - enlil.testmail+cy2@gmail.com");
    });

    it("Navigate to Approval block and try to remove approver", () => {
      cy.get(".MuiAutocomplete-tag").should("have.class", "Mui-disabled");
      cy.get(`[name^="fb-po-approvals-"]`).eq(1).arrowClick({ force: true }).arrowType(`{backspace}`);
      cy.unClick();
    });

    it("Check if selected approver has approval signature right by his name", () => {
      cy.contains("PO Approval sig").should("exist");
    });

    it("Check approval icon if it's colored", () => {
      cy.poAMCheckApprovalIconIfItsRed();
    });
  });

  context("Submit for Approval and verify PO can be released", () => {
    it("Click on Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it(`Verify document header details and status is in ${STATUS_TYPES_LABEL.PENDING_APPROVAL}`, () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.PENDING_APPROVAL,
        title: "Purchase Orders",
        docId: "PO-00001",
        revision: "Rev 2",
      });
    });

    it("Approve PO", () => {
      cy.ebApprove();
    });
  });

  context("Verify released PO and it's data", () => {
    it("Verify document header details", () => {
      cy.verifyHeaderInfoContent({
        title: "Purchase Orders",
        docId: "PO-00001",
        revision: "Rev 2",
      });
    });

    it(`Verify title is ${poDescription}`, () => {
      cy.get(`[data-cy="BaseWithhtml-editor"]`).should("contain.text", poDescription);
    });

    it(`Verify PO status is Open`, () => {
      cy.get("#mui-component-select-po-status-built-in").should("contain.text", "Open");
    });

    it(`Check the Requestor field contain ${USERS[2].name} - ${USERS[2].email}`, () => {
      cy.get(`[data-cy^="po-requestor-"]`).should("have.value", `${USERS[2].name} - ${USERS[2].email}`);
    });

    it(`Verify Order Date`, () => {
      cy.get(`[name^="ordered-"]`).should("not.have.value", "");
    });

    it(`Check the Approval field contain ${USERS[2].name} - ${USERS[2].email}`, () => {
      cy.get("div.Mui-disabled.MuiChip-deletable").should("contain", `${USERS[2].name} - ${USERS[2].email}`);
    });

    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Verify part number", () => {
      cy.get("[data-cy='partNumberDocId']").eq(0).should("have.text", "PRT-00001 - 1");
    });

    it("Verify supplier number", () => {
      cy.get("[data-cy='supplierPartNumber']").eq(0).should("have.text", "PRT-0004");
    });

    it("Verify description", () => {
      cy.get("[data-cy='description']>span>span>span").should("have.text", "New Part");
    });

    it("Verify ordered quantity", () => {
      cy.get("[data-cy='order']").eq(0).should("have.text", "5");
    });

    it("Verify Date Required", () => {
      cy.get("[data-cy='formattedDate']").eq(0)
        .should("have.text", receivingReleasedDate);
    });

    it("Verify Unit", () => {
      cy.get("[data-cy='unitPrice']").eq(0).should("have.text", "$100.00");
    });

    it("Verify tax rate", () => {
      cy.get("[name='po-items-built-in.taxRate']").should("have.text", "9.25");
    });

    it("Verify tax value", () => {
      cy.get("[name='po-items-built-in.tax']").should("have.text", "46.250000");
    });

    it("Verify Grand Total", () => {
      cy.get("[data-cy='poTotal']").should("have.text", "$566.25");
    });
  });
});

export { };

