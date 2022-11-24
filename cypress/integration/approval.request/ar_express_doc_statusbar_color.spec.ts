// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { MPITestProcedureDeletable } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let equipmentDocument;
let materialsDocument;
let developersGroup;

const intDocType = "Clinical Protocol";
const otherFormDocId1 = "CP-00002";
const otherFormName = "form title";
const otherFormDesc = "form description";
const arId1 = "AR-00001";
const otherArName = "Approval request document title";
const otherArDesc = "Approval request document description";
const otherFormDocId2 = "CP-00003";
const otherFormName2 = "other title";
const otherFormDesc2 = "other description";
const otherArName2 = "Approval request document two title";
const otherArDesc2 = "Approval request document two description";

context("Status Bar of New Enlil items approved via express AR", () => {
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
              {
                ...MPITestProcedureDeletable,
                documentTypeAcronym: "MPI-",
              },
              QPITest,
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]Create equipment one", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
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
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create material one", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00004",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: "Material one",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });
  });


  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });
  });

  context(`Form Internal type as Other('${intDocType}')`, () => {
    context(`Create a document with internal type Other(${intDocType}) and 'Alpha' revision stage`, () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on create document", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Enter title ${otherFormName}`, () => {
        cy.drEnterDocumentTitle({ name: otherFormName });
      });

      it(`Enter description as ${otherFormDesc}`, () => {
        cy.drEnterDocumentDescription({ description: otherFormDesc });
      });

      it("Select 'intDocType' document type", () => {
        cy.drSelectDocumentType({ documentType: intDocType });
        cy.unClick();
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });
    });

    context(`Click save document and verify ${STATUS_TYPES_LABEL.DRAFT} Statusbar items`, () => {
      it("Click save document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it(`Check doc Draft status as ${STATUS_TYPES_LABEL.DRAFT}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });
    });

    context(`Verify Statusbar for Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document List${otherFormDocId1} Rev 1DRAFT`,
          breadcrump: true,
        });
      });
    });

    context("Verify “last saved” data is updated each time when auto-saved", () => {
      it(`Change document description as 'Change description'`, () => {
        cy.drEnterDocumentDescription({ description: "Change description" });
      });

      it(`Verify 'Auto-saving, please wait' exist in statusbar`, () => {
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains("Auto-saving, please wait");
      });

      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });

      it("Mark 'Training Required'", () => {
        cy.drClickTrainingRequired();
      });

      it(`Verify 'Auto-saving, please wait' exist in statusbar`, () => {
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains("Auto-saving, please wait");
      });

      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });
    });

    context("Make a change → While it saves the changes it should say “Auto-saving, please wait…", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Mark 'Training Required'", () => {
        cy.drClickTrainingRequired();
      });

      it("Verify Save button in status bar and click on it", () => {
        cy.get(".MuiButton-label").contains("Save");
        cy.get(".MuiButton-label").contains("Save").arrowClick();
      });

      it(`Verify 'Auto-saving, please wait' exist in statusbar`, () => {
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains("Auto-saving, please wait");
      });

      it("Turn on autosave", () => {
        cy.cmpTurnOnAutosave();
      });
    });

    context(`Wait for 2 min. It should display 'Last saved 2 minutes ago'`, () => {
      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });

      xit(`Wait for 1 minute. It should display 'Last saved a minute ago'`, () => {
        cy.wait(60 * 1000 + 2000);
        const tmpRegex = new RegExp(`Last saved a minute ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });

      xit(`Wait for another 1 minute. It should display 'Last saved 2 minutes ago'`, () => {
        cy.wait(60 * 1000 + 2000);
        const tmpRegex = new RegExp(`Last saved 2 minutes ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });
    });

    context(`Verify 'Approve and Release' and 'Save' exists and they are funcational`, () => {
      it("Verify Save button in status bar and click on it", () => {
        cy.get(".MuiButton-label").contains("Save");
        cy.get(".MuiButton-label").contains("Save").arrowClick();
      });

      it("Verify 'Approve and Release' button exists and click on it and select Cancel", () => {
        cy.get("#ApproveAndRelease-button").contains("Approve and Release").should("exist");
        cy.pmSubmitForApprovalWithoutAPI();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.drCloseApproveAndReleaseDialog();
      });
    });

    // eslint-disable-next-line max-len
    context(`Click on 3 dots and verify 'Void' 'Change Owner' and 'Send To Email' options displayed and check their functions`, () => {
      it(`Click on 3 dots and verify 'Void' option exists`, () => {
        SystemRequirement("REQ-2800");
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy=\"void-button\"]").should("be.visible");
        cy.get("[data-cy=\"void-button\"]").arrowClick();
        cy.get("button[data-cy=\"AlertDialog-cancelButton\"]").arrowClick();
      });

      it("Verify the 'Change Owner' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
        cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
        cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
      });

      it("Verify the 'Send To Email' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("Edit all the fields, make sure the “last saved” data is updated each time", () => {
      it(`Change document description as 'Change description 1'`, () => {
        cy.drEnterDocumentDescription({ description: "Change description 1" });
      });

      it(`Verify 'Auto-saving, please wait' exist in statusbar`, () => {
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains("Auto-saving, please wait");
      });

      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });

      it("Mark 'Training Required'", () => {
        cy.drClickTrainingRequired();
      });

      it(`Verify 'Auto-saving, please wait' exist in statusbar`, () => {
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains("Auto-saving, please wait");
      });

      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });

      it("Mark 'Training Required'", () => {
        cy.drClickTrainingRequired();
      });
    });

    context(`Verify the status bar is BLUE`, () => {
      it(`Verify statusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
      });
    });

    context(`Scroll down to the bottom of the page and verify the status bar should be fixed`, () => {
      it("Scroll down to the bottom of the page", () => {
        cy.get("#attachmentHeader").scrollIntoView();
      });

      it(`Verify statusbar conataining DRAFT is still visible`, () => {
        cy.get("[data-cy=\"HeaderInfo-status\"]").contains("DRAFT").should("be.visible");
      });
    });

    context("Make a change, save it. See the time at which it was saved", () => {
      it(`Change document description as 'Change description'`, () => {
        cy.drEnterDocumentDescription({ description: "Change description" });
      });

      it("Click on Save button", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });
    });

    context("Login as user2 and check for 'Last saved' exists in statusbar with time duration", () => {
      it("Logout and login", () => {
        cy.authLogout();
        cy.authLogin({
          email: USERS[2].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter the last document and open it", () => {
        cy.dlClearFilters();
        cy.get(`td[data-grid-col-index="0"]`).contains(otherFormDocId1).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Verify DRAFT Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
          `Document List${otherFormDocId1} Rev 1DRAFT`,
          breadcrump: true,
        });
      });

      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });
    });

    context("Login back to user1 ", () => {
      it("Logs user in", () => {
        cy.authLogout();
        cy.authLogin({
          email: USERS[1].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Verify filter the last document and open it", () => {
        cy.dlClearFilters();
        cy.get(`td[data-grid-col-index="0"]`).contains(otherFormDocId1).arrowClick();
      });
    });

    context("Release the item by clicking “Approve And Release", () => {
      it("Approve and release the document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });
    });

    context(`Verify Statusbar for Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document List${otherFormDocId1} Rev 1${STATUS_TYPES_LABEL.RELEASED}`,
          breadcrump: true,
        });
      });
    });

    context("Right side: 'Revise Document' exists", () => {
      it(`Verify 'Revise Document' exists in statusbar`, () => {
        cy.get(`[data-cy="updateRecord"]`).should("exist");
      });
    });

    context("Right side: Three dots: “Send to Email” and “Change Owner” buttons", () => {
      it("Verify the 'Change Owner' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
        cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
        cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
      });

      it("Verify the 'Send To Email' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("There is no info on whom and when were the last edits made", () => {
      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });

    context("The status bar is GREEN", () => {
      it(`Verify the statusbar background-color as GREEN(${Colors.latest_green_varient})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
      });

      it(`Verify statusbar conataining RELEASED is still visible`, () => {
        cy.get("[data-cy=\"HeaderInfo-status\"]").contains("RELEASED").should("be.visible");
      });
    });

    context(`Scroll down to the bottom of the page and verify the status bar should be fixed`, () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("No attachments").scrollIntoView();
      });
    });

    context(`Revise the item → A new revision is created in “DRAFT”`, () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Check doc Draft status as ${STATUS_TYPES_LABEL.DRAFT}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });
    });

    context("Approve and release the new revision", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Click on the AR ID link → AR opens in a new tab", () => {
      it(`Click on the AR ID link`, () => {
        cy.get("a#ChangeRequestLink-linkButton").should("contain", "AR-").invoke("removeAttr", "target").click();
      });

      it(`Verify AR opens in a new tab`, () => {
        cy.url().should("include", "/preview");
        cy.landingPageLoadingElementShouldNotExist();
        cy.wait(2000);
        cy.go("back");
      });
    });

    context("Open the Superseded revision and check the content of the status bar", () => {
      it("Open revisions tab, click and verify revision 1", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drClickRevisionsSidePanel();
          cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(1).contains("Superseded").arrowClick();
        });
      });
    });

    context(`Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Document List${otherFormDocId1} Rev 1${STATUS_TYPES_LABEL.SUPERSEDED}`,
          breadcrump: true,
        });
      });
    });

    context("Right side: Three dots: “Send to Email” and “Change Owner” buttons", () => {
      it("Verify the 'Change Owner' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
        cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
        cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
      });

      it("Verify the 'Send To Email' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("There is no info on whom and when were the last edits made", () => {
      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });

    context("The status bar is GREEN", () => {
      it(`Verify the statusbar background-color as GREEN(${Colors.latest_green_varient})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
      });
    });

    context(`Scroll down the page → The status bar should be fixed`, () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("No attachments").scrollIntoView();
      });

      it(`Verify statusbar conataining ${STATUS_TYPES_LABEL.SUPERSEDED} is still visible`, () => {
        cy.get("[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.SUPERSEDED).should("be.visible");
      });
    });

    context(`Open the Released revision document`, () => {
      it("Open the Released revision document", () => {
        cy.drClickRevisionsSidePanel();
        cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(0).contains("Released").arrowClick();
      });
    });

    context("Revise the item and select the 'Obsolete' revision stage", () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Select 'Obsolete' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context("Approve and release the new 'OBS' revision", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context(`Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify OBS Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Document List${otherFormDocId1} Rev OBS${STATUS_TYPES_LABEL.OBSOLETE}`,
          breadcrump: true,
        });
      });
    });

    context("Verify Three dots: “Send to Email” and “Change Owner” buttons", () => {
      it(`Verify 'Change Owner' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      });

      it(`Verify 'Send to Email' exists in statusbar`, () => {
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });
    });

    context("There is no info on whom and when were the last edits made", () => {
      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });

    context("Verify the status bar is RED", () => {
      it(`Verify the statusbar background-color as RED(#EC2B00)`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
      });
    });

    context(`Scroll down the page → The status bar should be fixed`, () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("No attachments").scrollIntoView();
      });

      it(`Verify statusbar conataining ${STATUS_TYPES_LABEL.OBSOLETE} is still visible`, () => {
        cy.get(`[data-cy="HeaderInfo-status"]`).contains(STATUS_TYPES_LABEL.OBSOLETE).should("be.visible");
      });
    });

    context(`Create a new document of type other(${intDocType})`, () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enter title ${otherFormName2}`, () => {
        cy.drEnterDocumentTitle({ name: otherFormName2 });
      });

      it(`Enter description ${otherFormDesc2}`, () => {
        cy.drEnterDocumentDescription({ description: otherFormDesc2 });
      });

      it(`Select ${intDocType} document type from dropdown`, () => {
        cy.drSelectDocumentType({ documentType: intDocType });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context(`Verify ${STATUS_TYPES_LABEL.DRAFT} in Statusbar`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document List${otherFormDocId2} Rev 1${STATUS_TYPES_LABEL.DRAFT}`,
          breadcrump: true,
        });
      });
    });

    context(`Click on 3 dots and Click “Void” and “Yes, I’m sure” and verify Item goes to a “Voided” state`, () => {
      it(`Click on 3 dots and verify 'Void' option exists`, () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy='void-button']").should("be.visible");
        cy.get("[data-cy='void-button']").arrowClick();
        cy.get("[data-cy='AlertDialog-continueButton']").contains("Yes, I'm sure").arrowClick();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.VOIDED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.VOIDED });
      });
    });

    context("Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      it("Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Document List${otherFormDocId2} Rev 1${STATUS_TYPES_LABEL.VOIDED}`,
          breadcrump: true,
        });
      });
    });

    context(`Right side: Click on 3 dots and verify “Send to Email” and “Change Owner” buttons`, () => {
      it("Verify the 'Change Owner' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
        cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
        cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
      });

      it("Verify the 'Send To Email' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });
    });

    context("There is no info on whom and when were the last edits made", () => {
      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });

    context("Verify the status bar is RED", () => {
      it(`Verify the statusbar background-color as RED(#EC2B00)`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
      });
    });
  });

  context(`Form Internal type as Equipment`, () => {
    context("Create MPI document", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the MPI attributes", () => {
      it("Enter title 'MPI document", () => {
        cy.drEnterDocumentTitle({ name: "MPI document" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Manufacturing Process Instructions Test' document type from dropdown", () => {
        SystemRequirement("REQ-3040");
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Add Checkbox group", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
        cy.get("[data-cy=\"options\"]").arrowType("1{enter}" );
        cy.get("[data-cy=\"options\"]").arrowType("2{enter}" );
        cy.get("[data-cy=\"options\"]").arrowType("3{enter}" );
        cy.fbAddNewFieldButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
        cy.fbAddNewFieldButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Text Editor", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbAddNewFieldButton();
      });

      it("Add Date picker", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbAddNewFieldButton();
      });

      it("Add Hyperlink", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
        cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
        cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbAddNewFieldButton();
      });

      it("Add Select Field", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbAddNewFieldButton();
      });

      it("Add Radio Button group", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbAddNewFieldButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Paragraph", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
        cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().arrowType("fb-paragraph");
        cy.fbAddNewFieldButton();
      });

      it("Add File Upload", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
        cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Blank Template Form", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
        cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
        cy.fbAddNewFieldButton();
        cy.elUploadAttachment({ fileName: "TestTemplate.json", el: "fb-attachment-field-fb-blank-template-" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Quantity", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
        cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
        cy.fbAddNewFieldButton();
      });

      it("Add Timer", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
        cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
        cy.fbAddNewFieldButton();
      });
    });

    context("Fill step #1", () => {
      it("Fill step #1 description", () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
      });

      it("Add 'Material one' to step #1", () => {
        cy.mpiAddMaterialDocumentToStep({ numbOfStep: 1, material: "Material one", quntity: "3", unit: "Each" });
      });

      it("Add 'Material parameter' to step #1", () => {
        SystemRequirement("REQ-3620");
        const params = { numbOfStep: 1, material: "Parameter for material two" };

        cy.get("[data-cy=\"form.builder.materials.btn\"]").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy=\"title\"]").arrowType(params.material, { force: true });
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add 'Equipment one' to step #1", () => {
        cy.mpiAddEquipmentToStep({ numbOfStep: 1, equipment: "Equipment one" });
      });

      it("Add 'Equipment parameter' to step #1", () => {
        SystemRequirement("REQ-3620");
        cy.mpiAddEquipmentParameterToStep({ numbOfStep: 1, equipmentDescription: "Equipment parameter" });
      });
    });

    context("Click save document and verify DRAFT Statusbar items", () => {
      it("Click save document", () => {
        SystemRequirement("REQ-3120");
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it(`Check doc Draft status as ${STATUS_TYPES_LABEL.DRAFT}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
        cy.arCheckTitleInEditableAndMatches({ name: "MPI document" });
      });

      it("Verify user1 DRAFT Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document ListMPI-00002 Rev 1DRAFT`,
          breadcrump: true,
        });
      });

      it(`Verify 'Last saved' exist in statusbar with time-duration`, () => {
        cy.verifyLastSavedExists();
      });

      it(`Click on 3 dots and verify 'Void' option exists`, () => {
        SystemRequirement("REQ-2800");
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("[data-cy=\"void-button\"]").should("be.visible");
        cy.get("[data-cy=\"void-button\"]").arrowClick();
        cy.get("button[data-cy=\"AlertDialog-cancelButton\"]").arrowClick();
      });

      it("Check if 'Change Owner' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
        cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
        cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
      });

      it("Check if 'Send To Email' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });

      it("Scroll down to the bottom of the page", () => {
        cy.get("[data-cy='form-options-text']").scrollIntoView();
      });

      it(`Verify statusbar conataining DRAFT is still visible`, () => {
        cy.get("[data-cy=\"HeaderInfo-status\"]").should("be.visible");
      });

      it(`Verify DRAFT statusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
      });
    });

    context("Click on save button and check for 'Last saved' exists in statusbar", () => {
      it(`Change document description as 'Change description'`, () => {
        cy.drEnterDocumentDescription({ description: "Change description" });
      });

      it("Click on Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Verify again user1 'Last saved' exist in statusbar with time-duration`, () => {
        cy.verifyLastSavedExists();
      });
    });

    context("Login as user2 and check for 'Last saved' exists in statusbar with time duration", () => {
      it("Logout and login", () => {
        cy.authLogout();
        cy.authLogin({
          email: USERS[2].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter PART ID as MPI-00002 and open it", () => {
        cy.dlClearFilters();
        cy.get(`td[data-grid-col-index="0"]`).contains("MPI-00002").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Verify DRAFT Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document ListMPI-00002 Rev 1DRAFT`,
          breadcrump: true,
        });
      });

      it(`Verify 'Last saved' exist in statusbar with time-duration`, () => {
        cy.verifyLastSavedExists();
      });
    });

    context("Login back to user1 Release MPI and check RELEASED status", () => {
      it("Logs user in", () => {
        cy.authLogout();
        cy.authLogin({
          email: USERS[1].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Verify filter for PART ID as MPI-00002 and open it", () => {
        cy.dlClearFilters();
        cy.get(`td[data-grid-col-index="0"]`).contains("MPI-00002").arrowClick();
      });

      it("Approve and release MPI document", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetFieldLocks], () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });

      it("Check MPI doc released status and click on Send To Email", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: "MPI document" });
      });
    });

    context("Verify RELEASED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
      it("Verify RELEASED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document ListMPI-00002 Rev 1RELEASED`,
          breadcrump: true,
        });
      });

      it(`Verify the statusbar background-color as GREEN(${Colors.latest_green_varient})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
      });

      it(`Verify 'Revise Document' exists in statusbar`, () => {
        cy.get("[data-cy=\"updateRecord\"]").should("be.visible");
      });

      it(`Verify 'Send to Email' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it(`Verify 'Change Owner' exists in statusbar`, () => {
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      });

      it(`Verify 'Last saved: ' does not exist in Released statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });

    context("Click on the AR ID link and verify AR opens in new tab", () => {
      it(`Click on the AR ID link`, () => {
        cy.pause();
        cy.get("a#ChangeRequestLink-linkButton").should("contain", "AR-").invoke("removeAttr", "target").click();
      });

      it(`Verify AR opens in a new tab`, () => {
        cy.url().should("include", "/preview");
        cy.go("back");
      });
    });

    context("Click on 'Revise Document' 'Save' and 'Approve and Release'", () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document - create company", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Open the Superseded revision and check the content of the status bar", () => {
      it("Verify RELEASED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document ListMPI-00002 Rev 2RELEASED`,
          breadcrump: true,
        });
      });

      it(`Verify 'Revise Document' exists in statusbar`, () => {
        cy.get("[data-cy=\"updateRecord\"]").should("be.visible");
      });

      it(`Verify 'Send to Email' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it(`Verify 'Change Owner' exists in statusbar`, () => {
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      });

      it(`Verify 'Last saved' does not exist in Released statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });

      it(`Verify the statusbar background-color as GREEN(${Colors.latest_green_varient})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
      });
    });

    context("Click on 'Revise Document' again select 'Obsolete' Approve and release document", () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Select 'Obsolete' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release document - create company", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    context("Verify OBSOLETE Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
      it("Verify OBSOLETE Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document ListMPI-00002 Rev OBSOBSOLETE`,
          breadcrump: true,
        });
      });

      it(`Verify 'Revise Document' does not exists in statusbar`, () => {
        cy.contains("[data-cy=\"updateRecord\"]").should("not.be.exist");
      });

      it(`Verify 'Send to Email' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it(`Verify 'Change Owner' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      });

      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });

      it(`Verify the statusbar background-color as RED(#EC2B00)`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
      });
    });

    context("Create a Form in DRAFT state", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it("Enter title 'Bulk create form'", () => {
        cy.drEnterDocumentTitle({ name: "Bulk create form" });
      });

      it("Enter description 'Bulk create form description'", () => {
        cy.drEnterDocumentDescription({ description: "Bulk create form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select output document type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Bulk Create" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });
    });

    context(`Click on 'Void' and verify document status as VOIDED`, () => {
      it(`Click 'Void' and 'Yes, Im sure'`, () => {
        SystemRequirement("REQ-2800");
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("[data-cy=\"void-button\"]").arrowClick();
        cy.get("[data-cy=\"AlertDialog-continueButton\"]").contains("Yes, I'm sure").arrowClick();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.VOIDED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.VOIDED });
        cy.arCheckTitleInEditableAndMatches({ name: "Void" });
      });
    });

    context(`Verify VOIDED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify VOIDED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document ListFM-00003 Rev 1VOIDED`,
          breadcrump: true,
        });
      });

      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });

      it("Check if 'Change Owner' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
        cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
        cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
      });

      it("Check if 'Send To Email' button exists", () => {
        cy.get("#HeaderMenuButton").arrowClick({ force: true });
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it("Verify popup message \"File will be sent to your email shortly.\"", () => {
        cy.checkToastMessageContains({
          message: "File will be sent to your email shortly.",
        });
      });

      it(`Verify VOIDED statusbar background-color as RED(${Colors.latest_red_varient})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
      });
    });
  });
});

export { };

