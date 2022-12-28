// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { receivingReleasedDate } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let asyncTasksGroup;
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
const bulkId1 = "FM-00004";
const bulkName = "third title";
const bulkDesc = "third description";
const arId2 = "AR-00004";
const bulkArName = "Bulk AR title";
const bulkArDesc = "Bulk AR description";
const bulkId2 = "FM-00005";
const bulkName2 = "third two title";
const bulkDesc2 = "third two description";
const bulkArName2 = "Bulk two AR title";
const bulkArDesc2 = "Bulk two AR description";

context("Status Bar of New Enlil items approved via regular AR", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[11].email);
          done();
        });
      });
    });

    it("[API]Login first tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[11].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
        },
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

  context("Form Internal type as Other('Clinical Protocol')", () => {
    context("Create a document with internal type Other('Clinical Protocol') and 'Alpha' revision stage", () => {
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

      it("Select 'Clinical Protocol' document type", () => {
        cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
        cy.unClick();
      });

      it("Select 'Alpha' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Alpha" });
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
            `Document List${otherFormDocId1} Rev ADRAFT`,
          breadcrump: true,
        });
      });
    });

    context(`Verify last saved with different timestamp when autosave on`, () => {
      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
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
        cy.get("div[data-cy=\"HeaderInfo-status\"]").contains("DRAFT").should("be.visible");
      });
    });

    context("Edit all the fields, make sure the “last saved” data is updated each time", () => {
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

      it("Mark 'Training Required'", () => {
        cy.drClickTrainingRequired();
      });
    });

    context("Go to Approval Requests and create an AR and Select the item created in last step", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.arClickCreateAnAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Enter AR title as ${otherArName}`, () => {
        cy.arEnterApprovalRequestTitle({ title: otherArName });
      });

      it(`Enter description as ${otherArDesc}`, () => {
        cy.arEnterApprovalRequestDescription({ description: otherArDesc });
      });

      it(`Select the item as ${otherFormDocId1} created in last step`, () => {
        cy.arClickAddDocument();
        cy.arChoseSpecificProposedDocument({ name: otherFormDocId1 });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddBtnOnAddDocumentsDialog();
      });

      it("Add approvers to approval request on approver list", () => {
        cy.arAddApproverOnApproverList({ approver: USERS[1].email, noWait: true });
      });

      it("Save AR", () => {
        cy.arSaveApiCall();
      });
    });

    context("Submit the AR for review", () => {
      it("Click on 'Send to review'", () => {
        cy.contains("Send to review").arrowClick();
      });

      it("Verify AR state as 'IN REVIEW'", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Approval Requests${arId1} Rev`,
          breadcrump: true,
        });
      });

      it(`Check AR document status as ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
        cy.arCheckTitleInEditableAndMatches({ name: otherArName });
      });
    });

    context("Go back to the item created in earlier", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: otherFormName });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context(`Verify the document is in ${STATUS_TYPES_LABEL.IN_REVIEW} status in statusbar`, () => {
      it(`Check doc status as ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
        cy.arCheckTitleInEditableAndMatches({ name: otherFormName });
      });
    });

    context(`Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document List${otherFormDocId1} Rev AIN REVIEW`,
          breadcrump: true,
        });
      });
    });

    context(`Click on Three dots: and verify 'Send to Email' and 'Change Owner' buttons`, () => {
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
      it(`Verify 'Last saved' button does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });

      it(`Verify 'Last saved a few seconds ago' does not exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .should("not.contain", tmpRegex);
      });
    });

    context(`Verify the status bar is ORANGE`, () => {
      it(`Verify the statusbar background-color as ORANGE(${Colors.school_bus_yellow})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
      });
    });

    context(`Scroll down the page and verify the status bar should be fixed`, () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("No attachments").scrollIntoView();
      });

      it(`Verify statusbar conataining IN REVIEW is still visible`, () => {
        cy.get("div[data-cy=\"HeaderInfo-status\"]").contains("IN REVIEW").should("be.visible");
      });
    });

    context("Click on the AR ID link and verify AR opens in new tab", () => {
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

    context("Go back to the AR and reject the AR", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Clear Filter", () => {
        cy.arClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter approval by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: otherArName, status: "IN_REVIEW" });
      });

      it("Reject AR", () => {
        cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
        cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
      });
    });

    context(`Go to the item and verify that it is in the ${STATUS_TYPES_LABEL.PENDING_CHANGE} status`, () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: otherFormName });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.PENDING_CHANGE}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.PENDING_CHANGE });
      });
    });

    context(`Verify the document statusbar items as ${STATUS_TYPES_LABEL.PENDING_CHANGE}`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document List${otherFormDocId1} Rev APENDING CHANGE`,
          breadcrump: true,
        });
      });
    });

    context(`Verify 'Save', 'Change Owner' displayed in header`, () => {
      it(`Verify 'Save' option exists`, () => {
        SystemRequirement("REQ-2800");
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").should("be.visible");
        cy.recClickSaveBtn();
      });

      it("Verify 'Change Owner' button exists", () => {
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
        cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
        cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
      });
    });

    context(`Click on 3 dots and verify 'Send To Email' button exists`, () => {
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
    });

    context("Verify 'Last saved X min ago' exists in statusbar", () => {
      it(`Verify 'Last saved a few seconds ago' exist in statusbar`, () => {
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

    context("Edit all the fields, make sure the “last saved” data is updated each time", () => {
      it(`Change document description as 'Description for pending status'`, () => {
        cy.drEnterDocumentDescription({ description: "Description for pending status" });
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

    context("last saved should be updated every time there is a “save” event", () => {
      it(`Change document description as 'Change description'`, () => {
        cy.drEnterDocumentDescription({ description: "Change description 1" });
      });

      it("Click on Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Verify again 'Last saved' exist in statusbar with time-duration`, () => {
        cy.verifyLastSavedExists();
      });
    });

    context(`Verify the status bar is BLUE`, () => {
      it(`Verify statusbar conataining  ${STATUS_TYPES_LABEL.PENDING_CHANGE} is still visible`, () => {
        cy.get("div[data-cy=\"HeaderInfo-status\"]").should("be.visible");
      });

      it(`Verify tatusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
      });
    });

    context(`Scroll down the page and verify the status bar should be fixed`, () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("Attachments").scrollIntoView();
      });

      it(`Verify statusbar conataining IN REVIEW is still visible`, () => {
        cy.get("div[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.PENDING_CHANGE).should("be.visible");
      });
    });

    context("Go back to the AR - Submit for approval and approve it", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Clear Filter", () => {
        cy.arClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter approval by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: otherArName, status: "DRAFT" });
      });

      it("Send AR to review", () => {
        cy.contains("Send to review").arrowClick();
      });

      it("Approve AR", () => {
        cy.arApproveAR();
      });

      it(`Check approval request status is ${STATUS_TYPES_LABEL.APPROVED}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
      });
    });

    context(`Go to the item and verify it is in ${STATUS_TYPES_LABEL.APPROVED} status`, () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: otherFormName });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.APPROVED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.APPROVED });
        cy.arCheckTitleInEditableAndMatches({ name: otherFormName });
      });
    });

    context(`Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status tag`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document List${otherFormDocId1} Rev AAPPROVED`,
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
      it(`Verify 'Last saved' button does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });

      it(`Verify 'Last saved a few seconds ago' does not exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .should("not.contain", tmpRegex);
      });
    });

    context("Verify the status bar is ORANGE", () => {
      it(`Verify the statusbar background-color as ORANGE(${Colors.school_bus_yellow})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
      });
    });

    context("Scroll down the page and verify the status bar should be fixed", () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("No attachments").scrollIntoView();
      });

      it(`Verify statusbar conataining APPROVED is still visible`, () => {
        cy.get("div[data-cy=\"HeaderInfo-status\"]").contains("APPROVED").should("be.visible");
      });
    });

    context("There is no info on whom and when were the last edits made", () => {
      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });

    context("Go to the AR and close it (select effective date today)", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Clear Filter", () => {
        cy.arClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter approval by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: otherArName, status: "APPROVED" });
      });

      it("click on 'Close' button", () => {
        cy.get(`[data-cy="transition-closed"]`).contains("Close").arrowClick();
      });

      it("Select option as 'No'", () => {
        cy.get("button[id=\"AlertDialog-cancelButton\"]").contains("No").arrowClick();
      });

      it("select effective date as the default selected date", () => {
        cy.get(`[data-cy="field-effectiveDate"]`).find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it(`Verify the effective date selected as today (${receivingReleasedDate})`, () => {
        cy.get(`[data-cy="field-effectiveDate"] input`).should("have.value", receivingReleasedDate);
      });

      it("Click on confirm button", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostCloseAR, CyRoutes.ARPreview], () => {
            cy.get("#confirmEffectiveDate").arrowClick();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.CLOSED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.CLOSED });
        cy.arCheckTitleInEditableAndMatches({ name: otherArName });
      });
    });

    context(`Verify the item is in as ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: otherFormName });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: otherFormName });
      });
    });

    context("Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document List${otherFormDocId1} Rev ARELEASED`,
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

    context("Create a new document of type other('Clinical Protocol') approve and release it", () => {
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

      it("Select 'Clinical Protocol' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Approve and release it", () => {
        cy.get(`input[name="password"]`).click().arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Click on 'Revise Document' and select 'OBS' and leave in Draft", () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Select 'Obsolete' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Check doc Draft status as ${STATUS_TYPES_LABEL.DRAFT}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });
    });

    context("Create a new AR and link it to it", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.arClickCreateAnAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Enter AR title as ${otherArName2}`, () => {
        cy.arEnterApprovalRequestTitle({ title: otherArName2 });
      });

      it(`Enter description as ${otherArDesc2}`, () => {
        cy.arEnterApprovalRequestDescription({ description: otherArDesc2 });
      });

      it("Select Documents tab", () => {
        cy.drSelectDocumentTab();
      });

      it("Add first document revision", () => {
        cy.arClickAddDocument();
        cy.arChoseSpecificProposedDocument({ name: otherFormDocId2 });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddBtnOnAddDocumentsDialog();
      });

      it("Save AR", () => {
        cy.arSaveApiCall();
      });

      it("Click on 'Change Details' tab", () => {
        cy.arSelectChangeDetailsTab();
      });

      it("Add approvers to approval request on approver list", () => {
        cy.arAddApproverOnApproverList({ approver: USERS[1].email, noWait: true });
      });

      it("Save AR", () => {
        cy.arSaveApiCall();
      });
    });

    context("Navigate back to AR list and Approve AR and Close AR", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Clear Filter", () => {
        cy.arClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it("Filter approval by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: otherArName2, status: "DRAFT" });
      });

      it("Send AR to review", () => {
        cy.contains("Send to review").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve the AR", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.GetRequiredApproversDocRev], () => {
            cy.get("[data-cy='transition-approve']").contains("Approve submission").arrowClick();
            cy.get("[data-cy='transition.action.password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
            cy.get("[data-cy='passwordConfirm']").arrowClick();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'Close' button", () => {
        cy.get(`[data-cy="transition-closed"]`).contains("Close").arrowClick();
      });

      it("Verify 'effective Date to be today' displayed", () => {
        cy.contains("Would you like the Effective Date to be today’s date?").should("exist");
      });

      it("Select option Yes", () => {
        cy.get("button[id=\"AlertDialog-continueButton\"]").contains("Yes").arrowClick();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.CLOSED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.CLOSED });
        cy.arCheckTitleInEditableAndMatches({ name: otherArName2 });
      });
    });

    context("Navigate to document list and open the newly created document", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: otherFormName2 });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Verify Item goes to OBSOLETE state", () => {
      it(`Check doc status as ${STATUS_TYPES_LABEL.OBSOLETE}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.OBSOLETE });
        cy.arCheckTitleInEditableAndMatches({ name: otherFormName2 });
      });
    });

    context("Verify OBS Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
      it("Verify OBS Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
            `Document List${otherFormDocId2} Rev OBSOBSOLETE`,
          breadcrump: true,
        });
      });
    });

    context("Verify Three dots: “Send to Email” and “Change Owner” buttons", () => {
      it(`Verify 'Send to Email' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it(`Verify 'Change Owner' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      });
    });

    context("Verify the status bar is RED", () => {
      it(`Verify the statusbar background-color as RED(#EC2B00)`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
      });
    });

    it(`Verify 'Revise Document' does not exists in statusbar`, () => {
      cy.contains("[data-cy=\"updateRecord\"]").should("not.be.exist");
    });

    context("There is no info on whom and when were the last edits made", () => {
      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });
  });

  context("Form as Internal type with output type as 'Bulk Create'", () => {
    context("Create a internal type Form with output type as 'Bulk Create' and 'Alpha' revision stage", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on create document", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Enter title ${bulkName}`, () => {
        cy.drEnterDocumentTitle({ name: bulkName });
      });

      it(`Enter description as ${bulkDesc}`, () => {
        cy.drEnterDocumentDescription({ description: bulkDesc });
      });

      it("Select document type as Form", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
        cy.unClick();
      });

      it("Select 'Alpha' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Alpha" });
      });

      it("Select 'Bulk Create' output document type from dropdown", () => {
        cy.get("[data-cy=\"field-outputDocumentTypes\"]").arrowClick();
        cy.wait(1500);
        cy.get(`[id^="react-select"]`).contains("Bulk Create").arrowClick();
        cy.unClick();
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
              `Document List${bulkId1} Rev ADRAFT`,
          breadcrump: true,
        });
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
        cy.get("div[data-cy=\"HeaderInfo-status\"]").contains("DRAFT").should("be.visible");
      });
    });

    context("Edit all the fields, make sure the “last saved” data is updated each time", () => {
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

      it("Mark 'Training Required'", () => {
        cy.drClickTrainingRequired();
      });
    });

    context("Go to Approval Requests and create an AR and Select the item created in last step", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.arClickCreateAnAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Enter AR title as ${bulkArName}`, () => {
        cy.arEnterApprovalRequestTitle({ title: bulkArName });
      });

      it(`Enter description as ${bulkArDesc}`, () => {
        cy.arEnterApprovalRequestDescription({ description: bulkArDesc });
      });

      it(`Select the item as ${bulkId1} created in last step`, () => {
        cy.arClickAddDocument();
        cy.arChoseSpecificProposedDocument({ name: bulkId1 });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddBtnOnAddDocumentsDialog();
      });

      it("Add approvers to approval request on approver list", () => {
        cy.arAddApproverOnApproverList({ approver: USERS[1].email, noWait: true });
      });

      it("Save AR", () => {
        cy.arSaveApiCall();
      });
    });

    context("Submit the AR for review", () => {
      it("Click on 'Send to review'", () => {
        cy.get(`[data-cy="transitionButton"]`).contains("Send to review").arrowClick();
      });

      it("Verify AR state as 'IN REVIEW'", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Approval Requests${arId2} Rev`,
          breadcrump: true,
        });
      });

      it(`Check AR document status as ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
        cy.arCheckTitleInEditableAndMatches({ name: bulkArName });
      });
    });

    context("Go back to the item created in earlier", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: bulkName });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context(`Verify the document is in ${STATUS_TYPES_LABEL.IN_REVIEW} status in statusbar`, () => {
      it(`Check doc status as ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
        cy.arCheckTitleInEditableAndMatches({ name: bulkName });
      });
    });

    context(`Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Document List${bulkId1} Rev AIN REVIEW`,
          breadcrump: true,
        });
      });
    });

    context(`Click on Three dots: and verify 'Send to Email' and 'Change Owner' buttons`, () => {
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
      it(`Verify 'Last saved' button does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });

      it(`Verify 'Last saved a few seconds ago' does not exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .should("not.contain", tmpRegex);
      });
    });

    context(`Verify the status bar is ORANGE`, () => {
      it(`Verify the statusbar background-color as ORANGE(${Colors.school_bus_yellow})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
      });
    });

    context(`Scroll down the page and verify the status bar should be fixed`, () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("No attachments").scrollIntoView();
      });

      it(`Verify statusbar conataining IN REVIEW is still visible`, () => {
        cy.get("div[data-cy=\"HeaderInfo-status\"]").contains("IN REVIEW").should("be.visible");
      });
    });

    context("Click on the AR ID link and verify AR opens in new tab", () => {
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

    context("Go back to the AR and reject the AR", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Clear Filter", () => {
        cy.arClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter approval by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: bulkArName, status: "IN_REVIEW" });
      });

      it("Reject AR", () => {
        cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
        cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
      });
    });

    context(`Go to the item and verify that it is in the ${STATUS_TYPES_LABEL.PENDING_CHANGE} status`, () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: bulkName });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.PENDING_CHANGE}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.PENDING_CHANGE });
      });
    });

    context(`Verify the document statusbar items as ${STATUS_TYPES_LABEL.PENDING_CHANGE}`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Document List${bulkId1} Rev APENDING CHANGE`,
          breadcrump: true,
        });
      });
    });

    context(`Verify 'Save', 'Change Owner' displayed in header`, () => {
      it(`Verify 'Save' option exists`, () => {
        SystemRequirement("REQ-2800");
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").should("be.visible");
        cy.recClickSaveBtn();
      });

      it("Verify 'Change Owner' button exists", () => {
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
        cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
        cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
      });
    });

    context(`Click on 3 dots and verify 'Send To Email' button exists`, () => {
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
    });

    context("Edit all the fields, make sure the “last saved” data is updated each time", () => {
      it(`Change document description as 'Description for pending status'`, () => {
        cy.drEnterDocumentDescription({ description: "Description for pending status" });
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

    context("last saved should be updated every time there is a “save” event", () => {
      it(`Change document description as 'Change description'`, () => {
        cy.drEnterDocumentDescription({ description: "Change description 1" });
      });

      it("Click on Save button", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Verify again 'Last saved' exist in statusbar with time-duration`, () => {
        cy.verifyLastSavedExists();
      });
    });

    context(`Verify the status bar is BLUE`, () => {
      it(`Verify statusbar conataining  ${STATUS_TYPES_LABEL.PENDING_CHANGE} is still visible`, () => {
        cy.get("div[data-cy=\"HeaderInfo-status\"]").should("be.visible");
      });

      it(`Verify tatusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
      });
    });

    context(`Scroll down the page and verify the status bar should be fixed`, () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("Attachments").scrollIntoView();
      });

      it(`Verify statusbar conataining IN REVIEW is still visible`, () => {
        cy.get("div[data-cy=\"HeaderInfo-status\"]").contains(STATUS_TYPES_LABEL.PENDING_CHANGE).should("be.visible");
      });
    });

    context("Go back to the AR - Submit for approval and approve it", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Clear Filter", () => {
        cy.arClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter approval by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: bulkArName, status: "DRAFT" });
      });

      it("Send AR to review", () => {
        cy.contains("Send to review").arrowClick();
      });

      it("Approve AR", () => {
        cy.arApproveAR();
      });

      it(`Check approval request status is ${STATUS_TYPES_LABEL.APPROVED}`, () => {
        cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.APPROVED });
      });
    });

    context(`Go to the item and verify it is in ${STATUS_TYPES_LABEL.APPROVED} status`, () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: bulkName });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.APPROVED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.APPROVED });
        cy.arCheckTitleInEditableAndMatches({ name: bulkName });
      });
    });

    context(`Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status tag`, () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Document List${bulkId1} Rev AAPPROVED`,
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
      it(`Verify 'Last saved' button does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });

      it(`Verify 'Last saved a few seconds ago' does not exist in statusbar`, () => {
        const tmpRegex = new RegExp(`Last saved a few seconds ago`, "gi");
        cy.get(`div[class*="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-flex-end"]`)
          .should("not.contain", tmpRegex);
      });
    });

    context("Verify the status bar is ORANGE", () => {
      it(`Verify the statusbar background-color as ORANGE(${Colors.school_bus_yellow})`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
      });
    });

    context("Scroll down the page and verify the status bar should be fixed", () => {
      it("Scroll down to the bottom of the page", () => {
        cy.contains("No attachments").scrollIntoView();
      });

      it(`Verify statusbar conataining APPROVED is still visible`, () => {
        cy.get("div[data-cy=\"HeaderInfo-status\"]").contains("APPROVED").should("be.visible");
      });
    });

    context("There is no info on whom and when were the last edits made", () => {
      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });

    context("Go to the AR and close it (select effective date today)", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Clear Filter", () => {
        cy.arClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter approval by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: bulkArName, status: "APPROVED" });
      });

      it("click on 'Close' button", () => {
        cy.get(`[data-cy="transition-closed"]`).contains("Close").arrowClick();
      });

      it("Select option as 'No'", () => {
        cy.get("button[id=\"AlertDialog-cancelButton\"]").contains("No").arrowClick();
      });

      it("select effective date as the default selected date", () => {
        cy.get(`[data-cy="field-effectiveDate"]`).find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
      });

      it(`Verify the effective date selected as today (${receivingReleasedDate})`, () => {
        cy.get(`[data-cy="field-effectiveDate"] input`).should("have.value", receivingReleasedDate);
      });

      it("Click on confirm button", () => {
        cy.wrapWithWaitOnApiCalls(
          [CyRoutes.PostCloseAR, CyRoutes.ARPreview], () => {
            cy.get("#confirmEffectiveDate").arrowClick();
          });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.CLOSED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.CLOSED });
        cy.arCheckTitleInEditableAndMatches({ name: bulkArName });
      });
    });

    context(`Verify the item is in as ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: bulkName });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.RELEASED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.arCheckTitleInEditableAndMatches({ name: bulkName });
      });
    });

    context("Verify Left side: Icon, Landing page, Doc ID, Rev stage, Status tag", () => {
      it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Document List${bulkId1} Rev ARELEASED`,
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

    context("Verify for a form with an output also contain the 'Create new' button", () => {
      it(`Verify 'Create new' button exists in statusbar`, () => {
        cy.get(`[data-cy="PreviewControlsContainer-createNew"]`).contains("Create new").should("exist");
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

    context("Create a new form of output type 'Bulk Create' and approve and release it", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });

      it(`Enter title ${bulkName2}`, () => {
        cy.drEnterDocumentTitle({ name: bulkName2 });
      });

      it(`Enter description ${bulkDesc2}`, () => {
        cy.drEnterDocumentDescription({ description: bulkDesc2 });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Bulk Create' as the document type from dropdown", () => {
        cy.get("[data-cy=\"field-outputDocumentTypes\"]").arrowClick();
        cy.wait(1500);
        cy.get(`[id^="react-select"]`).contains("Bulk Create").arrowClick();
        cy.unClick();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Approve and release it", () => {
        cy.get(`input[name="password"]`).click().arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Click on 'Revise Document' and select 'OBS' and leave in Draft", () => {
      it("Click on 'Revise document'", () => {
        cy.drClickReviseDocument();
      });

      it("Select 'Obsolete' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
      });

      it("Save document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it(`Check doc Draft status as ${STATUS_TYPES_LABEL.DRAFT}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
      });
    });

    context("Create a new AR and link it to it", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Click Create a Approval Request button", () => {
        cy.arClickCreateAnAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Enter AR title as ${bulkArName2}`, () => {
        cy.arEnterApprovalRequestTitle({ title: bulkArName2 });
      });

      it(`Enter description as ${bulkArDesc2}`, () => {
        cy.arEnterApprovalRequestDescription({ description: bulkArDesc2 });
      });

      it("Select Documents tab", () => {
        cy.drSelectDocumentTab();
      });

      it("Add first document revision", () => {
        cy.arClickAddDocument();
        cy.arChoseSpecificProposedDocument({ name: bulkId2 });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddBtnOnAddDocumentsDialog();
      });

      it("Save AR", () => {
        cy.arSaveApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'Change Details' tab", () => {
        cy.arSelectChangeDetailsTab();
      });

      it("Add approvers to approval request on approver list", () => {
        cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[1].email, noWait: true });
      });

      it("Save AR", () => {
        cy.arSaveApiCallWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Navigate back to AR list and Approve AR and Close AR", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestListWithoutApi();
      });

      it("Clear Filter", () => {
        cy.arClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter approval by name and status, and select it", () => {
        cy.arFilterARListByNameAndStatus({ title: bulkArName2, status: "DRAFT" });
      });

      it("Send AR to review", () => {
        cy.contains("Send to review").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve the AR", () => {
        cy.get("[data-cy='transition-approve']").contains("Approve submission").arrowClick();
        cy.get("[data-cy='transition.action.password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
        cy.get("[data-cy='passwordConfirm']").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'Close' button", () => {
        cy.get(`[data-cy="transition-closed"]`).contains("Close").arrowClick();
      });

      it("Verify 'effective Date to be today' displayed", () => {
        cy.contains("Would you like the Effective Date to be today’s date?").should("exist");
      });

      it("Select option Yes", () => {
        cy.get("button[id=\"AlertDialog-continueButton\"]").contains("Yes").arrowClick();
      });

      it(`Check doc status as ${STATUS_TYPES_LABEL.CLOSED}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.CLOSED });
        cy.arCheckTitleInEditableAndMatches({ name: bulkArName2 });
      });
    });

    context("Navigate to document list and open the newly created document", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
      });

      it("Clear document filter", () => {
        cy.dlClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Filter the list by document title", () => {
        cy.dlFilterByDocTitle({ docTitle: bulkName2 });
      });

      it("Open the first document in the list", () => {
        cy.dlSelectFirstDocument();
      });
    });

    context("Verify Item goes to OBSOLETE state", () => {
      it(`Check doc status as ${STATUS_TYPES_LABEL.OBSOLETE}`, () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.OBSOLETE });
        cy.arCheckTitleInEditableAndMatches({ name: bulkName2 });
      });
    });

    context("Verify OBS Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
      it("Verify OBS Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
        cy.verifyListItemExistsOnHeader({
          listItem:
              `Document List${bulkId2} Rev OBSOBSOLETE`,
          breadcrump: true,
        });
      });
    });

    context("Verify Three dots: “Send to Email” and “Change Owner” buttons", () => {
      it(`Verify 'Send to Email' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
        cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
      });

      it(`Verify 'Change Owner' exists in statusbar`, () => {
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      });
    });

    context("Verify the status bar is RED", () => {
      it(`Verify the statusbar background-color as RED(#EC2B00)`, () => {
        cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
      });
    });

    it(`Verify 'Revise Document' does not exists in statusbar`, () => {
      cy.contains("[data-cy=\"updateRecord\"]").should("not.be.exist");
    });

    context("There is no info on whom and when were the last edits made", () => {
      it(`Verify 'Last saved' does not exist in statusbar`, () => {
        cy.verifyLastSavedNotExists();
      });
    });
  });
});

export { };

