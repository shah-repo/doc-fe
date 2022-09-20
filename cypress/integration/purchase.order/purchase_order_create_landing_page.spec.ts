// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { SupplierExport } from "../../utils/constants/documentTypes/supplier";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

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
const po = "PO #";
const rev = "REVISION";
const poStatus = "PO STATUS";
const poState = "PO STATE";
const poSupplier = "SUPPLIER";
const partNumber = "PART NUMBER";
const amount = "AMOUNT";
const requestor = "REQUESTOR";
const issueDate = "ORDER DATE";
const currentDate = moment().tz("America/Los_Angeles").format("MM/DD/YYYY");
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
const predefinedPOSchema = [
  {
    name: "po-status-built-in",
    type: "select",
    index: 0,
    label: "PO Status",
    tabId: "details",
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
    validationAttribute: "PO Status",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
  },
  {
    name: "general-information-to-be-completed-by-requester-kc3oqlpn",
    type: "section",
    index: 1,
    label: "General Information",
    tabId: "details",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
  },
  {
    name: "po-requestor-autocomplete",
    type: "autocomplete",
    index: 2,
    label: "Requestor",
    rules: "required",
    tabId: "details",
    hidden: false,
    deleted: false,
    optionId: "3",
    optionPath: "/change_requests/available_approvers",
    placeholder: "[Select requestor here]",
    rulesObject: {},
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    optionLabelKey: "user.email",
    optionValueKey: "id",
    outputDisabled: false,
    validationMode: "default",
    formValuesRules: {},
    editorProperties: [
      "deleteDisabled",
    ],
    validationAttribute: "Requestor",
    deleteInFormDisabled: true,
    sampleItemsIndicator: {
      id: "",
      enabled: false,
      serialNumber: 0,
      sampleSection: false,
    },
    applicableValidationSchema: true,
  },
  {
    name: "po-supplier-built-in",
    type: "supplier",
    index: 3,
    label: "Supplier ",
    tabId: "details",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: true,
    validationAttribute: "Supplier",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
  },
  {
    name: "ordered-k6mlhan7",
    type: "datepicker",
    index: 4,
    label: "Order Date",
    rules: "required",
    tabId: "details",
    hidden: false,
    deleted: false,
    validators: {
      required: true,
    },
    rulesObject: {},
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: false,
    outputDisabled: false,
    validationMode: "default",
    formValuesRules: {},
    editorProperties: [
      "deleteDisabled",
    ],
    validationAttribute: "Order Date",
    deleteInFormDisabled: true,
    sampleItemsIndicator: {
      id: "",
      enabled: false,
      serialNumber: 0,
      sampleSection: false,
    },
    applicableValidationSchema: true,
  },
  {
    name: "po-items-built-in",
    type: "purchaseorder",
    index: 5,
    label: "Purchase Order",
    tabId: "lineitems",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: true,
    validationAttribute: "Purchase Order",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
  },
  {
    name: "po-items-built-in-summary",
    type: "purchaseordersummary",
    index: 6,
    label: "Purchase Order Summary",
    tabId: "details",
    lineItem: "po-items-built-in",
    applicableOn: [
      "ON_STATE_TO_IN_REVIEW",
    ],
    deleteDisabled: true,
    validationAttribute: "Purchase Order Summary",
    deleteInFormDisabled: true,
    applicableValidationSchema: true,
  },
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
                valuePath: "precalc.po-requestor-autocomplete",
                sourcePath: [
                  "formInput.po-requestor-autocomplete",
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

  context("Check PO exists & verify schema with predefined schema", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
    });

    it("Check filters for document type management", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("left");
      cy.filterDocTypeManagement({
        status: "Active", documentType: "Purchase Order", acronym: "PO-",
        privateNumber: "Yes", redline: "No", qms: "Yes", needsSignature: "Yes", training: "No",
        startingNumber: "1", revisionStage: "Numeric", group: "PO",
        equipmentProdEnforce: "No", category: "Purchase Order",
      });
    });

    it("Check predefined schema matches the one set in previous", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='14']>span").eq(0).arrowClick();
      cy.get(`[class="k-form-field-wrap"]>span>textarea`)
        .invoke("val")
        .then((res) => JSON.parse(res as string))
        .each((preItem: any, index: number) => {
          expect(preItem.name).to.eq(predefinedPOSchema[index].name);
          expect(preItem.type).to.eq(predefinedPOSchema[index].type);
          expect(preItem.label).to.eq(predefinedPOSchema[index].label);
          expect(preItem.tabId).to.eq(predefinedPOSchema[index].tabId);
        });
    });

    it("Close the schema popup", () => {
      cy.dtmCloseDialogButton();
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

    it("Create new document from 'Form'", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
    });

    it("Enter description 'PO test'", () => {
      cy.drEnterDocumentDescription({ description: "PO test" });
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

    it(`Select '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Add an Approval", () => {
      cy.wait(3000);
      cy.get("[data-cy^=\"fb-po-approvals\"]").autocompleteSelect(USERS[1].email);
    });
  });

  context("Confirm the PO entered data is correct", () => {
    it("Navigate to Purchase Order list", () => {
      cy.navigToPurchaseOrder();
    });

    it("verify the correct data are displayed in Supplier field", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "PO-00001" });
      cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
      cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "1");
      cy.get("tr.k-master-row").first().find("td").eq(2).should("have.text", "Open");
      cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "Draft");
      cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "New Supplier");
      cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", USERS[1].name);
      cy.get("tr.k-master-row").first().find("td").eq(8).should("have.text", currentDate);
    });

    it("Select 'Open' for PO status", () => {
      cy.dlSelectFirstDocument();
      cy.poSelectPOStatus({ status: "Closed" });
    });
    it("Click on 'Add item' button", () => {
      SystemRequirement("REQ-1360");
      cy.drSelectLineItems();
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.poAddNewFieldItem();
      });
    });
    it("Select Part Number", () => {
      SystemRequirement("REQ-1410");
      cy.poSelectPartNumber({ partNo: "PRT-00001 - 1" });
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
    it("Verify the released document", () => {
      cy.navigToPurchaseOrder();
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "PO-00001" });
      cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
      cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "1");
      cy.get("tr.k-master-row").first().find("td").eq(2).should("have.text", "Closed");
      cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "Draft");
      cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "New Supplier");
      cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", "PRT-00001 - 1");
      cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", "$10.93");
      cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", USERS[1].name);
      cy.get("tr.k-master-row").first().find("td").eq(8).should("have.text", currentDate);
    });

    it("Edit one or two fields & approve & release", () => {
      cy.dlSelectFirstDocument();
      cy.poSelectPOStatus({ status: "Cancelled" });
      cy.wait(3000);
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve & Release", () => {
      cy.poApprove();
    });

    it("Verify the released document", () => {
      cy.navigToPurchaseOrder();
      cy.get("tr.k-master-row").first().find("td").eq(0).should("have.text", "PO-00001");
      cy.get("tr.k-master-row").first().find("td").eq(1).should("have.text", "1");
      cy.get("tr.k-master-row").first().find("td").eq(2).should("have.text", "Cancelled");
      cy.get("tr.k-master-row").first().find("td").eq(3).should("have.text", "RELEASED");
      cy.get("tr.k-master-row").first().find("td").eq(4).should("have.text", "New Supplier");
      cy.get("tr.k-master-row").first().find("td").eq(5).should("have.text", "PRT-00001 - 1");
      cy.get("tr.k-master-row").first().find("td").eq(6).should("have.text", "$10.93");
      cy.get("tr.k-master-row").first().find("td").eq(7).should("have.text", USERS[1].name);
      cy.get("tr.k-master-row").first().find("td").eq(8).should("have.text", currentDate);
    });
  });
});

export { };

