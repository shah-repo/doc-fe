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

const documentRevisionName = "AR Form";
const secondDocumentRevName = "Second document for testing";
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
              {
                documentTypeName: "Record Document",
                documentTypeAcronym: "RD-",
                category: "Record",
                group: "RECORD",
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
    it("Verify description on hover", () => {
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

    it("Hover over the AR title", () => {
      cy.get(`th[role="columnheader"]`).eq(0).realHover().should("have.text", "AR ID");
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

    it("Column grouping", () => {
      cy.pause();
      cy.get(`th[aria-colindex="4"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column").click();
      cy.pause();
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

  context("Records Sorting", () => {
    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    context("Create first Record with form", () => {
      context("Start document creation flow", () => {
        it("Navigates to document list", () => {
          cy.navigToDocumentList();
        });

        it("Clicks on 'create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context("Fill in document attributes", () => {
        it("Enters title 'Lot History Record'", () => {
          cy.drEnterDocumentTitle({ name: "Lot History Record" });
        });

        it("Enters description 'Lot History Record description'", () => {
          cy.drEnterDocumentDescription({ description: "Lot History Record description" });
        });

        it("Selects 'Form' document type from dropdown", () => {
          cy.drSelectDocumentType({ documentType: "Form" });
        });

        it("Selects 'Record Document' output document type from dropdown", () => {
          cy.drSelectOutputDocumentType({ documentType: "Record Document" });
        });

        it("Select 'Numeric' revision stage", () => {
          cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
        });

        it("Verify approvals field is automatically added", () => {
          SystemRequirement("REQ-0980");
          cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
        });

        context("Creates document and releases it", () => {
          it("Click create document after filling document", () => {
            cy.drClickCreateDocumentWithApiCall();
          });

          it("Approve and Release document", () => {
            cy.drApproveAndReleaseDocumentWithoutSelectingForm();
          });
        });
      });
    });

    context("Create new record without inline approval form and check if they are in alpha revision", () => {
      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Create new record button click", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select 'Approval Record' form", () => {
        cy.recSelectRecordFormFromMultiSelect({ recordType: "Record Document" });
      });

      it("Check if revision is in alpha revision stage", () => {
        SystemRequirement("REQ-1030");
        cy.recCheckRevisionStage({ stage: "Revision A" });
      });

      it("Navigate to Records", () => {
        cy.navigToRecords();
      });
    });

    context("Sort 'ID'", () => {
      it("Navigate to Records landing page", () => {
        cy.navigToRecords();
      });

      it("ID should be in ascending order", () => {
        cy.contains("ID").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 7 });
      });

      it("ID should be in descending order", () => {
        cy.contains("ID").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 7 });
      });
    });

    context("Sort 'Revision'", () => {
      it("Revision should be in ascending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 7 });
      });

      it("Revision should be in descending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 7 });
      });
    });

    context("Sort 'State'", () => {
      it("State should be in ascending order", () => {
        cy.contains("State").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 7 });
      });

      it("State should be in descending order", () => {
        cy.contains("State").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 7 });
      });
    });


    context("Sort 'Title'", () => {
      it("Title should be in ascending order", () => {
        cy.contains("Title").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Title").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 7 });
      });

      it("Title should be in descending order", () => {
        cy.contains("Title").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Title").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 7 });
      });
    });

    context("Sort 'Owner'", () => {
      it("Owner should be in ascending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 7 });
      });

      it("Owner should be in descending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 7 });
      });
    });

    context("Sort 'Released Date'", () => {
      it("Released Date should be in ascending order", () => {
        cy.contains("Released Date").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Released Date").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 5, colLength: 7 });
      });

      it("Released Date should be in descending order", () => {
        cy.contains("Released Date").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Released Date").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 5, colLength: 7 });
      });
    });

    context("Sort 'Form ID'", () => {
      it("Form ID should be in ascending order", () => {
        cy.contains("Form ID").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Form ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 7 });
      });

      it("Form ID should be in descending order", () => {
        cy.contains("Form ID").eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains("Form ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 7 });
      });
    });
  });

  context("Verify filters on each field", () => {
    it(`Verify filter for ${docIdStr}`, () => {
      cy.dlFilterByDocId({ docId: "RD-00006" });
      cy.dlVerifyFilterByDocId({ docId: "RD-00006" });
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it(`Verify filter for ${Rev}`, () => {
      cy.dlClearFilters();
      cy.dlFilterByRev({ revision: "A" });
      cy.dlVerifyFilterByRev({ revision: "A" });
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it(`Verify filter for ${Owner}`, () => {
      cy.dlClearFilters();
      cy.dlFilterByOwner({ owner: USERS[2].name });
      cy.dlVerifyFilterByOwner({ owner: USERS[2].name });
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify that user is able to click button 'Clear Filters' and all filters should be cleared", () => {
      cy.get(`button[data-cy="clearFilter"]`).should(`${EXIST}`).click();
    });

    it("Verify that each filter for each column in the landing page is functional", () => {
      cy.dlFilterByRev({ revision: "A" });
      cy.dlVerifyFilterByRev({ revision: "A" });
      cy.dlFilterByDocId({ docId: "RD-00006" });
      cy.dlVerifyFilterByDocId({ docId: "RD-00006" });
      cy.dlClearFilters();
    });

    it("Verify that 'Export List' button is visible and enabled", () => {
      cy.get(`button[data-cy="document.revision.export.list"]`).should(`${EXIST}`);
    });
  });

  context("Click on the three dots", () => {
    it(`Verify hide on ID`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", "ID");
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item").contains("Hide Column").arrowClick();
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${Rev}`);
    });

    it(`Verify unhide on ID`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${Rev}`);
      cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
      cy.get("ul>li[role=menuitem]").contains("ID").parents("li").find("svg").arrowClick();
      cy.get("body").type("{esc}");
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", "ID");
    });

    it(`Verify freeze on ID`, () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `ID`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${Rev}`);
    });

    it(`Verify un-freeze on ID`, () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${Rev}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `ID`);
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
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Does not contain" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("RD-00006");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("RD-00006");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Starts with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("RD-00006");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Ends with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("RD-00006");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify that column with Select field have disabled crossed filter icon`, () => {
      cy.get(`span.k-icon.k-i-filter-clear`).eq(0).should(`${EXIST}`);
    });
  });
});
