// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { LINE_ITEMS_STATUS_TYPES } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let secondEmployee;
let componentSpecificationDocumentType;
let group;

const documentRevisionName = "AR Form";
const secondDocumentRevName = "Second document for testing";
const ddTitle = "DD Test";
const docTypeOne = "Design Document";
const docIdStr = "DOC ID";
const rev = "REVISION";
const docTitle = "DOCUMENT TITLE";
const type = "TYPE";
const owner = "OWNER";
const arId = "AR ID";
const status = "STATUS";
const effectiveDate = "EFFECTIVE DATE";
const state = "STATE";
const title = "TITLE";
const relDate = "RELEASED DATE";
const formId = "FORM ID";
const currentDate = moment().tz("America/Los_Angeles").format("l");
const approvalRequestName2 = "AR Form";
const cpDocId = "CP-00003";
const arTitle = "AR TITLE";
const rmId = "RD-00007";
const id = "ID";

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
              ClinicalProtocolNotRedline,
              RecordDocumentType,
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
              docId: `${cpDocId}`,
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

    it("The user should not be able to edit line items dynamically", () => {
      cy.get(`th[role="columnheader"]`).eq(0).find("svg").should("not.exist");
    });

    it("Verify all the columns", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${docIdStr}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${rev}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${docTitle}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${type}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${owner}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${arId}`);
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", `${status}`);
      cy.get(`th[role="columnheader"]`).eq(7).should("have.text", `${effectiveDate}`);
    });

    it("Verify that the Document List filter to display released documents when starting a new Enlil session", () => {
      cy.dlVerifyFilterByStatus({ status: "Released" });
    });
  });

  context("Verify most recent edited document is first on list", () => {
    it("Verify first document is: " + documentRevisionName, () => {
      cy.dlVerifyFilterByDocTitle({ docTitle: documentRevisionName });
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
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get(`button[data-cy="document.revision.create"]`).should("exist");
    });

    it(`Verify drag and drop`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "CP-");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "CP-");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
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
      cy.get(".k-group-indicator").eq(0).should("have.text", "Type");
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
      cy.drEnterDocumentTitle({ name: `${ddTitle}{enter}` });
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

    it("Approve and release document with selecting approver", () => {
      cy.drApproveAndReleaseDocumentWithSelectingApprover([`${USERS[1].name}`]);
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Verify that the system displays only documents in the documents list with corresponding data", () => {
      cy.navigToDocumentList();
      cy.dlClearFilters();
      cy.get(`td[data-grid-col-index="0"]`).first().should("contain.text", "FM-" );
      cy.get(`td[data-grid-col-index="0"]`).eq(1).should("contain.text", "CP-" );
      cy.get(`td[data-grid-col-index="0"]`).eq(2).should("contain.text", "CP-" );
      cy.get(`td[data-grid-col-index="0"]`).eq(3).should("contain.text", "FM-" );
    });
  });

  context("Verify filters on each field", () => {
    context("Check docId filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by docId", () => {
        cy.dlFilterByDocId({ docId: `${cpDocId}` });
      });

      it("Verify filter by docId", () => {
        cy.dlVerifyFilterByDocId({ docId: `${cpDocId}` });
      });

      it("Verify document counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check revision filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by revision", () => {
        cy.dlFilterByRev({ revision: "1" });
      });

      it("Verify filter by revision", () => {
        cy.dlVerifyFilterByRev({ revision: "1" });
      });

      it("Verify document counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 4 });
      });
    });

    context("Check document title filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: documentRevisionName });
      });

      it("Verify filter by document title", () => {
        cy.dlVerifyFilterByDocTitle({ docTitle: documentRevisionName });
      });

      it("Verify document counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 2 });
      });
    });

    context("Check type filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by type", () => {
        cy.dlFilterByType({ type: "CP" });
      });

      it("Verify filter by type", () => {
        cy.dlVerifyFilterByType({ type: "CP" });
      });

      it("Verify document counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 2 });
      });
    });

    context("Check owner filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by owner", () => {
        cy.dlFilterByOwner({ owner: USERS[2].name });
      });

      it("Verify filter by owner", () => {
        cy.dlVerifyFilterByOwner({ owner: USERS[2].name });
      });

      it("Verify document counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 3 });
      });
    });

    context(`Check ${arId} filter`, () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it(`Filter list by ${arId}`, () => {
        cy.dlFilterByArId({ arId: "AR99999" });
      });

      it(`Verify filter by ${arId}`, () => {
        cy.dlVerifyFilterByArId({ arId: "AR99999" });
      });

      it("Verify document counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check status filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by status", () => {
        cy.dlFilterByStatus({ status: "Released" });
      });

      it("Verify filter by status", () => {
        cy.dlVerifyFilterByStatus({ status: "Released" });
      });

      it("Verify document counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check effective date filter", () => {
      it("Clear filters", () => {
        cy.dlClearFilters();
      });

      it("Filter list by effective date", () => {
        cy.dlFilterByEffectiveDate({ effectiveDate: "Last 7 days" });
      });

      it("Verify filter by effective date", () => {
        cy.dlVerifyFilterByEffectiveDate({ effectiveDate: currentDate });
      });

      it("Verify document counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });
  });

  context("Approval Requests", () => {
    it("Navigate to Approval Requests Landing page", () => {
      cy.navigToApprovalRequestList();
    });

    it("Verify that landing pages use the new data table", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify approval request landing page default column headers", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${arId}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${arTitle}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${owner}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${status}`);
      cy.get(".k-indicator-container").eq(0).should("exist");
      cy.get(".k-filtercell-operator").eq(0).should("exist");
    });

    it("Verify that by default the AR list filter to display AR's with latest edited IN_REVIEW ", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "IN_REVIEW");
    });

    it("Hover over the AR title", () => {
      cy.get(`th[role="columnheader"]`).eq(0).realHover().should("have.text", `${arId}`);
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("AR description when the mouse hovers over the AR title", () => {
      cy.alVerifyDescriptionOnHover({ description: "Releasing FM-00002, DD Test" });
    });

    it(`Verify filter by ${arId}`, () => {
      cy.alVerifyFilterByArId({ arId: "AR-00001" });
    });

    it("Navigate from the landing page", () => {
      cy.navigToDocumentList();
    });

    it("Navigate to AR landing page", () => {
      cy.navigToApprovalRequestList();
    });

    it("Verify when navigating away from and back to the approval request list", () => {
      cy.dlClearFilters();
      cy.alVerifyFilterByArId({ arId: "AR-00001" });
      cy.navigToDocumentList();
      cy.navigToApprovalRequestList();
    });

    it("Verify that Button 'Clear Filter', 'Export List' and 'Create an Approval Request' are present", () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get(`button[data-cy="change.request.create"]`).should("exist");
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it(`Verify drag and drop ${id} header on second slot`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "AR-00001");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "AR-00001");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
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
    });

    it("The system shall allow the user to open an AR from the AR list", () => {
      cy.dlClearFilters();
      cy.get(".k-master-row").eq(0).arrowClick();
    });

    it("Verify that the system displays only AR in the AR list with corresponding data", () => {
      cy.navigToApprovalRequestList();
      cy.dlClearFilters();
      cy.get(`td[data-grid-col-index="0"]`).first().should("contain.text", "AR-00001" );
    });
  });

  context("Check for filters on approver request list", () => {
    context(`Check ${arId} filter`, () => {
      it(`Filter list by ${arId}`, () => {
        cy.alFilterByArId({ arId: "AR99999" });
      });

      it(`Verify filter by ${arId}`, () => {
        cy.alVerifyFilterByArId({ arId: "AR99999" });
      });

      it("Verify approval counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check AR title filter", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Filter list by TITLE", () => {
        cy.alFilterByTitle({ title: approvalRequestName2 });
      });

      it("Verify filter by TITLE", () => {
        cy.alVerifyFilterByTitle({ title: approvalRequestName2 });
      });

      it("Verify approval counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check OWNER filter", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Filter list by OWNER", () => {
        cy.alFilterByOwner({ owner: USERS[1].name });
      });

      it("Verify filter by OWNER", () => {
        cy.alVerifyFilterByOwner({ owner: USERS[1].name });
      });

      it("Verify approval counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check STATUS filter", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Filter list by STATUS", () => {
        cy.alFilterByStatus({ status: "CLOSED" });
      });

      it("Verify filter by STATUS", () => {
        cy.alVerifyFilterByStatus({ status: "CLOSED" });
      });

      it("Verify approval counter on document list", () => {
        cy.dlVerifyDocCounter({ docCounterNumber: 1 });
      });
    });

    context("Check clear button is clearing all filters", () => {
      it("Clear filters", () => {
        cy.alClearFilters();
      });

      it("Verify filters are cleared", () => {
        cy.alVerifyFilterClear();
      });
    });
  });

  context("Records", () => {
    it("Navigate to Records landing page", () => {
      cy.navigToRecords();
    });

    it("Verify all the columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${id}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${rev}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${state}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${title}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${owner}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${relDate}`);
    });

    it("Verify that Button 'Clear Filter', 'Export List' and 'Create a Record' are present", () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get("#DocumentByTypeListPresenter-openDocRev").realHover().should("exist");
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
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify approvals field is automatically added", () => {
          cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Create second Record with form", () => {
      context("Start document creation flow", () => {
        it("Navigates to document list", () => {
          cy.navigToDocumentList();
        });

        it("Clicks on 'create a document' button", () => {
          cy.cmpClickCreateNewDocument();
        });
      });

      context("Fill in document attributes", () => {
        it("Enters title 'Approval Record'", () => {
          cy.drEnterDocumentTitle({ name: "Approval Record" });
        });

        it("Enters description 'Approval Record description'", () => {
          cy.drEnterDocumentDescription({ description: "Approval Record description" });
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
      });

      context("Creates document and releases it", () => {
        it("Click create document after filling document", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        it("Verify approvals field is automatically added", () => {
          cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
        });

        it("Approve and Release document", () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context("Check if there are multiple record forms to select", () => {
      it("Navigate to Records", () => {
        cy.navigToRecords();
      });

      it("Create new record button click", () => {
        cy.recCreateRecordFromLandingPage();
      });
    });

    context("Create new record without inline approval form and check if they are in alpha revision", () => {
      it("Select 'Approval Record' form", () => {
        cy.recSelectRecordFormFromMultiSelect({ recordType: "Record Document", recordForm: "Approval Record" });
      });

      it("Check if revision is in alpha revision stage", () => {
        cy.drClickRevisionsSidePanel();
        cy.recCheckRevisionStage({ stage: "Revision A" });
      });
    });

    context("Fill in record attributes and release document", () => {
      it("Enters title 'Approval Record title'", () => {
        cy.drEnterDocumentTitle({ name: "Approval Record title" });
        cy.unClick();
      });

      it("Add first Approver'", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("release button click'", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });
    });

    context("Create second Record with Draft state", () => {
      it("Navigate to Document List", () => {
        cy.navigToDocumentList();
      });

      it("Filter list by TITLE as Approval Record", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: "Approval Record" });
      });

      it("Click on Approval Record", () => {
        cy.get(`.k-master-row`).first().arrowClick();
      });

      it("Clicks on 'create New' button", () => {
        cy.drCreateNewDocumentFromFormRecord();
      });

      it("Enters title as Approval Record title", () => {
        cy.drEnterDocumentTitle({ name: "AR title" });
      });

      it("Enters description", () => {
        cy.drEnterDocumentDescription({ description: "Approval Record description" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Navigate to Records", () => {
        cy.navigToRecords();
      });
    });

    context("Drag and Drop", () => {
      it(`Verify drag and drop`, () => {
        cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "RD-");
        cy.dragAndDrop({
          fromSelector: `th[aria-colindex="1"][role]>span>span`,
          toSelector: `th[aria-colindex="2"][role]>span>span`,
        });
        cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "RD-");
        cy.dragAndDrop({
          fromSelector: `th[aria-colindex="2"][role]>span>span`,
          toSelector: `th[aria-colindex="1"][role]>span>span`,
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

    context(`Sort ${id}`, () => {
      it("Navigate to Records landing page", () => {
        cy.navigToRecords();
      });

      it(`${id} should be in ascending order`, () => {
        cy.contains(`${id}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${id}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 7 });
      });

      it(`${id} should be in descending order`, () => {
        cy.contains(`${id}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${id}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 7 });
      });
    });

    context(`Sort '${rev}'`, () => {
      it(`${rev} should be in ascending order`, () => {
        cy.contains(`${rev}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${rev}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 7 });
      });

      it(`${rev} should be in descending order`, () => {
        cy.contains(`${rev}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${rev}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 7 });
      });
    });

    context(`Sort '${state}'`, () => {
      it(`${state} should be in ascending order`, () => {
        cy.contains(`${state}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${state}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 7 });
      });

      it(`${state} should be in descending order`, () => {
        cy.contains(`${state}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${state}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 7 });
      });
    });

    context(`Sort '${title}'`, () => {
      it(`${title} should be in ascending order`, () => {
        cy.contains(`${title}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${title}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 8 });
      });

      it(`${title} should be in descending order`, () => {
        cy.contains(`${title}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${title}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 8 });
      });
    });

    context(`Sort ${owner}`, () => {
      it(`${owner} should be in ascending order`, () => {
        cy.contains(`${owner}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${owner}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 7 });
      });

      it(`${owner} should be in descending order`, () => {
        cy.contains(`${owner}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${owner}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 7 });
      });
    });

    context(`Sort '${relDate}'`, () => {
      it(`${relDate} should be in ascending order`, () => {
        cy.contains(`${relDate}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${relDate}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 5, colLength: 7 });
      });

      it(`${relDate} should be in descending order`, () => {
        cy.contains(`${relDate}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${relDate}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 5, colLength: 7 });
      });
    });

    context(`Sort ${formId}`, () => {
      it(`${formId} should be in ascending order`, () => {
        cy.contains(`${formId}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${formId}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 7 });
      });

      it(`${formId} should be in descending order`, () => {
        cy.contains(`${formId}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${formId}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 7 });
      });
    });
  });

  context("Verify filters on each field", () => {
    it(`Verify filter for ${docIdStr}`, () => {
      cy.dlFilterByDocId({ docId: `${rmId}` });
      cy.dlVerifyFilterByDocId({ docId: `${rmId}` });
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it(`Verify filter for ${rev}`, () => {
      cy.dlClearFilters();
      cy.dlFilterByRev({ revision: "A" });
      cy.dlVerifyFilterByRev({ revision: "A" });
      cy.dlVerifyDocCounter({ docCounterNumber: 2 });
    });

    it(`Verify filter for state`, () => {
      cy.dlClearFilters();
      cy.get(`th[aria-colindex="3"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="3"] span.k-input`).arrowClick();
      cy.get("ul>li[role=option]").contains("Draft").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="3"] span.k-input`).should("have.text", "Draft");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify filter for Title`, () => {
      cy.dlClearFilters();
      cy.get(`th[aria-colindex="4"] span.k-input`).should("have.text", "");
      cy.filterLandingPageColumnFilter({ colIndex: 4, input: "Approval Record title" });
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="4"]`).find(`input[class="k-textbox"]`)
        .should("have.attr", "value", "Approval Record title");
      cy.get(`[data-grid-row-index="0"]`).should("contain", "Approval Record title");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify filter for ${owner}`, () => {
      cy.dlClearFilters();
      cy.dlFilterByOwner({ owner: USERS[2].name });
      cy.dlVerifyFilterByOwner({ owner: USERS[2].name });
      cy.dlVerifyDocCounter({ docCounterNumber: 2 });
    });

    it(`Verify filter for Released Date`, () => {
      cy.dlClearFilters();
      cy.get(`th[aria-colindex="6"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="6"] span.k-input`).arrowClick();
      cy.get("ul>li[role=option]").contains("Last 7 days").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="6"] span.k-input`).should("have.text", "Last 7 days");
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify filter for Form ID`, () => {
      cy.dlClearFilters();
      cy.get(`th[aria-colindex="7"] span.k-input`).should("have.text", "");
      cy.filterLandingPageColumnFilter({ colIndex: 7, input: "FM-00006" });
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="7"]`).find(`input[class="k-textbox"]`).should("have.attr", "value", "FM-00006");
      cy.get(`[data-grid-row-index="0"]`).should("contain", "FM-00006");
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify that user is able to click button 'Clear Filters' and all filters should be cleared", () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist").click();
      cy.get(`th[aria-colindex="1"] span.k-input`).should("have.text", "");
      cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "");
      cy.get(`th[aria-colindex="3"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="4"] span.k-input`).should("have.text", "");
      cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "");
      cy.get(`th[aria-colindex="6"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="7"] span.k-input`).should("have.text", "");
    });

    it("Verify that each filter for each column in the landing page is functional", () => {
      cy.dlFilterByRev({ revision: "A" });
      cy.dlVerifyFilterByRev({ revision: "A" });
      cy.dlFilterByDocId({ docId: `${rmId}` });
      cy.dlVerifyFilterByDocId({ docId: `${rmId}` });
      cy.dlClearFilters();
    });

    it("Verify that 'Export List' button is visible and enabled", () => {
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
    });
  });

  context("Click on the three dots", () => {
    it(`Verify hide on ${id}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${id}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item").contains("Hide Column").arrowClick();
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${rev}`);
    });

    it(`Verify unhide on ${id}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${rev}`);
      cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
      cy.get("ul>li[role=menuitem]").contains(`${id}`).parents("li").find("svg").arrowClick();
      cy.get("body").type("{esc}");
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${id}`);
    });

    it(`Verify freeze on ${id}`, () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${id}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${rev}`);
    });

    it(`Verify un-freeze on ${id}`, () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${rev}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${id}`);
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
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
      cy.dlClearFilters();
    });

    it(`Verify ${docIdStr} "Is equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
      cy.filterLandingPageColumnFilter({ colIndex: 1, input: rmId });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Does not contain" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
      cy.filterLandingPageColumnFilter({ colIndex: 1, input: rmId });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
      cy.filterLandingPageColumnFilter({ colIndex: 1, input: rmId });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Starts with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
      cy.filterLandingPageColumnFilter({ colIndex: 1, input: rmId });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Ends with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
      cy.filterLandingPageColumnFilter({ colIndex: 1, input: rmId });
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify ${docIdStr} "Is not empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify that column with Select field have disabled crossed filter icon`, () => {
      cy.get(`span.k-icon.k-i-filter-clear`).eq(0).should("exist");
    });
  });
});
