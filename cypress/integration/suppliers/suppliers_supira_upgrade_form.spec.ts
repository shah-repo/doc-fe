// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let supplierPageDetailsId;

context("Create company via API and create Suppliers document", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("[API] Creates company", (done: any) => {
    cy.authApiLogin({
      email: CONFIG.SUPERADMIN_EMAIL,
      password: CONFIG.SUPERADMIN_PASSWORD,
    }).then((response: any) => {
      loginResponse = response;
      cy.cmpCreateCompany({
        specFilePath: __filename,
        payload: {
          companyAdminEmail: USERS[1].email,
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: IMPORTER_USER.email,
          numOfRevStages: 3,
          numOfDocDigits: 5,
          remoteValidatorBundleName: "default",
          slackIntegrationEnabled: false,
          users: [USERS[2], USERS[3], USERS[4]],
          documentTypes: [],
          acctCodes: ["code 1"],
          addresses: ["Address 1"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response: any) => {
        createdCompany = response;
        adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
        done();
      });
    });
  });

  it("[API] Login admin tester", (done: any) => {
    cy.authApiLogin({
      email: USERS[1].email,
      password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
    }).then((response) => {
      loginResponse = response;
      done();
    });
  });

  it("[API] Patch page details", (done: any) => {
    cy.request({
      method: "GET",
      url: `${CONFIG.BE_URL}/api/v1/page_details`,
      qs: {
        category: "Supplier",
      },
      headers: {
        Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
      },
    }).then((response) => {
      if (response.body) {
        supplierPageDetailsId = response.body[0].id;
      }
    }).then(() => {
      cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
      cy.cmpUpdatePageDetails({
        id: supplierPageDetailsId,
        payload: {
          columns: [
            {
              label: "Supplier ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "document.docId",
              showOnAndroid: true,
            },
            {
              label: "Supplier Name",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "name",
              showOnAndroid: true,
            },
            {
              label: "Risk Classification",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "formInput.risk-classificaiton-kmdn7qrd",
              showOnAndroid: true,
            },
            {
              label: "Supplier Use Status",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.supplier-use-status",
              showOnAndroid: true,
            },
            {
              label: "State",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "displayStatus",
              showOnAndroid: true,
            },
            {
              label: "Owner",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "owner.user.name",
              showOnAndroid: true,
            },
            {
              label: "Approval ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "changeRequest.crId",
              showOnAndroid: true,
            },
            {
              label: "Supplier Use",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "formInput.supplier-use-kmdn6oi4",
              showOnAndroid: true,
            },
          ],
        },
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId,
      }).then(() => done());
    });
  });

  it("Login user to dashboard", () => {
    cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
  });

  context("Create supplier form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Supplier Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Supplier Form" });
    });

    it("Enter description 'New Supplier Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Supplier Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Supplier' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Suppliers" });
      cy.unClick();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });
  });

  context("import form template and release the form", () => {
    it("Import template of 'Rev D' form", () => {
      cy.get("#fb-import-schema").attachFile("Supira_Supplier_Form_Template_Rev_D.json");
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create supplier document 1 with status 'Draft'", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 1" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 1" });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select R&D", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="R&D/Prototype Only"]`).arrowClick();
      cy.unClick();
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Verify the status", () => {
      cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.DRAFT)
        .should("exist");
    });
  });

  context("Create supplier document 2 with status 'Draft'", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 2" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 2" });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
    });

    it("Select one supplier use status", () => {
      cy.get(`[id^="mui-component-select-supplier-use-status"]`).arrowClick({ force: true });
      cy.get(`[data-value="Pending Evaluation"]`).arrowClick({ force: true });
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Verify the status", () => {
      cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.DRAFT)
        .should("exist");
    });
  });

  context("Create supplier document 3 with status 'Released'", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 3" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 3" });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
    });

    it("Select one supplier use status", () => {
      cy.get(`[id^="mui-component-select-supplier-use-status"]`).arrowClick({ force: true });
      cy.get(`[data-value="Pending Evaluation"]`).arrowClick({ force: true });
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
    });

    it("Select Contracts and Agreements", () => {
      cy.get(`[value="Non-Disclosure Agreement"]`).check({ force: true });
    });

    it("Select Audits and Assessments", () => {
      cy.get(`[value="Site Quality Audit"]`).check({ force: true });
    });

    it("Select Certifications and Licenses", () => {
      cy.get(`[value="California FDB License"]`).check({ force: true });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve document", () => {
      cy.ebApproveWithoutApi();
    });

    it("Verify the status", () => {
      cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Create supplier document 4 with status 'Released'", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 4" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 4" });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
    });

    it("Select one supplier use status", () => {
      cy.get(`[id^="mui-component-select-supplier-use-status"]`).arrowClick({ force: true });
      cy.get(`[data-value="Pending Evaluation"]`).arrowClick({ force: true });
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
    });

    it("Select Contracts and Agreements", () => {
      cy.get(`[value="Non-Disclosure Agreement"]`).check({ force: true });
    });

    it("Select Audits and Assessments", () => {
      cy.get(`[value="Site Quality Audit"]`).check({ force: true });
    });

    it("Select Certifications and Licenses", () => {
      cy.get(`[value="California FDB License"]`).check({ force: true });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve document", () => {
      cy.ebApproveWithoutApi();
    });

    it("Verify the status", () => {
      cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Verify Supplier use Status column is empty for all", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("verify supplier use status column values", () => {
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "");
      cy.get(`[data-grid-row-index="1"] [data-grid-col-index="3"]`).should("have.text", "");
      cy.get(`[data-grid-row-index="2"] [data-grid-col-index="3"]`).should("have.text", "");
      cy.get(`[data-grid-row-index="3"] [data-grid-col-index="3"]`).should("have.text", "");
    });
  });

  context("Update page details config", () => {
    it("[API] Update page details", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        qs: {
          category: "Supplier",
        },
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((response) => {
        if (response.body) {
          supplierPageDetailsId = response.body[0].id;
        }
      }).then(() => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
        cy.cmpUpdatePageDetails({
          id: supplierPageDetailsId,
          payload: {
            columns: [
              {
                label: "Supplier ID",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "document.docId",
                showOnAndroid: true,
              },
              {
                label: "Supplier Name",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "name",
                showOnAndroid: true,
              },
              {
                label: "Risk Classification",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "formInput.risk-classificaiton-kmdn7qrd",
                showOnAndroid: true,
              },
              {
                fn: "VALUE_FROM_STRING_OR_ARRAY_WITHOUT_DELETED",
                label: "Supplier Use Status",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.supplier-use-status",
                sourcePath: [
                  "formInput.supplier-use-status-kx6tlz39",
                  "formInput.supplier-use-status-kmdn8t3m",
                ],
                showOnAndroid: true,
              },
              {
                label: "State",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "displayStatus",
                showOnAndroid: true,
              },
              {
                label: "Owner",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "owner.user.name",
                showOnAndroid: true,
              },
              {
                label: "Approval ID",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "changeRequest.crId",
                showOnAndroid: true,
              },
              {
                label: "Supplier Use",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "formInput.supplier-use-kmdn6oi4",
                showOnAndroid: true,
              },
            ],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });
  });

  context("Verify Supplier use Status column is updated for all", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
    });

    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("verify supplier 1", () => {
      cy.supFilterById({ docId: "SUP-00001" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "N/A");
    });

    it("verify supplier 2", () => {
      cy.supFilterById({ docId: "SUP-00002" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 3", () => {
      cy.supFilterById({ docId: "SUP-00003" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 4", () => {
      cy.supFilterById({ docId: "SUP-00004" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });
  });

  context("Upgrade supplier form to 'Rev E'", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Filters form by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New Supplier Form", status: "Released" });
    });

    it("Click 'Revise Document' button", () => {
      cy.drClickReviseDocument();
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Import template of 'Rev E' form", () => {
      cy.get("#fb-import-schema").attachFile("Supira_Supplier_Form_Template_Rev_E.json");
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Release supplier 1 document without upgrading form", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Select supplier 1", () => {
      cy.supFilterById({ docId: "SUP-00001" });
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Add an Approval", () => {
      cy.wait(1000);
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve document", () => {
      cy.ebApproveWithoutApi();
    });

    it("Verify the status", () => {
      cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Release supplier 2 document with Upgraded form", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Select supplier 2", () => {
      cy.supFilterById({ docId: "SUP-00002" });
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click 'Click here' button to upgrade form to latest revision", () => {
      cy.get(`button[data-cy="formUpgradeButton"]`).arrowClick();
      cy.get(`button[id="UpgradeToLatest-proceed"]`).arrowClick();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("change supplier use status", () => {
      cy.get(`[value="Approved"]`).check({ force: true });
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
    });

    it("Select Contracts and Agreements", () => {
      cy.get(`[value="Non-Disclosure Agreement"]`).check({ force: true });
    });

    it("Select Audits and Assessments", () => {
      cy.get(`[value="Site Quality Audit"]`).check({ force: true });
    });

    it("Select Certifications and Licenses", () => {
      cy.get(`[value="California FDB License"]`).check({ force: true });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=fb-approvals-approvals-]").autocompleteSelect(USERS[1].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve document", () => {
      cy.ebApproveWithoutApi();
    });

    it("Verify the status", () => {
      cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Revise and release supplier 3 document without upgrading form", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Select supplier 3", () => {
      cy.supFilterById({ docId: "SUP-00003" });
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click 'Revise Document' button", () => {
      cy.drClickReviseDocument();
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve document", () => {
      cy.ebApproveWithoutApi();
    });

    it("Verify the status", () => {
      cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Release supplier 4 document with upgraded form", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Select supplier 4", () => {
      cy.supFilterById({ docId: "SUP-00004" });
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click 'Revise Document' button", () => {
      cy.drClickReviseDocument();
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click 'Click here' button to upgrade form to latest revision", () => {
      cy.get(`button[data-cy="formUpgradeButton"]`).arrowClick();
      cy.get(`button[id="UpgradeToLatest-proceed"]`).arrowClick();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).check({ force: true });
      cy.get(`[value="Approved"]`).check({ force: true });
    });

    it("Select Contracts and Agreements", () => {
      cy.get(`[value="Non-Disclosure Agreement"]`).check({ force: true });
    });

    it("Select Audits and Assessments", () => {
      cy.get(`[value="Site Quality Audit"]`).check({ force: true });
    });

    it("Select Certifications and Licenses", () => {
      cy.get(`[value="California FDB License"]`).check({ force: true });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=fb-approvals-approvals-]").autocompleteSelect(USERS[1].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve document", () => {
      cy.ebApproveWithoutApi();
    });

    it("Verify the status", () => {
      cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Verify Supplier use Status column is updated", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
    });

    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
      cy.reload();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("verify supplier 1", () => {
      cy.supFilterById({ docId: "SUP-00001" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "N/A");
    });

    it("verify supplier 2", () => {
      cy.supFilterById({ docId: "SUP-00002" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved");
    });

    it("verify supplier 3", () => {
      cy.supFilterById({ docId: "SUP-00003" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 4", () => {
      cy.supFilterById({ docId: "SUP-00004" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved, Pending Evaluation");
    });
  });
});

export { };
