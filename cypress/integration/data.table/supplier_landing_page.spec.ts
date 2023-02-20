// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let supplierDocumentType;
let adminEmployee;
let group;

const supplierId = "SUPPLIER ID";
const supplierName = "SUPPLIER NAME";
const supplierLevel = "SUPPLIER LEVEL";
const supplierStatus = "SUPPLIER STATUS";
const state = "STATE";
const owner = "OWNER";
const approvalId = "APPROVAL ID";

context("Suppliers landing page", () => {
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
    }).then((response) => {
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
          acctCodes: ["code 1"],
          addresses: ["Address 1"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
        supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
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

  it("[API]Creates suplier document", (done: any) => {
    cy.grpGetGroupByName({
      sessionId: loginResponse.sessionId,
      employeeId: adminEmployee.id,
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
          name: "API supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });
  });

  it("Login user to dashboard", () => {
    cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
  });

  context("Create supplier document", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliers();
    });

    it("Verify that landing pages for Supplier List  use the new data table", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      SystemRequirement("REQ-2240");
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${supplierId}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${supplierName}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${supplierLevel}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${supplierStatus}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${state}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${owner}`);
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", `${approvalId}`);
    });

    it(`Verify buttons "Clear Filter" and "Export List" "Add Supplier" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get("[id=DocumentByTypeListPresenter-openDocRev]").should("exist");
    });

    it(`Verify drag and drop`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "SUP-00004");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "SUP-00004");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });
    });

    it("Column grouping", () => {
      cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column").click();
    });

    it("Verify that data is sorted based on that column grouping", () => {
      cy.get(".k-grouping-row").eq(0).should("contain.text", "API supplier").arrowClick();
    });

    it("Grouping columns should be displayed next to button Clear Filters", () => {
      cy.get(".k-group-indicator").eq(0).should("have.text", "Supplier Name");
    });

    it("User should be able to remove it", () => {
      cy.get(".k-i-group-delete").click();
    });

    it("Click on one of the documents from the Document list in the landing page", () => {
      cy.dlSelectFirstDocument();
    });
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

    it("Click on 'Supplier' document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Supplier" });
      cy.unClick();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify approval field is added as result of predefined schema", () => {
      cy.get("[id^=\"fb-approvals-section-fb-approvals\"]").should("exist");
      cy.get("input[data-cy^=\"fb-approvals-fb-approvals\"]").should("exist");
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create supplier document", () => {
    it("Navigate to supplier list", () => {
      cy.navigToSuppliersWithoutApi();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Click create new to create supplier", () => {
      cy.supCreateNew();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("turnoff autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter 'Supplier Address/Phone'", () => {
      cy.drEnterDocumentDescription({ description: "Test Supplier address" });
    });

    it("Enter 'Supplier Name'", () => {
      cy.supEnterSuppName({ name: "Test Supplier" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateSupplierWithApiCall();
    });

    it("Add first Approver'", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[2].name });
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });
  });

  context("Verify sorting arrows on each field", () => {
    context("Sort 'Supplier ID'", () => {
      it("Navigate to supplier list", () => {
        cy.navigToSuppliers();
      });

      it("Supplier ID should be in ascending order", () => {
        cy.contains(`${supplierId}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${supplierId}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 7 });
      });

      it("Supplier ID should be in descending order", () => {
        cy.contains(`${supplierId}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${supplierId}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 7 });
      });
    });

    context("Sort 'Supplier Name'", () => {
      it("Supplier Name should be in ascending order", () => {
        cy.contains(`${supplierName}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${supplierName}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 7 });
      });

      it("Supplier Name should be in descending order", () => {
        cy.contains(`${supplierName}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${supplierName}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 7 });
      });
    });

    context("Sort 'Supplier Level'", () => {
      it("Supplier Level should be in ascending order", () => {
        cy.contains(`${supplierLevel}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${supplierLevel}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 7 });
      });

      it("Supplier Level should be in descending order", () => {
        cy.contains(`${supplierLevel}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${supplierLevel}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 7 });

        // workaround for sorting issue between 'Supplier Level' and 'Supplier Status' columns
        cy.contains(`${supplierLevel}`).eq(0).click();
      });
    });

    context("Sort 'Supplier Status'", () => {
      it("Supplier Status should be in ascending order", () => {
        cy.contains(`${supplierStatus}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${supplierStatus}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 7 });
      });

      it("Supplier Status should be in descending order", () => {
        cy.contains(`${supplierStatus}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${supplierStatus}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 7 });
      });
    });

    context("Sort 'State'", () => {
      it("State should be in ascending order", () => {
        cy.contains(`${state}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${state}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 7 });
      });

      it("State should be in descending order", () => {
        cy.contains(`${state}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${state}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 7 });
      });
    });

    context("Sort 'Owner'", () => {
      it("Owner should be in ascending order", () => {
        cy.contains(`${owner}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${owner}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 5, colLength: 7 });
      });

      it("Owner should be in descending order", () => {
        cy.contains(`${owner}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${owner}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 5, colLength: 7 });
      });
    });

    context("Sort 'Approval ID'", () => {
      it("Approval ID should be in ascending order", () => {
        cy.contains(`${approvalId}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${approvalId}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 7 });
      });

      it("Approval ID should be in descending order", () => {
        cy.contains(`${approvalId}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${approvalId}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 7 });
      });
    });
  });

  context("Verify filters on each field", () => {
    it("Verify filter for ID", () => {
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 1, input: "" });
      cy.filterLandingPageColumnFilter({ colIndex: 1, input: "SUP-00004" });
      cy.landingPageLoadingElementShouldAppear();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 1, input: "SUP-00004" });
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify filter for Supplier Name", () => {
      cy.dlClearFilters();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 2, input: "" });
      cy.filterLandingPageColumnFilter({ colIndex: 2, input: "API supplier" });
      cy.landingPageLoadingElementShouldAppear();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 2, input: "API supplier" });
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify filter for Supplier Level", () => {
      cy.dlClearFilters();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 3, input: "" });
      cy.filterLandingPageColumnFilter({ colIndex: 3, input: "open" });
      cy.landingPageLoadingElementShouldAppear();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 3, input: "open" });
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify filter for Supplier Status", () => {
      cy.dlClearFilters();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 4, input: "" });
      cy.filterLandingPageColumnFilter({ colIndex: 4, input: "close" });
      cy.landingPageLoadingElementShouldAppear();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 4, input: "close" });
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify filter for State", () => {
      cy.dlClearFilters();
      cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="5"] span.k-input`).arrowClick();
      cy.get("ul>li[role=option]").contains("Draft").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Draft");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify filter for Owner", () => {
      cy.dlClearFilters();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 6, input: "" });
      cy.filterLandingPageColumnFilter({ colIndex: 6, input: USERS[2].name });
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`th[aria-colindex="6"] .k-filtercell > input`).should("not.have.attr", "value", USERS[1].name);
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify filter for Approval ID", () => {
      cy.dlClearFilters();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 7, input: "" });
      cy.filterLandingPageColumnFilter({ colIndex: 7, input: "1" });
      cy.landingPageLoadingElementShouldAppear();
      cy.filterVerifyLandingPageColumnFilterAttr({ colIndex: 7, input: "1" });
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Verify hide and freeze", () => {
    it("Verify hide on Suppiler Level", () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${supplierLevel}`);
      cy.get(`th[aria-colindex="4"] span.k-icon`).eq(0).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("div.k-columnmenu-item ").contains("Hide Column").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${supplierLevel}`);
    });

    it("Verify unhide on Suppiler Level", () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${supplierLevel}`);
      cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=menuitem]").contains(`${supplierLevel}`).parents("li").find("svg").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("body").type("{esc}");
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${supplierLevel}`);
    });

    it("Verify freeze on ID", () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${supplierId}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${supplierName}`);
    });

    it("Verify un-freeze on ID", () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${supplierName}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${supplierId}`);
    });
  });

  context("Verify dropdown filters", () => {
    it("Verify dropdown filters", () => {
      cy.grpClearFilter();
      cy.get(`th[aria-colindex="3"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
      "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
    });

    it(`Verify "Does not contain" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.filterLandingPageColumnFilter({ colIndex: 2, input: "API supplier" });
      cy.landingPageLoadingElementShouldAppear();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify "Is equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.filterLandingPageColumnFilter({ colIndex: 2, input: "API supplier" });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 }).wait(500);
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify "Is not equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.filterLandingPageColumnFilter({ colIndex: 2, input: "API supplier" });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 }).wait(500);
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify "Starts with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.filterLandingPageColumnFilter({ colIndex: 2, input: "API supplier" });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 }).wait(500);
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify "Ends with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.filterLandingPageColumnFilter({ colIndex: 2, input: "API supplier" });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 }).wait(500);
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify "Is null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Is null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 }).wait(500);
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify "Is not null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify "Is not empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify "Is empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="2"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Insert filter", () => {
      cy.filterLandingPageColumnFilter({ colIndex: 1, input: "SUP-00004" });
    });

    it(`Crossed filter icon should appear `, () => {
      cy.get(".k-button.k-clear-button-visible").should("be.visible");
    });

    it(`Select option Contains and verify that the filter is functional`, () => {
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("ul>li[role=option]").contains("Contains").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify that each filter from the dropdown list for each column in the landing page is functional", () => {
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.get(`th[aria-colindex="3"] span.k-i-filter`).arrowClick();
      cy.get(`th[aria-colindex="4"] span.k-i-filter`).arrowClick();
      cy.get(`th[aria-colindex="5"] span.k-i-filter`).arrowClick();
      cy.get(`th[aria-colindex="6"] span.k-i-filter`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Navigate to column with option Select field", () => {
      cy.get(`[aria-colindex="5"] span.k-input`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("li").contains("Draft").arrowClick().wait(500);
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify that column with Select field have disabled crossed filter", () => {
      cy.get(".k-button-icon.k-clear-button-visible").should("exist");
    });

    it("Select option from dropdown list", () => {
      cy.get(`th[aria-colindex="2"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it(`Crossed filter icon should appear `, () => {
      cy.get(".k-button-icon.k-clear-button-visible").should("exist");
    });
  });
});
