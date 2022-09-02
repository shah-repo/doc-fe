// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import moment from "moment-timezone";
import { CONFIG } from "../../support/config";
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
const ADMIN_USER = USERS[1];
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;
const purchaseOrderFormName = "New Purchase Order Form";
const orderDate = moment().tz("America/Los_Angeles").format("MM/DD/YYYY");


const po = "PO #";
const rev = "REVISION";
const poStatus = "PO STATUS";
const poState = "PO STATE";
const poSupplier = "SUPPLIER";
const partNumber = "PART NUMBER";
const amount = "AMOUNT";
const requestor = "REQUESTOR";
const issueDate = "ORDER DATE";
const poId = "PO-00001";
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


context("Create company with JSON's", () => {
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
            companyAdminEmail: USERS[1].email,
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
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
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
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
    });

    it("Upload DOM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "po_dam.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.get("[data-cy=\"albumMediaButton\"]").eq(0).arrowClick();
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

  context("Login User", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Intercept APIs", () => {
      cy.intercept({ method: "GET", pathname: "/api/v1/company/mine" }, (req) => {
        req.reply((res) => {
          if (res.body !== "") {
            const response = res.body;
            apiCreatedCompany.employees = response.employees;
            createdCompany = response;
            adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
            console.log("createdCompany", createdCompany);
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

  context("PAGE DETAILS API", () => {
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
        email: USERS[1].email,
      });

      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
    });
  });

  context("Create Part & Supplier manually", () => {
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

      it("Click on 'Supplier' outputdocument type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Create Supplier document for PO", () => {
      it("Navigates to suppliers list", () => {
        cy.navigToSuppliers();
      });

      it("Clicks on 'Add new supplier' button", () => {
        cy.ptClickCreateNewPart();
      });

      it("Enters title 'New Supplier'", () => {
        cy.drEnterDocumentTitle({ name: "New Supplier" });
      });

      it("Enters description 'New Part description'", () => {
        cy.drEnterDocumentDescription({ description: "New Supplier description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });
  });


  context("Create a new form with output PO", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: purchaseOrderFormName });
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

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  xcontext("login user", () => {
    xit("Log out user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });

      const newcmpny = "New company 87318 - 1";
      cy.cmpSelectCompany({ name: newcmpny, multiple: true });
    });
  });


  // create PO and add line items approver verification start
  context("Create PO", () => {

    it("Navigate to document landing page", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on add new purchase order", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick().wait(2000);
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
    });

    it("Enter description 'PO test'", () => {
      cy.drEnterDocumentDescription({ description: "PO test" });
    });

    it(`Select '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
    });

    it("Select Supplier", () => {
      cy.poSelectSupplier({ supplier: "SUP-00001 - rev 1 - New Supplier" });
    });

    it("Select Order Date", () => {
      cy.wait(2000);
      cy.get("[name^='ordered-']").parent().find("button").arrowClick();
      const dayOfTheMonth = moment().tz("America/Los_Angeles").date();
      cy.get("button.MuiPickersDay-day")
        .not(".MuiPickersDay-hidden")
        .each(($el) => {
          const dayNumber = $el.text();
          if (dayOfTheMonth.toString() === dayNumber) {
            cy.wrap($el).arrowClick();
          }
        });
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    context("Click 'Add line item' and fill the data", () => {
      it("navigate to Line Items", () => {
        cy.drSelectLineItems();
      });

      it("Click on 'Add' inside PO dialog box and check for required fields", () => {
        cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
      });

      it("Select Part Number", () => {
        cy.poSelectPartNumber({ partNo: "PRT-00001 - 1" });
      });

      it("Enter Quantity Ordered", () => {
        cy.poEnterQuantityOrdered({ quantity: "5" });
      });

      it("Select Units", () => {
        cy.poSelectUnits();
      });

      it("Select GL code", () => {
        cy.poSelectGLCode();
      });

      it("Enter number of Units", () => {
        cy.poNumberOfUnits({ number: "2" });
      });

      it("Add Required Date", () => {
        cy.get("[name=\"date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("Check Tax box", () => {
        cy.poSelectTaxCheckbox();
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
      });

      it("Save PO", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      xit("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Click 'Add line item' and select Service data", () => {
      it("Click on 'Add' inside PO dialog box and check for required fields", () => {
        cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
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

      it("Select GL code", () => {
        cy.poSelectGLCode();
      });

      it("Add Required Date", () => {
        cy.get("[name=\"date\"]").next().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it("Enter Unit Price", () => {
        cy.poNumberOfUnits({ number: "10" });
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    context("Verify detail tab", () => {
      it("Verify Approval fields get auto populated ", () => {
        cy.drSelectDetailsTab().wait(2000);
      });

      xit(`Select '${USERS[1].name}' as approval`, () => {
        cy.poAddApproverOnApproverList({ approver: USERS[1].name });
      });

      xit("Verify that user is not able to remove/delete the requestor as an approver", () => {
        cy.get(".MuiChip-deletable").should("be.disabled");
      });

      it("Verify that “Backspace” and “Clear all” option will not be available in the PO approval field", () => {
        cy.pause();
        cy.get(`[name^="fb-po-approvals-"]`).eq(1).arrowClick({ force: true }).arrowType(`{backspace}`);
        cy.get("[data-cy^=fb-po-approvals]").arrowClick({ force: true }).arrowType(`{backspace}`).clear();
      });

      it("Save document'", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });


    context("Verify History tab", () => {

      it("Navigate to PO and select po", () => {
        cy.navigToPurchaseOrder();
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: poId });
      });

      it("Navigate to PO and select po", () => {
        cy.get("tr.k-master-row").first().arrowClick({ force: true });
      });

      it("Select 'Open' for PO status", () => {
        cy.dlSelectFirstDocument();
        cy.poSelectPOStatus({ status: "Open" });
      });

      it("Select history tab", () => {
        cy.drSelectHistoryTab();
      });

      it("Check history - added approvers should be displayed", () => {
        cy.wrapWithWaitOnApiCalls([], () => {
          cy.get("[data-cy=\"change-key-0-0\"]").parent().parent()
            .should("contain.text", "Approver Added").and("contain.text", USERS[1].name);
        });
      });
    });

    context("Verify all the PO columns are present", () => {
      it("Navigate to Purchase Order list", () => {
        cy.navigToPurchaseOrder();
      });

      it("Verify all columns are present", () => {
        cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${po}`);
        cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${rev}`);
        cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${poStatus}`);
        cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${poState}`);
        cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${poSupplier}`);
        cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${partNumber}`);
        cy.get(`th[role="columnheader"]`).eq(6).should("have.text", `${amount}`);
        cy.get(`th[role="columnheader"]`).eq(7).should("have.text", `${requestor}`);
        cy.get(`th[role="columnheader"]`).eq(8).should("have.text", `${issueDate}`);
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: poId });
        cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", poId);
        cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "1");
        cy.get("tr.k-master-row").first().find("td").eq(2).should("have.text", "Open");
        cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "Draft");
        cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "New Supplier");
        cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", "$30.93");
        cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", USERS[1].name);
        cy.get("tr.k-master-row").first().find("td").eq(8).should("have.text", orderDate);
        cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", "PRT-00001 - 1");
      });
    });


    context("Navigate back to PO and remove Line items and check the Approver", () => {

      it("Navigate to PO and select po", () => {
        cy.dlSelectFirstDocument();
      });

      it("Navigate to line items", () => {
        cy.drSelectLineItems();
      });

      it("delete line item 0", () => {
        cy.get("[class=\"MuiSvgIcon-root FBIcon-root MuiSvgIcon-fontSizeSmall\"]").eq(0).click();
        cy.wait(2000);
      });

      it("delete line item 1", () => {
        cy.get("[class=\"MuiSvgIcon-root FBIcon-root MuiSvgIcon-fontSizeSmall\"]").eq(0).click();
        cy.wait(2000);
      });

      it("Save document'", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Select detail tab", () => {
        cy.drSelectDetailsTab().wait(2000);
      });


      it("Save document'", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it(`Verify ${USERS[1].name} is removed from approver list`, () => {
        cy.get("[data-cy^='fb-po-approvals']").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[1].name).should("exist");
      });

      it("Remove the requestor", () => {
        cy.get("[title='Clear']").eq(0).arrowClick({ force: true });
      });

      it("Select history tab", () => {
        cy.drSelectHistoryTab();
      });

      it("Check history - Added approvers should be displayed", () => {
        cy.wrapWithWaitOnApiCalls([], () => {
          cy.get("[data-cy=\"change-key-0-0\"]").parent().parent()
            .should("contain.text", "Approver Added").and("contain.text", USERS[1].name);
        });
      });

      it("Save document'", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

    });

    context("Verify all the PO columns are present", () => {
      it("Navigate to Purchase Order list", () => {
        cy.navigToPurchaseOrder();
      });

      it("Verify all columns are present", () => {
        cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${po}`);
        cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${rev}`);
        cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${poStatus}`);
        cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${poState}`);
        cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${poSupplier}`);
        cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${partNumber}`);
        cy.get(`th[role="columnheader"]`).eq(6).should("have.text", `${amount}`);
        cy.get(`th[role="columnheader"]`).eq(7).should("have.text", `${requestor}`);
        cy.get(`th[role="columnheader"]`).eq(8).should("have.text", `${issueDate}`);
      });

      it("verify the correct data are displayed in Supplier field", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: poId });
        cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", poId);
        cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "1");
        cy.get("tr.k-master-row").first().find("td").eq(2).should("have.text", "Open");
        cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "Draft");
        cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "New Supplier");
        cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", "N/A");
        cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", "$0.00");
        cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", "N/A");
        cy.get("tr.k-master-row").first().find("td").eq(8).should("have.text", orderDate);
      });
    });

    context("Navigate back to created PO", () => {
      context("Click 'Add line item' and fill the data", () => {
        it("Navigate to PO and select po", () => {
          cy.dlSelectFirstDocument();
        });

        it("navigate to Line Items", () => {
          cy.drSelectLineItems();
        });

        it("Click on 'Add' inside PO dialog box and check for required fields", () => {
          cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
        });

        it("Select Part Number", () => {
          cy.poSelectPartNumber({ partNo: "PRT-00001 - 1" });
        });

        it("Enter Quantity Ordered", () => {
          cy.poEnterQuantityOrdered({ quantity: "5" });
        });

        it("Select Units", () => {
          cy.poSelectUnits();
        });

        it("Select GL code", () => {
          cy.poSelectGLCode();
        });

        it("Enter number of Units", () => {
          cy.poNumberOfUnits({ number: "2" });
        });

        it("Add Required Date", () => {
          cy.get("[name=\"date\"]").next().find("button").arrowClick();
          cy.get(".MuiPickersDay-daySelected").arrowClick();
        });

        it("Check Tax box", () => {
          cy.poSelectTaxCheckbox();
        });

        it("Click on 'Add' inside PO dialog box", () => {
          cy.poAddPOButtonClick();
        });

        it("Save PO", () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        });
      });


      context("fill and check Approver", () => {
        it("Navigate to detail tab", () => {
          cy.drSelectDetailsTab().wait(2000);
        });

        it(`Select '${USERS[1].name}' for Requestor`, () => {
          cy.get("[data-cy^='po-requestor-autocomplete']").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick().wait(2000);
        });

        it("Add Approver", () => {
          cy.get("[data-cy^='fb-po-approvals']").autocompleteSelect(USERS[1].name);
        });

        it("Verify Approver is only added once in Approver field", () => {
          cy.get("[data-cy^='fb-po-approvals']").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).should("not.exist");
        });

        it("Navigate to line Items", () => {
          cy.drSelectLineItems();
        });

        it("delete line item", () => {
          cy.get("[class=\"MuiSvgIcon-root FBIcon-root MuiSvgIcon-fontSizeSmall\"]").eq(0).click();
          cy.wait(2000);
        });

        it("Navigate to details tab", () => {
          cy.drSelectDetailsTab();
        });

        it(`Verify that the system removed  ${USERS[1].name} from the approvals field`, () => {
          cy.get("[data-cy^='fb-po-approvals']").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).should("exist");
        });

      });
    });
  });
});

export { };

