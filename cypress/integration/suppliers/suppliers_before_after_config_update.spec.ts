// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { SupplierExport } from "../../utils/constants/documentTypes/supplier";
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
          documentTypes: [
            SupplierExport,
          ],
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
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("import form template and release the form", () => {
    it("Import template", () => {
      cy.get("#fb-import-schema").attachFile("Supira_Supplier_Form_Template.json");
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create supplier document 1", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
    });

    it("Select 'Supplier' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Supplier");
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 1" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 1" });
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select R&D", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="R&D/Prototype Only"]`).arrowClick();
      cy.unClick();
      cy.wait(2000);
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.DRAFT)
        .should("exist");
    });
  });

  context("Create supplier document 2", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
    });

    it("Select 'Supplier' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Supplier");
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 2" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 2" });
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
      cy.wait(2000);
    });

    it("Select one supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.DRAFT)
        .should("exist");
    });
  });

  context("Create supplier document 3", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
    });

    it("Select 'Supplier' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Supplier");
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 3" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 3" });
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
      cy.wait(2000);
    });

    it("Select multiple supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).check({ force: true });
      cy.wait(1000);
      cy.get(`[value="Approved"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.DRAFT)
        .should("exist");
    });
  });

  context("Create supplier document 4", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
    });

    it("Select 'Supplier' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Supplier");
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 4" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 4" });
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
      cy.wait(2000);
    });

    it("Select single supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
      cy.wait(2000);
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
      cy.wait(1000);
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy^="fb-approvals-approvals-"]`).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.IN_REVIEW)
        .should("exist");
    });
  });

  context("Create supplier document 5", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
    });

    it("Select 'Supplier' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Supplier");
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 5" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 5" });
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
      cy.wait(2000);
    });

    it("Select multiple supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).check({ force: true });
      cy.get(`[value="Approved"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
      cy.wait(2000);
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
      cy.wait(1000);
    });

    it("Select Contracts and Agreements", () => {
      cy.get(`[value="Non-Disclosure Agreement"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Audits and Assessments", () => {
      cy.get(`[value="Site Quality Audit"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Certifications and Licenses", () => {
      cy.get(`[value="California FDB License"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy^="fb-approvals-approvals-"]`).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.IN_REVIEW)
        .should("exist");
    });
  });

  context("Create supplier document 6", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
    });

    it("Select 'Supplier' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Supplier");
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 6" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 6" });
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
      cy.wait(2000);
    });

    it("Select single supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
      cy.wait(2000);
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
      cy.wait(1000);
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy^="fb-approvals-approvals-"]`).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve document", () => {
      cy.ebApprove();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Create supplier document 7", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
    });

    it("Select 'Supplier' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Supplier");
    });

    it("Enter 'Supplier Description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier Description 7" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier 7" });
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
      cy.wait(2000);
    });

    it("Select multiple supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).check({ force: true });
      cy.get(`[value="Approved"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
      cy.wait(2000);
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
      cy.wait(1000);
    });

    it("Select Contracts and Agreements", () => {
      cy.get(`[value="Non-Disclosure Agreement"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Audits and Assessments", () => {
      cy.get(`[value="Site Quality Audit"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Certifications and Licenses", () => {
      cy.get(`[value="California FDB License"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy^="fb-approvals-approvals-"]`).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve document", () => {
      cy.ebApprove();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.RELEASED)
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
      cy.get(`[data-grid-row-index="4"] [data-grid-col-index="3"]`).should("have.text", "");
      cy.get(`[data-grid-row-index="5"] [data-grid-col-index="3"]`).should("have.text", "");
      cy.get(`[data-grid-row-index="6"] [data-grid-col-index="3"]`).should("have.text", "");
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
      cy.wait(2000);
    });

    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
      cy.reload();
    });

    it("verify supplier 1", () => {
      cy.supFilterById({ docId: "SUP-00003" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "N/A");
    });

    it("verify supplier 2", () => {
      cy.supFilterById({ docId: "SUP-00004" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 3", () => {
      cy.supFilterById({ docId: "SUP-00005" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved, Pending Evaluation");
    });

    it("verify supplier 4", () => {
      cy.supFilterById({ docId: "SUP-00006" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 5", () => {
      cy.supFilterById({ docId: "SUP-00007" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved, Pending Evaluation");
    });

    it("verify supplier 6", () => {
      cy.supFilterById({ docId: "SUP-00008" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 7", () => {
      cy.supFilterById({ docId: "SUP-00009" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved, Pending Evaluation");
    });
  });

  context("update supplier 1", () => {
    it("Select supplier 1", () => {
      cy.supFilterById({ docId: "SUP-00003" });
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Production", () => {
      cy.get(`[id^="mui-component-select-supplier-use-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Production"]`).arrowClick();
      cy.unClick();
      cy.wait(2000);
    });

    it("Select single supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).check({ force: true });
      cy.wait(1000);
    });
  });

  context("update supplier 2", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Select supplier 2", () => {
      cy.supFilterById({ docId: "SUP-00004" });
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("change supplier use status", () => {
      cy.get(`[value="Pending Evaluation"]`).uncheck({ force: true });
      cy.wait(1000);
      cy.get(`[value="Approved"]`).check({ force: true });
      cy.wait(2000);
    });
  });

  context("update supplier 3", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Select supplier 3", () => {
      cy.supFilterById({ docId: "SUP-00005" });
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("change supplier use status", () => {
      cy.get(`[value="Approved"]`).uncheck({ force: true });
      cy.wait(1000);
    });
  });

  context("Verify Supplier use Status column is updated", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
      cy.wait(2000);
    });

    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
      cy.reload();
    });

    it("Clear filters", () => {
      cy.wait(2000);
      cy.dlClearFilters();
    });

    it("verify supplier 1", () => {
      cy.supFilterById({ docId: "SUP-00003" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 2", () => {
      cy.supFilterById({ docId: "SUP-00004" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved");
    });

    it("verify supplier 3", () => {
      cy.supFilterById({ docId: "SUP-00005" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });
  });

  context("Release supplier 1", () => {
    it("Clear filters", () => {
      cy.dlClearFilters();
      cy.wait(2000);
    });

    it("Select supplier 1", () => {
      cy.supFilterById({ docId: "SUP-00003" });
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
      cy.wait(2000);
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
      cy.wait(1000);
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy^="fb-approvals-approvals-"]`).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.wait(2000);
      cy.pmSubmitForApproval();
    });

    it("Approve document", () => {
      cy.ebApprove();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Release supplier 2", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
      cy.wait(2000);
    });

    it("Select supplier 2", () => {
      cy.supFilterById({ docId: "SUP-00004" });
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
      cy.wait(2000);
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
      cy.wait(1000);
    });

    it("Select Contracts and Agreements", () => {
      cy.get(`[value="Non-Disclosure Agreement"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Audits and Assessments", () => {
      cy.get(`[value="Site Quality Audit"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Certifications and Licenses", () => {
      cy.get(`[value="California FDB License"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy^="fb-approvals-approvals-"]`).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve document", () => {
      cy.ebApprove();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Release supplier 3", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
      cy.wait(2000);
    });

    it("Select supplier 3", () => {
      cy.supFilterById({ docId: "SUP-00005" });
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Risk Classifications", () => {
      cy.get(`[id^="mui-component-select-risk-classificaiton-"]`).arrowClick({ force: true });
      cy.get(`[data-value="Minor"]`).arrowClick({ force: true });
      cy.unClick();
      cy.wait(2000);
    });

    it("Select Supplier Type", () => {
      cy.get(`[value="Contract Manufacturer"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplier Capabilities", () => {
      cy.get(`[value="Plastic Injection Molding"]`).check({ force: true });
      cy.wait(1000);
    });

    it("Select Supplied parts etc.", () => {
      cy.get(`[data-cy^="supplied-parts-material-equipment-etc-"]`).autocompleteSelect("SUP-00003", { force: true });
      cy.unClick();
      cy.wait(1000);
    });

    it("Navigate to Overview Tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get(`[data-cy^="fb-approvals-approvals-"]`).arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve document", () => {
      cy.ebApprove();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Release supplier 4", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
      cy.wait(2000);
    });

    it("Select supplier 4", () => {
      cy.supFilterById({ docId: "SUP-00006" });
      cy.dlSelectFirstDocument();
    });

    it("Approve document", () => {
      cy.ebApprove();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Release supplier 5", () => {
    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
      cy.wait(2000);
    });

    it("Select supplier 5", () => {
      cy.supFilterById({ docId: "SUP-00007" });
      cy.dlSelectFirstDocument();
    });

    it("Approve document", () => {
      cy.ebApprove();
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.RELEASED)
        .should("exist");
    });
  });

  context("Verify Supplier use Status column is updated for all after released", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
      cy.wait(2000);
    });

    it("Navigate to Supplier list", () => {
      cy.navigToSuppliers();
      cy.reload();
    });

    it("verify supplier 1", () => {
      cy.supFilterById({ docId: "SUP-00003" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 2", () => {
      cy.supFilterById({ docId: "SUP-00004" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved");
    });

    it("verify supplier 3", () => {
      cy.supFilterById({ docId: "SUP-00005" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 4", () => {
      cy.supFilterById({ docId: "SUP-00006" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 5", () => {
      cy.supFilterById({ docId: "SUP-00007" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved, Pending Evaluation");
    });

    it("verify supplier 6", () => {
      cy.supFilterById({ docId: "SUP-00008" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Pending Evaluation");
    });

    it("verify supplier 7", () => {
      cy.supFilterById({ docId: "SUP-00009" });
      cy.get(`[data-grid-row-index="0"] [data-grid-col-index="3"]`).should("have.text", "Approved, Pending Evaluation");
    });
  });
});

export { };
