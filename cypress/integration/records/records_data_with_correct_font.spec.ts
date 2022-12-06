/* eslint-disable max-len */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { FONT_SIZE_10, FONT_SIZE_12, FONT_SIZE_14, FONT_SIZE_16, FONT_WT_400, FONT_WT_600, FONT_WT_700, LINE_HT_13, LINE_HT_15, LINE_HT_15_12, LINE_HT_17_1419, LINE_HT_18, LINE_HT_19_2, LINE_HT_20, LINE_HT_20_02, LINE_HT_21, LINE_HT_24, LINE_HT_25_6, sora, soraSansserif, TEXT_TRANS_UPPER } from "../../utils/constants/fonts_constants";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let RDdocumentType;

const docId = "ID";
const docRevision = "REVISION";
const docState = "STATE";
const docTitle = "TITLE";
const docOwner = "OWNER";
const ReleasedDate = "RELEASED DATE";
const formId = "FORM ID";

context("records_data_with_correct_font", () => {
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
              RecordOne,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          RDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record one");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("[API]Update record document type", () => {
    it("Change fields config in record document type", () => {
      cy.drUpdateDocumentTypeName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        id: RDdocumentType[0].id,
        payload: {
          fieldsConfig: {
            D: {
              visible: false,
              required: false,
            },
            E: {
              label: "Record Type",
              visible: true,
              required: true,
            },
            F: {
              label: "Record ID",
              visible: false,
              required: true,
            },
            G: {
              visible: false,
              required: false,
            },
            I: {
              visible: false,
            },
            J: {
              visible: false,
            },
            K: {
              label: "Void",
              visible: true,
            },
            L: {
              label: "Correction",
              visible: true,
            },
            N: {
              label: "Finalize and Release",
              visible: true,
            },
            O: {
              label: "Record History",
              visible: true,
            },
            R: {
              visible: false,
            },
            S: {
              label: "Update Record",
              visible: true,
            },
            A1: {
              label: "WIP",
              visible: true,
            },
            A2: {
              label: "Voided",
              visible: true,
            },
            A3: {
              label: "Archive",
              visible: true,
            },
            P1: {
              label: "WIP",
              visible: true,
            },
            P2: {
              label: "Voided",
              visible: true,
            },
            P3: {
              label: "Archive",
              visible: true,
            },
          },
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("FORM document creation flow", () => {
    context("Start document creation flow", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in document attributes", () => {
      it("Enter title 'Inline Form Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Inline Form Document Revision" });
      });

      it("Enter description 'Inline Form Document Revision description'", () => {
        cy.drEnterDocumentDescription({ description: "Inline Form Document Revision description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Record Document' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Record one" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Open details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add Inline Approval", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.listLoadingElementShouldNotExist();
        cy.fbEnterNameValue({ name: "label", value: "Inline Approval" });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create record", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    context("Verify font for Landing page button", () => {
      it(`Verify 'Create a record' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]")
          .checkStylePropExists({
            content: "Create a record",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"document.revision.export.list\"]")
          .checkStylePropExists({
            content: "Export list",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"clearFilter\"]")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Drag & drop column header to group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_1419} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Drag & drop column header to group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_1419, "font-weight": FONT_WT_400 },
        });
      });
    });

    context("Verify font for Landing page table columns headers", () => {
      it(`Verify ${docId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: docId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${docRevision} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: docRevision,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${docState} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: docState,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${docTitle} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: docTitle,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${docOwner} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: docOwner,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${ReleasedDate} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: ReleasedDate,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${formId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: formId,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });
    });

    context("Select a sample of random items from the landing page", () => {
      it(`Verify 'Create a record' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[id=\"DocumentByTypeListPresenter-openDocRev\"]")
          .checkStylePropExists({
            content: "Create a record",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"document.revision.export.list\"]")
          .checkStylePropExists({
            content: "Export list",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"clearFilter\"]")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });


    context("Fill in document attributes", () => {
      it("Click on create new and chose 'Record one'", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it(`Verify the pop-up 'Choose a Record Type' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="field-selectType"]`)
          .checkStylePropExists({
            content: "Choose a Record Type",
            props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_25_6, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify the Pop-up 'Cancel' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="suggestFormCancelBtn"]`)
          .checkStylePropExists({
            content: "Cancel",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it("Select'Record one' record type", () => {
        cy.recSelectRecordFormFromMultiSelect({ recordType: "Record one" });
      });

      it("Enter title 'Record Document Revision'", () => {
        cy.drEnterDocumentTitle({ name: "Record Document Revision" });
        cy.unClick();
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Select approver for first inline", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
          () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("[name*=\"fb-ia-inline-approval-\"] input")
              .autocompleteSelect(`${USERS[1].name}`, { force: true });
          });
      });

      it("Click on Save", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.drClickCreateDocumentWithApiCall();
        });
      });

      it("Approve record button click", () => {
        cy.ebApprove();
      });

      it("Click on ‘Approve & Release’", () => {
        cy.get(`[data-cy="ApproveAndRelease-button"]`).arrowClick().wait(1000);
        cy.get("[data-cy=\"AlertDialog-continueButton\"]").contains("Yes, I'm sure").arrowClick();
      });
    });

    context("All the fields/tabs in the record & buttons in the page", () => {
      it(`Verify 'Update Record' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"updateRecord\"]")
          .checkStylePropExists({
            content: "Update Record",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Attachments' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_19_2} font-weight as ${FONT_WT_600}`, () => {
        cy.checkStylePropExists({
          content: "Attachments",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_19_2, "font-weight": FONT_WT_600 },
        });
      });

      it(`Verify document status 'Released' with font-size ${FONT_SIZE_10} font-family ${soraSansserif}  line-height ${LINE_HT_13} font-weight ${FONT_WT_700}`, () => {
        cy.get(`[data-cy="HeaderInfo-status"]`)
          .checkStylePropExists({
            content: "RELEASED",
            props: { "font-size": FONT_SIZE_10, "font-family": soraSansserif, "line-height": LINE_HT_13, "font-weight": FONT_WT_700 },
          });
      });

      it(`Verify doc-id with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_18} font-weight ${FONT_WT_700}`, () => {
        cy.get(`[data-cy="HeaderInfo-docId"]`)
          .checkStylePropExists({
            content: "RD-00003",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_700 },
          });
      });
    });

    context("Verify The side bar options Revision's fonts", () => {
      it(`Verify Revisions font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"note-icon\"]").arrowClick();
        cy.get("[data-cy=\"document.revision.docVersion\"]")
          .checkStylePropExists({
            content: "Revisions",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Doc ID with font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
        cy.get("[data-cy=\"common.docId\"]").eq(0)
          .checkStylePropExists({
            content: "ID: RD-00003",
            props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify Owner font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
        cy.get("[data-cy=\"DocumentRevisionList-item\"]");
        cy.get("[data-cy=\"revision\"]")
          .checkStylePropExists({
            content: "Owner",
            props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
          });
      });
    });

    context("Verify The side bar options History's fonts", () => {
      it(`Verify ${USERS[1].name} font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="timeline-icon"]`).arrowClick();
        cy.get(`[data-cy="change-key-0"]`)
          .checkStylePropExists({
            content: USERS[1].name,
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Updated status' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="change-key-0-0"]`)
          .checkStylePropExists({
            content: "Updated status",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify 'Set to Released by Giovanni Reynolds' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="change-value-0-0"]`)
          .checkStylePropExists({
            content: "Set to Released by Giovanni Reynolds",
            props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify ${USERS[1].name} font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="change-key-1"]`)
          .checkStylePropExists({
            content: USERS[1].name,
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'form ID' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_700}`, () => {
        cy.get(`[data-cy="change-value-1-0"]`)
          .checkStylePropExists({
            content: "RD-00003",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_700 },
          });
      });

      it(`Verify 'Everyone' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="change-value-1-1"]`)
          .checkStylePropExists({
            content: "Everyone",
            props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
          });
      });
    });

    context("Verify The side bar options Access Permissions fonts", () => {
      it(`Verify 'Access Permissions' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"permission-icon\"]").arrowClick();
        cy.get(`[data-cy="Access Permissions"]`)
          .checkStylePropExists({
            content: "Access Permissions",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Selected Users' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
        cy.checkStylePropExists({
          content: "Selected Users",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
      });

      it(`Verify 'Selected Groups' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="Selected-Groups"]`)
          .checkStylePropExists({
            content: "Selected Groups",
            props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify 'Everyone' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_18} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Everyone",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_18, "font-weight": FONT_WT_400 },
        });
      });
    });

    context("Verify The side bar options Bookmarks's fonts", () => {
      it(`Verify 'Bookmarks' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="bookmark-icon"]`).arrowClick();
        cy.get(`[data-cy="Bookmarks"]`)
          .checkStylePropExists({
            content: "Bookmarks",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify The side bar options 'Revision History' fonts", () => {
      it(`Verify 'Revision History' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="cr-icon"]`).arrowClick();
        cy.get(`[data-cy="Revision History"]`)
          .checkStylePropExists({
            content: "Revision History",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify The side bar options References fonts", () => {
      it("Verify The side bar options References fonts", () => {
        cy.get("[data-cy=\"references-icon\"]").arrowClick();
      });

      it(`Verify the side bar options 'References' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="References"]`)
          .checkStylePropExists({
            content: "References",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify the side bar 'General Info' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="generalInfo"]`)
          .checkStylePropExists({
            content: "General Info",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify the side bar owner font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="user-name"]`)
          .checkStylePropExists({
            content: USERS[1].name,
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify the side bar 'References' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
        cy.checkStylePropExists({
          content: "References",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
      });

      it(`Verify the side bar 'Training' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="training"]`)
          .checkStylePropExists({
            content: "Training",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify the side bar 'Referenced By' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15_12} font-weight ${FONT_WT_600}`, () => {
        cy.checkStylePropExists({
          content: "Referenced By",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15_12, "font-weight": FONT_WT_600 },
        });
      });

      it(`Verify the side bar 'Release Date' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="releaseDate"]`)
          .checkStylePropExists({
            content: "Release Date",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
          });
      });

      it(`Verify the side bar 'Form Info' font-size ${FONT_SIZE_12} font-family ${sora} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[data-cy="output.info"]`)
          .checkStylePropExists({
            content: "Form Info",
            props: { "font-size": FONT_SIZE_12, "font-family": sora, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify The details of each inline", () => {
      it(`Verify the side bar 'Release Details' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_25_6} font-weight ${FONT_WT_600}`, () => {
        cy.checkStylePropExists({
          content: "Release Details",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_25_6,   "font-weight": FONT_WT_600 },
        });
      });

      it(`Verify the side bar 'Released by' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="releasedBy"]`)
          .checkStylePropExists({
            content: "Released by: Giovanni Reynolds",
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
          });
      });

      it(`Verify the side bar 'Released Date' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_20} font-weight ${FONT_WT_400}`, () => {
        const receivingReleasedDate = moment().tz("America/Los_Angeles").format("MM/DD/YYYY");
        cy.get(`[data-cy="releasedDate"]`)
          .checkStylePropExists({
            content: receivingReleasedDate,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_400 },
          });
      });
    });
  });
});

