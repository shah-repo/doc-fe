// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;

const intDocType = "Clinical Protocol";
const otherFormDocId1 = "CP-00002";
const otherFormName = "form title";
const otherFormDesc = "form description";
const otherFormDocId2 = "CP-00003";
const otherFormName2 = "other title";
const otherFormDesc2 = "other description";

const eqFormName = "equipment title";
const eqFormDesc = "equipment description";
const eqDocId1 = "EQ-00001";
const eqDocName = "Equipment maintenance document";
const eqDocDesc = "Equipment maintenance document desc";
const eqDocId2 = "EQ-00002";
const eqDocName2 = "Equipment2 maintenance document";
const eqDocDesc2 = "Equipment2 maintenance document desc";

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
            companyAdminEmail: USERS[11].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[12], USERS[13], USERS[14]],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[11].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[11].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });
  });

  context(`Form Internal type as Other('${intDocType}')`, () => {
    context(`Create a document with internal type Other(${intDocType})`, () => {
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

      it(`Select ${intDocType} document type`, () => {
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

      it(`Verify 'Auto-saving, please wait' exists in statusbar`, () => {
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains("Auto-saving, please wait");
      });

      it("Turn on autosave", () => {
        cy.cmpTurnOnAutosave();
      });
    });

    context(`Wait for 2 min. It should display 'Last saved 2 minutes ago'`, () => {
      it(`Verify 'Last saved a few seconds ago' exists in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });

      it(`Wait for 1 minute. It should display 'Last saved a minute ago'`, () => {
        cy.wait(60 * 1000 + 2000);
        const tmpRegex = new RegExp(`Last saved a minute ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });

      it(`Wait for another 1 minute. It should display 'Last saved 2 minutes ago'`, () => {
        cy.wait(60 * 1000 + 2000);
        const tmpRegex = new RegExp(`Last saved 2 minutes ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });
    });

    context(`Verify 'Approve and Release' and 'Save' buttons exists and they are funcational`, () => {
      it("Verify Save button in status bar and click on it", () => {
        cy.get(".MuiButton-label").contains("Save");
        cy.get(".MuiButton-label").contains("Save").arrowClick();
      });

      it("Verify 'Approve and Release' button and click on it and select Cancel", () => {
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
          email: USERS[12].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
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

      it("Verify DRAFT in Statusbar and verify Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
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
          email: USERS[11].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
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

    context(`Release the item by clicking 'Approve And Release'`, () => {
      it("Approve And Release the document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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

    context(`Right side: Three dots: 'Send to Email' and 'Change Owner' buttons`, () => {
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

      it(`Verify popup message 'File will be sent to your email shortly.'`, () => {
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

    context(`Revise the item → A new revision is created in 'DRAFT'`, () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it(`Check doc Draft status as ${STATUS_TYPES_LABEL.DRAFT}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });
    });

    context("Approve and release the new revision", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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
        cy.drClickRevisionsSidePanel();
        cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(1).contains("Superseded").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
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

    context(`Right side: Three dots: 'Send to Email' and 'Change Owner' buttons`, () => {
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

      it(`Verify popup message 'File will be sent to your email shortly.'`, () => {
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

    context(`Revise the item and select the 'Obsolete' revision stage`, () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Select 'Obsolete' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    context("Approve and release the new 'OBS' revision", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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

    context(`Verify Three dots: 'Send to Email' and 'Change Owner' buttons`, () => {
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
        cy.drClickCreateDocumentWithoutApiCall();
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

    context(`Click on 3 dots and Click Void and Yes, Im sure and verify Item goes to a Voided state`, () => {
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

    context(`Right side: Click on 3 dots and verify 'Send to Email' and 'Change Owner' buttons`, () => {
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

      it(`Verify popup message "File will be sent to your email shortly."`, () => {
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

  context(`Document Internal type as 'Equipment'`, () => {
    context("Create a internal type Form with output type as 'Equipment' and release it", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on create document", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Enter title ${eqFormName}`, () => {
        cy.drEnterDocumentTitle({ name: eqFormName });
      });

      it(`Enter description as ${eqFormDesc}`, () => {
        cy.drEnterDocumentDescription({ description: eqFormDesc });
      });

      it("Select document type as Form", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
        cy.unClick();
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Equipment' output document type from dropdown", () => {
        cy.get("[data-cy=\"field-outputDocumentTypes\"]").arrowClick();
        cy.wait(1500);
        cy.get(`[id^="react-select"]`).contains("Equipment").arrowClick();
        cy.unClick();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Approve and release form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: eqFormName });
      });
    });

    context("Right side: 'Create New' exists", () => {
      it(`Verify 'Create New' exists in statusbar`, () => {
        cy.get("#PreviewControlsContainer-createNew").contains("Create new").should("exist");
      });
    });

    context("Create equipment document", () => {
      it("Navigate to equipment list", () => {
        cy.navigToEquipment();
      });

      it("Click 'Add New Equipment'", () => {
        SystemRequirement("REQ-2880");
        cy.equipClickCreateNew();
      });

      it(`Enter title ${eqDocName}`, () => {
        cy.drEnterDocumentTitle({ name: eqDocName });
      });

      it(`Enter description ${eqDocDesc}`, () => {
        cy.drEnterDocumentDescription({ description: eqDocDesc });
      });

      it("Select 'Active' as EQ status", () => {
        cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
      });

      it("Click on Save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
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
              `Equipment${eqDocId1} Rev 1DRAFT`,
          breadcrump: true,
        });
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

      it(`Verify popup message "File will be sent to your email shortly."`, () => {
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
      it(`Change document eq description as 'Change eq description'`, () => {
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
          email: USERS[12].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigates to equipment list", () => {
        cy.navigToEquipment();
      });

      it("Filter the last document and open it", () => {
        cy.dlClearFilters();
        cy.get(`td[data-grid-col-index="0"]`).contains(eqDocId1).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Verify DRAFT Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
          `Equipment${eqDocId1} Rev 1DRAFT`,
          breadcrump: true,
        });
      });

      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .contains(tmpRegex);
      });
    });

    context("Login back to user1", () => {
      it("Logs user in", () => {
        cy.authLogout();
        cy.authLogin({
          email: USERS[11].email, password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });

      it("Navigates to equipment list", () => {
        cy.navigToEquipment();
      });

      it("Verify filter the last document and open it", () => {
        cy.dlClearFilters();
        cy.get(`td[data-grid-col-index="0"]`).contains(eqDocId1).arrowClick();
      });
    });

    context(`Release the item by clicking 'Approve And Release'`, () => {
      it("Approve and release the document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context(`Verify Statusbar for Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Equipment${eqDocId1} Rev 1${STATUS_TYPES_LABEL.RELEASED}`,
          breadcrump: true,
        });
      });
    });

    context("Right side: 'Revise Document' exists", () => {
      it(`Verify 'Revise Document' exists in statusbar`, () => {
        cy.get(`[data-cy="updateRecord"]`).should("exist");
      });
    });

    context(`Right side: Three dots: 'Send to Email' and 'Change Owner' buttons`, () => {
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

      it(`Verify popup message "File will be sent to your email shortly."`, () => {
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

    context(`Revise the item → A new revision is created in 'DRAFT'`, () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it(`Check doc Draft status as ${STATUS_TYPES_LABEL.DRAFT}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });
    });

    context("Approve and release the new revision", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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
        cy.drClickRevisionsSidePanel();
        cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(1).contains("Superseded").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });
    });

    context(`Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Equipment${eqDocId1} Rev 1${STATUS_TYPES_LABEL.SUPERSEDED}`,
          breadcrump: true,
        });
      });
    });

    context(`Right side: Three dots: 'Send to Email' and 'Change Owner' buttons`, () => {
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

      it(`Verify popup message "File will be sent to your email shortly."`, () => {
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
        cy.drClickCreateDocumentWithoutApiCall();
      });
    });

    context("Approve and release the new 'OBS' revision", () => {
      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });

    context(`Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify OBS Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Equipment${eqDocId1} Rev OBS${STATUS_TYPES_LABEL.OBSOLETE}`,
          breadcrump: true,
        });
      });
    });

    context(`Verify Three dots: 'Send to Email' and 'Change Owner' buttons`, () => {
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

    context("Create equipment document", () => {
      it("Navigate to equipment list", () => {
        cy.navigToEquipment();
      });

      it("Click 'Add New Equipment'", () => {
        SystemRequirement("REQ-2880");
        cy.equipClickCreateNew();
      });

      it(`Enter title ${eqDocName2}`, () => {
        cy.drEnterDocumentTitle({ name: eqDocName2 });
      });

      it(`Enter description ${eqDocDesc2}`, () => {
        cy.drEnterDocumentDescription({ description: eqDocDesc2 });
      });

      it("Select 'Active' as EQ status", () => {
        cy.get("input[name=fb-default-eq-status][value=Active]").check({ force: true });
      });

      it("Click on Save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });
    });

    context(`Verify ${STATUS_TYPES_LABEL.DRAFT} in Statusbar`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Equipment${eqDocId2} Rev 1${STATUS_TYPES_LABEL.DRAFT}`,
          breadcrump: true,
        });
      });
    });

    context(`Click on 3 dots and Click 'Void' and 'Yes, Im sure' and verify Item goes to a 'Voided' state`, () => {
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
              `Equipment${eqDocId2} Rev 1${STATUS_TYPES_LABEL.VOIDED}`,
          breadcrump: true,
        });
      });
    });

    context(`Right side: Click on 3 dots and verify 'Send to Email' and “Change Owner” buttons`, () => {
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

      it(`Verify popup message "File will be sent to your email shortly."`, () => {
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
});

export { };

