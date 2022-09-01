// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let secondEmployee;
let adminEmployee;
let RDdocumentType;

const currentTime = moment().tz("America/Los_Angeles").format("hh:mm:ss A");

context("Record inline Flow", () => {
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
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
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

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add first inline approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "Inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[3].name });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbAddNewFieldButton();
      });

      it("Add second inline approval", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
        cy.fbEnterNameValue({ name: "label", value: "Second inline field" });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[2].name });
        cy.fbAddApproverToInlineDialog({ approverName: USERS[3].name });
        cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
        cy.fbAddField();
      });
    });

    context("Release form", () => {
      it("Approve and release form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create record", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Click on create new and chose 'Record one'", () => {
      cy.recCreateRecordFromLandingPage();
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Record one" });
    });
  });

  context("Click save document and verify WIP Statusbar items", () => {
    // it("Click save document", () => {
    //   cy.drClickCreateDocumentWithApiCallForForms();
    // });

    // it(`Check last Saved Time`, () => {
    //   cy.get(".makeStyles-lastEdited").should("contain.text", currentTime);
    // });

    it(`Check doc status as ${STATUS_TYPES_LABEL.WIP}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
      cy.pause();
    });

    // it("Verify left side of Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
    //   cy.verifyListItemExistsOnHeader({
    //     listItem:
    //       `Records RD-00003 Rev 1WIP`,
    //     breadcrump: true,
    //   });
    // });

    // it(`Verify 'Last saved: ' exist in statusbar`, () => {
    //   cy.get("[class*=\"makeStyles-lastEdited\"]").contains(`Last saved: `);
    // });

    // it(`Check the last saved time less less than 2 mins`, () => {
    //   cy.get("[class*=\"makeStyles-lastEdited\"]").contains("Last saved: ").then(($el: any) => {
    //     const timeDuration = $el.text().trim().match(/Last saved: (.*)/)[1].trim();
    //     expect(timeDuration).isBetween(currentTime, lastSavedTime).format("mm");
    //     //  moment(end.diff(startTime)).format("m[m] s[s]")
    //     const duration = moment(currentTime.diff(lastSavedTime)).format("hh:mm:ss a");
    //     cy.log(duration);
    //     // const timeDiff = currentTime.diff(lastSavedTime, "minutes");
    //   });
    // });

    it(`Click on 3 dots and verify 'Void' option exists`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy=\"void-button\"]").should("be.visible");
      cy.get("[data-cy=\"void-button\"]").arrowClick();
      cy.get("button[data-cy=\"AlertDialog-cancelButton\"]").arrowClick();
    });

    it("Check if 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[class*="MuiButtonBase-root MuiIconButton-root makeStyles-closeIcon"]`).arrowClick();
    });

    it("Check if 'Send To Email' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it("Verify popup message \"File will be sent to your email shortly.\"", () => {
      cy.checkToastMessageContains({
        message: "File will be sent to your email shortly.",
      });
    });

    it("Scroll down to the bottom of the page", () => {
      cy.get("[class*=\"MuiGrid-root makeStyles-formOptionsBox\"]").scrollIntoView();
    });

    // it(`Verify statusbar conataining WIP is still visible`, () => {
    //   cy.get("div[data-cy=\"HeaderInfo-status\"]").should("be.visible");
    // });

    // it(`Verify WIP statusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
    //   cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
    // });
  });

  context("Fill in document attributes", () => {
    it("Enter title 'Record Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "Record Document Revision" });
      cy.unClick();
    });

    it("Click on Save", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select approver for first inline", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
        () => {
          cy.listLoadingElementShouldNotExist();
          cy.get("[name*=\"fb-ia-inline-field\"] input")
            .autocompleteSelect(`${USERS[2].name}`, { force: true });
        });
    });

    it("Select approver for second inline", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
        () => {
          cy.get("[name*=\"fb-ia-second-inline-field\"] input")
            .autocompleteSelect(`${USERS[2].name}`, { force: true });
        });
    });

    it("Send request for approval", () => {
      cy.get("[data-cy=\"form.builder.request.approval\"]").first().arrowClick();
    });

    it("Check inline record creation default to numeric revision", () => {
      cy.drClickRevisionsSidePanel();
      cy.recCheckRevisionStage({ stage: "Revision 1" });
    });

    it("Check approve button is not disabled", () => {
      cy.get("[data-cy=\"fb-control-btn\"]").contains("Approve").should("not.be.disabled");
    });

    it("Click on Save", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });
  });

  context("Approve first Inline Approval", () => {
    it("Approve first Inline Approval", () => {
      cy.inlineApproval();
    });

    // it("Check system creates new major revision after inline approve", () => {
    //   cy.drClickRevisionsSidePanel();
    //   cy.recCheckRevisionStage({ stage: "Revision 2" });
    //   cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).contains("Revision 1")
    //     .and("contain.text", "Last Signed");
    // });
  });

  context("Approve second Inline Approval", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Approve second Inline Approval", () => {
      cy.inlineApproval();
    });

    // it("Check system creates new major revision after inline approve", () => {
    //   cy.drClickRevisionsSidePanel();
    //   cy.recCheckRevisionStage({ stage: "Revision 2" });
    //   cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).contains("Revision 1")
    //     .and("contain.text", "Last Signed");
    // });
  });

  context("Approve and Release document", () => {
    it("Approve and release it", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.drClickRevisionsSidePanel();
        cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(1).arrowClick();
      });

      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.drClickRevisionsSidePanel();
        cy.get("[data-cy=\"DocumentRevisionList-item\"]").eq(0).arrowClick();
      });
      cy.recApproveAndReleaseInlineRecord();
    });
  });

  context("Check only last record is shown on list and that it is in alpha state", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Check if there is only one record in list", () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it("Filter record by name and status, and select it", () => {
      cy.recFilterByTitle({ revision: "Record Document Revision" });
      cy.wait(1000);
      cy.recFilterByStatus({ status: "Released" });
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.DocPreview,
        CyRoutes.GetRequiredApproversDocRev,
      ], () => {
        cy.get("tr.k-master-row").first().arrowClick();
      });
    });

    it("Verify record is in alpha state", () => {
      cy.drClickRevisionsSidePanel();
      cy.recCheckRevisionStage({ stage: "Revision A" });
    });
  });
});

export { };


