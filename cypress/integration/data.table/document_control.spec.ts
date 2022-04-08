// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { LINE_ITEMS_STATUS_TYPES } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
let formId;

const documentRevisionName = "AR Form";
const secondDocumentRevName = "Second document for testing";
const approvalRequestName = "Approval request for testing 1";
const DDTitle = "DD Test";
const docTypeOne = "Design Document";
const docIdStr = "Doc ID";
const EXIST = "exist";
const Rev = "Revision";
const DocTitle = "Document title";
const Type = "Type";
const Owner = "Owner";
const ARID = "AR ID";

context("Document list test", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
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

    it("[API]Creates document revision for document list test 1", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description1</p>",
            document: {
              docId: "CP-00003",
              documentType: {
                id: componentSpecificationDocumentType[0].id,
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
            name: documentRevisionName,
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
    it("[API]Creates document revision for document list test 2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test Doc Rev Description2</p>",
          document: {
            docId: "CP-00004",
            documentType: {
              id: componentSpecificationDocumentType[0].id,
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
          name: secondDocumentRevName,
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  context("Navigate to Document Control", () => {
    it("Navigate to document control", () => {
      cy.get("[data-cy=\"navigation.documentControl\"]").arrowClick();
    });
  });

  context("Navigate to document list", () => {
    it("Navigate to document list landing page", () => {
      cy.navigToDocumentList();
    });

    it("Verify that landing pages use the new data table", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify that landing pages for Document List  use the new data table", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${docIdStr}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${Rev}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${DocTitle}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${Type}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${Owner}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${ARID}`);
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", "Status");
      cy.get(`th[role="columnheader"]`).eq(7).should("have.text", "Effective Date");
      cy.get(".k-indicator-container").eq(0).should(`${EXIST}`);
      cy.get(".k-filtercell-operator").eq(0).should(`${EXIST}`);
    });

    it("The user should not be able to edit line items dynamically", () => {
      cy.get(`th[role="columnheader"]`).eq(0).find("svg").should("not.exist");
    });

    it("Verify all the columns", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${docIdStr}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${Rev}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${DocTitle}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${Type}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${Owner}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${ARID}`);
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", "Status");
      cy.get(`th[role="columnheader"]`).eq(7).should("have.text", "Effective Date");
    });

    it("Verify that the Document List filter to display released documents when starting a new Enlil session", () => {
      cy.dlVerifyFilterByStatus({ status: "Released" });
    });

    context("Verify most recent edited document is first on list", () => {
      it("Verify first document is: " + documentRevisionName, () => {
        cy.dlVerifyFilterByDocTitle({ docTitle: documentRevisionName });
      });
    });
  });

  context("Insert Filters", () => {
    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Filter list by docId", () => {
      cy.dlFilterByDocId({ docId: "CP-00003" });
    });

    it("Verify filter by docId", () => {
      cy.dlVerifyFilterByDocId({ docId: "CP-00003" });
    });

    it("Verify document counter on document list", () => {
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify that the number of documents displayed match filter settings", () => {
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      cy.dlClearFilters();
    });
  });

  context("Verify description of the document when the mouse hovers over the document title", () => {
    it("Hover over the document", () => {
      cy.get(".k-master-row").realHover();
    });

    it("Verify description", () => {
      cy.dlVerifyDescriptionOnHover({ description: "Test Doc Rev Description2" });
    });
  });

  context("Verify that Button Clear Filter, Export List and Create a Document are present", () => {
    it("Verify that Button 'Clear Filter', 'Export List' and 'Create a Document' are present", () => {
      cy.get(`button[data-cy="clearFilter"]`).should(`${EXIST}`);
      cy.get(`button[data-cy="document.revision.export.list"]`).should(`${EXIST}`);
      cy.get(`button[data-cy="document.revision.create"]`).should(`${EXIST}`);
    });

    it(`Verify drag and drop`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "CP-");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
    });

    it("column grouping", () => {
      cy.get(`th[aria-colindex="4"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column").click();
    });

    it("Verify that data is sorted based on that column grouping", () => {
      cy.get(".k-grouping-row").eq(0).should("contain.text", "CP-").arrowClick();
      cy.get(".k-grouping-row").eq(1).should("contain.text", "FM-").arrowClick();
    });

    it("Grouping columns should be displayed next to button Clear Filters", () => {
      cy.get(".k-group-indicator").eq(0).should("have.text", `${Type}`);
    });

    it("User should be able to remove it", () => {
      cy.get(".k-i-group-delete").click();
    });

    it("Click on one of the documents from the Document list in the landing page", () => {
      cy.dlSelectFirstDocument();
    });

    it("Create Document", () => {
      cy.navigToDocumentList();
      cy.cmpClickCreateNewDocument();
    });

    it("type a title", () => {
      cy.drEnterDocumentTitle({ name: `${DDTitle}{enter}` });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it(`fill in document type: ${docTypeOne}`, () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.drSelectOutputDocumentType({ documentType: "Approval Request" });
    });

    it("clicks on 'Create Document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify Document ID", () => {
      cy.get("#HeaderInfo-status").should("have.text", "Draft");
      cy.get("#HeaderInfo-name").should("have.text", "DD Test");
      cy.get("#HeaderInfo-docId").then((x) => {
        formId = x.text();
      });
    });

    it("Verify that the system displays only documents in the documents list with corresponding data", () => {
      cy.navigToDocumentList();
      cy.get(`td[data-grid-col-index="0"]`).first().should("contain.text", `${formId}` );
    });
  });

  context("Approval Requests", () => {
    it("Navigate to Approval Requests Landing page", () => {
      cy.navigToApprovalRequestList();
    });

    it("Verify that landing pages use the new data table", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify that landing pages for Document List  use the new data table", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${ARID}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", "AR Title");
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${Owner}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", "Status");
      cy.get(".k-indicator-container").eq(0).should(`${EXIST}`);
      cy.get(".k-filtercell-operator").eq(0).should(`${EXIST}`);
    });

    it("Verify that by default the AR list filter to display AR's with latest edited IN_REVIEW ", () => {
      cy.alFilterByStatus({ status: LINE_ITEMS_STATUS_TYPES.IN_REVIEW });
    });

    // eslint-disable-next-line max-len
    it("Verify that by default approval request list is sorted by most recent edited first  " + approvalRequestName, () => {
      cy.alClearFilters();
      cy.get(`td[data-grid-col-index="1"]`).eq(0).should("contain.text", "Releasing FM-00002,DD Test");
    });

    it("Hover over the AR title", () => {
      cy.get(`th[role="columnheader"]`).eq(0).realHover().should("have.text", "Approval Request Form");
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("AR description when the mouse hovers over the AR title", () => {
      cy.get("tr.k-master-row>td").eq(1).realHover().should("have.text", "AR Form");
    });

    it("Verify filter by AR ID", () => {
      cy.alVerifyFilterByArId({ arId: "AR99999" });
    });

    it("Navigate from the landing page", () => {
      cy.navigToDocumentList();
    });

    it("Navigate to AR landing page", () => {
      cy.navigToApprovalRequestList();
    });

    it("Verify when navigating away from and back to the approval request list", () => {
      cy.dlClearFilters();
      cy.alVerifyFilterByArId({ arId: "AR99999" });
      cy.navigToDocumentList();
      cy.navigToApprovalRequestList();
    });

    it("Verify that Button 'Clear Filter', 'Export List' and 'Create an Approval Request' are present", () => {
      cy.get(`button[data-cy="clearFilter"]`).should(`${EXIST}`);
      cy.get(`button[data-cy="document.revision.export.list"]`).should(`${EXIST}`);
      cy.get(`button[data-cy="change.request.create"]`).should(`${EXIST}`);
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it(`Verify drag and drop`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "AR99999");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
    });

    it("Column grouping", () => {
      cy.get(`th[aria-colindex="4"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column").click();
    });

    it("Verify that data is sorted based on that column grouping", () => {
      cy.get(".k-grouping-row").eq(0).should("contain.text", LINE_ITEMS_STATUS_TYPES.CLOSED).arrowClick();
    });

    it("Grouping columns should be displayed next to button Clear Filters", () => {
      cy.get(".k-group-indicator").eq(0).should("have.text", "Status");
    });

    it("User should be able to remove it", () => {
      cy.get(".k-i-group-delete").click();
      cy.navigToDocumentList();
    });

    it("The system shall allow the user to open an AR from the AR list", () => {
      cy.navigToApprovalRequestList();
      cy.dlClearFilters();
      cy.get(".k-master-row").eq(0).arrowClick();
    });

    it("Verify that the system displays only documents in the documents list with corresponding data", () => {
      cy.navigToDocumentList();
      cy.dlVerifyARIdIsPresentOnFirstDocument();
    });
  });

  context("Records", () => {
    it("Navigate to Records landing page", () => {
      cy.navigToRecords();
    });

    it("Verify all the columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", "ID");
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${Rev}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", "State");
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", "Title");
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${Owner}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", "Released Date");
    });

    it("Clear filter", () => {
      cy.filterClear();
    });

    it("Select several filters", () => {
      cy.get(".k-filtercell-operator").eq(0).click();
      cy.get(".k-filtercell-operator").eq(1).click();
    });

    it("Navigate back to the Landing page", () => {
      cy.navigToRecords();
    });

    it("Verify system maintained filter settings when navigating away from and back to the Record landing page", () => {
      cy.get(".k-filtercell-operator").eq(0).click();
      cy.get(".k-filtercell-operator").eq(1).click();
      cy.get(".k-filtercell-operator").eq(2).click();
      cy.get(".k-filtercell-operator").eq(3).click();
    });

    it("Verify that Button 'Clear Filter', 'Export List' and 'Create a Record' are present", () => {
      cy.get(`button[data-cy="clearFilter"]`).should(`${EXIST}`);
      cy.get(`button[data-cy="document.revision.export.list"]`).should(`${EXIST}`);
      cy.get("#DocumentByTypeListPresenter-openDocRev").realHover().should(`${EXIST}`);
    });

    it(`Verify drag and drop`, () => {
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
    });

    it("Column grouping", () => {
      cy.navigToRecords();
      cy.get(`th[aria-colindex="4"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column").click();
    });

    it("Grouping columns should be displayed next to button Clear Filters", () => {
      cy.get(".k-group-indicator").eq(0).should("have.text", "Title");
    });

    it("User should be able to remove it", () => {
      cy.get(".k-i-group-delete").click();
    });
  });

  context("Verifying and checking every arrow is clickable", () => {
    it("Verify that arrow on ID for sorting ", () => {
      cy.navigToDocumentList();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="1"] span.k-i-sort-asc-sm`).should(`${EXIST}`);
      cy.get(`th[aria-colindex="1"] span.k-column-title`).arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-i-sort-desc-sm`).should(`${EXIST}`);
    });

    it(`Verify that arrow on ${Rev} for sorting`, () => {
      cy.get(`th[aria-colindex="2"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="2"] span.k-i-sort-asc-sm`).should(`${EXIST}`);
      cy.get(`th[aria-colindex="2"] span.k-column-title`).arrowClick();
      cy.get(`th[aria-colindex="2"] span.k-i-sort-desc-sm`).should(`${EXIST}`);
    });

    it("Verify that arrow on Document Title for sorting", () => {
      cy.get(`th[aria-colindex="3"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="3"] span.k-i-sort-asc-sm`).should(`${EXIST}`);
      cy.get(`th[aria-colindex="3"] span.k-column-title`).arrowClick();
      cy.get(`th[aria-colindex="3"] span.k-i-sort-desc-sm`).should(`${EXIST}`);
    });

    it(`Verify that arrow on ${Type} for sorting`, () => {
      cy.get(`th[aria-colindex="4"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="4"] span.k-i-sort-asc-sm`).should(`${EXIST}`);
      cy.get(`th[aria-colindex="4"] span.k-column-title`).arrowClick();
      cy.get(`th[aria-colindex="4"] span.k-i-sort-desc-sm`).should(`${EXIST}`);
    });

    it(`Verify that arrow on ${Owner} for sorting`, () => {
      cy.get(`th[aria-colindex="5"] span.k-column-title`).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="5"] span.k-i-sort-asc-sm`).should(`${EXIST}`);
      cy.get(`th[aria-colindex="5"] span.k-column-title`).arrowClick();
      cy.get(`th[aria-colindex="5"] span.k-i-sort-desc-sm`).should(`${EXIST}`);
    });
  });

  context("Verify filters on each field", () => {
    it(`Verify filter for ${docIdStr}`, () => {
      cy.dlFilterByDocId({ docId: "CP-00003" });
      cy.dlVerifyFilterByDocId({ docId: "CP-00003" });
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it(`Verify filter for ${Rev}`, () => {
      cy.dlClearFilters();
      cy.dlFilterByRev({ revision: "1" });
      cy.dlVerifyFilterByRev({ revision: "1" });
      cy.dlVerifyDocCounter({ docCounterNumber: 4 });
    });

    it("Verify filter for Document Title", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocTitle({ docTitle: documentRevisionName });
      cy.dlVerifyFilterByDocTitle({ docTitle: documentRevisionName });
      cy.dlVerifyDocCounter({ docCounterNumber: 2 });
    });

    it(`Verify filter for ${Type}`, () => {
      cy.dlClearFilters();
      cy.dlFilterByType({ type: "CP" });
      cy.dlVerifyFilterByType({ type: "CP" });
      cy.dlVerifyDocCounter({ docCounterNumber: 2 });
    });

    it(`Verify filter for ${Owner}`, () => {
      cy.dlClearFilters();
      cy.dlFilterByOwner({ owner: USERS[2].name });
      cy.dlVerifyFilterByOwner({ owner: USERS[2].name });
      cy.dlVerifyDocCounter({ docCounterNumber: 3 });
    });

    it("Verify filter for AR ID", () => {
      cy.dlClearFilters();
      cy.dlFilterByArId({ arId: "AR99999" });
      cy.dlVerifyFilterByArId({ arId: "AR99999" });
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for status", () => {
      cy.dlClearFilters();
      cy.dlFilterByStatus({ status: "Released" });
      cy.dlVerifyFilterByStatus({ status: "Released" });
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filters for Doc list", () => {
      it(`Verify filter for ${docIdStr}`, () => {
        cy.dlFilterByDocId({ docId: "CP-00003" });
        cy.dlVerifyFilterByDocId({ docId: "CP-00003" });
        cy.dlFilterByRev({ revision: "1" });
        cy.dlVerifyFilterByRev({ revision: "1" });
        cy.dlFilterByDocTitle({ docTitle: documentRevisionName });
        cy.dlVerifyFilterByDocTitle({ docTitle: documentRevisionName });
        cy.dlFilterByType({ type: "CP" });
        cy.dlVerifyFilterByType({ type: "CP" });
        cy.dlFilterByOwner({ owner: USERS[2].name });
        cy.dlVerifyFilterByOwner({ owner: USERS[2].name });
        cy.dlFilterByStatus({ status: "Draft" });
        cy.dlVerifyFilterByStatus({ status: "Draft" });
      });

      it("Verify filter for AR ID", () => {
        cy.alFilterByArId({ arId: "AR99999" });
        cy.alVerifyFilterByArId({ arId: "AR99999" });
        cy.alFilterByTitle({ title: approvalRequestName });
        cy.alVerifyFilterByTitle({ title: approvalRequestName });
        cy.alFilterByOwner({ owner: USERS[2].name });
        cy.alVerifyFilterByOwner({ owner: USERS[2].name });
        cy.alFilterByStatus({ status: LINE_ITEMS_STATUS_TYPES.CLOSED });
        cy.alVerifyFilterByStatus({ status: LINE_ITEMS_STATUS_TYPES.CLOSED });
      });
    });

    it("Verify that user is able to click button 'Clear Filters' and all filters should be cleared", () => {
      cy.get(`button[data-cy="clearFilter"]`).should(`${EXIST}`).click();
    });

    it("Verify that each filter for each column in the landing page is functional", () => {
      cy.dlFilterByRev({ revision: "1" });
      cy.dlVerifyFilterByRev({ revision: "1" });
      cy.dlFilterByDocId({ docId: "CP-00003" });
      cy.dlVerifyFilterByDocId({ docId: "CP-00003" });
      cy.dlFilterByType({ type: "CP" });
      cy.dlVerifyFilterByType({ type: "CP" });
    });

    it("Verify that 'Export List' button is visible and enabled", () => {
      cy.get(`button[data-cy="document.revision.export.list"]`).should(`${EXIST}`);
    });
  });

  context("Click on the three dots", () => {
    it(`Verify hide on ${docIdStr}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${docIdStr}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item").contains("Hide Column").arrowClick();
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${docIdStr}`);
    });

    it(`Verify unhide on ${docIdStr}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${docIdStr}`);
      cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
      cy.get("ul>li[role=menuitem]").contains("DOC ID").parents("li").find("svg").arrowClick();
      cy.get("body").type("{esc}");
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${docIdStr}`);
    });

    it(`Verify freeze on ${docIdStr}`, () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${docIdStr}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${Rev}`);
    });

    it(`Verify un-freeze on ${docIdStr}`, () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${Rev}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${docIdStr}`);
    });
  });

  context("Click on the three dots on the column that have Select option and click", () => {
    it("Group column, Hide and Freeze column should be invoked", () => {
      cy.get(`th[aria-colindex="4"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").contains("Group Column");
      cy.get("div.k-columnmenu-item").contains("Hide Column");
      cy.get("div.k-columnmenu-item").contains("Freeze Column");
    });

    it("Verify the filter on textbox", () => {
      cy.get(".k-textbox").eq(0).click();
    });

    it("Click on the filter icon", () => {
      cy.get(".k-select").eq(0).click();
    });

    it("Dropdown list with tooltip should appear and contains:", () => {
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
      cy.dlClearFilters();
    });

    it(`Verify ${docIdStr} "Is equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("FM-00002");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Does not contain" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("FM-00002");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("FM-00002");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Starts with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("FM-00002");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Ends with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("FM-00002");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify that column with Select field have disabled crossed filter icon`, () => {
      cy.get(`span.k-icon.k-i-filter-clear`).eq(0).should(`${EXIST}`);
    });
  });
});
