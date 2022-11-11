// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let asyncTasksGroup;
const otherFormName = "form title";
const otherFormDesc = "form description";
const approvalRequestDocName = "Approval request document title";
const approvalRequestDocDesc = "Approval request document description";
const approvalRequestDocName2 = "Approval request document two title";
const approvalRequestDocDesc2 = "Approval request document two description";
const otherFormName2 = "other title";
const otherFormDesc2 = "other description";
const otherFormDocId1 = "CP-00002";
const otherFormDocId2 = "CP-00003";


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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login first tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
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
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });
  });

  context("Create a document with internal type Other 'Clinical Protocol' and 'Alpha' revision stage", () => {
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

  context(`Verify last saved with different timestamp`, () => {
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

  context(`Click on 3 dots and verify 'Void' 'Change Owner' and 'Send To Email' options and functions`, () => {
    it(`Click on 3 dots and verify 'Void' option exists`, () => {
      SystemRequirement("REQ-2800");
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy=\"void-button\"]").should("be.visible");
      cy.get("[data-cy=\"void-button\"]").arrowClick();
      cy.get("button[data-cy=\"AlertDialog-cancelButton\"]").arrowClick();
    });

    it("Check if 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
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
  });

  context(`Scroll down to the bottom of the page`, () => {
    it("Scroll down to the bottom of the page", () => {
      cy.get("#attachmentHeader").scrollIntoView();
    });

    it(`Verify statusbar conataining DRAFT is still visible`, () => {
      cy.get("div[data-cy=\"HeaderInfo-status\"]").contains("DRAFT").should("be.visible");
    });
  });

  context(`Verify the status bar is BLUE`, () => {
    it(`Verify statusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
    });
  });

  context("Click on save button and check for 'Last saved' exists in statusbar", () => {
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
  });

  context("Go to Approval Requests and create an AR", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Enter AR title as ${approvalRequestDocName}`, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestDocName });
    });

    it(`Enter description as ${approvalRequestDocDesc}`, () => {
      cy.arEnterApprovalRequestDescription({ description: approvalRequestDocDesc });
    });

    it(`Select the item as ${otherFormDocId1} created earlier`, () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: otherFormDocId1 });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[1].email, noWait: true });
    });
  });

  context("Save the AR created", () => {
    it("Save AR", () => {
      cy.arSaveApiCall();
    });
  });

  context("Submit the AR for review", () => {
    it("Click on 'Send to review'", () => {
      cy.contains("Send to review").arrowClick();
    });
  });

  context("Verify AR is 'IN REVIEW' state", () => {
    it("Verify AR state as 'IN REVIEW'", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Approval RequestsAR-00001 Rev`,
        breadcrump: true,
      });
    });

    it(`Check AR document status as ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
      cy.arCheckTitleInEditableAndMatches({ name: approvalRequestDocName });
    });
  });

  context("Navigate to document list and open the document", () => {
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

  context(`Verify the document Statusbar items as ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
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

  context(`Click on 3 dots and verify 'Change Owner' and 'Send To Email' options and functions`, () => {
    it("Check if 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
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

    it(`Verify 'Last saved' does not exist in statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });
  });

  context(`Verify the status bar is ORANGE`, () => {
    it(`Verify the statusbar background-color as ORANGE(${Colors.school_bus_yellow})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
    });

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
      cy.go("back");
    });
  });

  context("Go back to the AR and reject the AR", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear Filter", () => {
      cy.arClearFilters();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatus({ title: approvalRequestDocName, status: "IN_REVIEW" });
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

  context("Navigate to document list and open it", () => {
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

  context(`Verify the document Statusbar items as ${STATUS_TYPES_LABEL.PENDING_CHANGE}`, () => {
    it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document List${otherFormDocId1} Rev APENDING CHANGE`,
        breadcrump: true,
      });
    });
  });

  context("Click on save button and check for 'Last saved' exists in statusbar", () => {
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

  context(`Verify 'Save', 'Change Owner' and 'Send To Email' option exists`, () => {
    it(`Verify 'Save' option exists`, () => {
      SystemRequirement("REQ-2800");
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").should("be.visible");
      cy.recClickSaveBtn();
    });

    it("Check if 'Change Owner' button exists", () => {
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
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
      cy.get("#attachmentHeader").scrollIntoView();
    });
  });

  context(`Verify Verify statusbar conataining ${STATUS_TYPES_LABEL.PENDING_CHANGE}`, () => {
    it(`Verify statusbar conataining  ${STATUS_TYPES_LABEL.PENDING_CHANGE} is still visible`, () => {
      cy.get("div[data-cy=\"HeaderInfo-status\"]").should("be.visible");
    });

    it(`Verify tatusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
    });
  });

  context("Click on save button and check for 'Last saved' exists in statusbar", () => {
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

  context("Go back to the AR - Submit for approval and approve it", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear Filter", () => {
      cy.arClearFilters();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatus({ title: approvalRequestDocName, status: "DRAFT" });
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

  context("Navigate to document list and open the document", () => {
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

  context(`Verify document Statusbar items as ${STATUS_TYPES_LABEL.APPROVED}`, () => {
    it(`Check doc status as ${STATUS_TYPES_LABEL.APPROVED}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.APPROVED });
      cy.arCheckTitleInEditableAndMatches({ name: otherFormName });
    });

    it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document List${otherFormDocId1} Rev AAPPROVED`,
        breadcrump: true,
      });
    });

    it("Check if 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
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

    it(`Verify 'Last saved' does not exist in statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });

    it(`Verify the statusbar background-color as ORANGE(${Colors.school_bus_yellow})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
    });

    it("Scroll down to the bottom of the page", () => {
      cy.contains("No attachments").scrollIntoView();
    });

    it(`Verify statusbar conataining IN REVIEW is still visible`, () => {
      cy.get("div[data-cy=\"HeaderInfo-status\"]").contains("APPROVED").should("be.visible");
    });
  });

  context("Navigate back to AR list and close it", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Clear Filter", () => {
      cy.arClearFilters();
    });

    it("Filter approval by name and status, and select it", () => {
      cy.arFilterARListByNameAndStatus({ title: approvalRequestDocName, status: "APPROVED" });
    });

    it("click on 'Close' button", () => {
      cy.get(`[data-cy="transition-closed"]`).contains("Close").arrowClick();
    });

    it("Select option as 'No'", () => {
      cy.get("button[id=\"AlertDialog-cancelButton\"]").contains("No").arrowClick();
    });

    it("select effective date as the default selected date(today)", () => {
      cy.get(`[data-cy="field-effectiveDate"]`).find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
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
      cy.arCheckTitleInEditableAndMatches({ name: approvalRequestDocName });
    });
  });

  context("Navigate to document list and open the document", () => {
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

  context(`Verify document Statusbar items as ${STATUS_TYPES_LABEL.RELEASED}`, () => {
    it(`Check doc status as ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: otherFormName });
    });

    it("Verify Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document List${otherFormDocId1} Rev ARELEASED`,
        breadcrump: true,
      });
    });

    it(`Verify 'Revise Document' exists in statusbar`, () => {
      cy.get(`[data-cy="updateRecord"]`).should("exist");
    });

    it("Check if 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
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

    it(`Verify 'Last saved' does not exist in statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });

    it(`Verify the statusbar background-color as GREEN(${Colors.latest_green_varient})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
    });

    it("Scroll down to the bottom of the page", () => {
      cy.contains("No attachments").scrollIntoView();
    });

    it(`Verify statusbar conataining RELEASED is still visible`, () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains("RELEASED").should("be.visible");
    });
  });

  context("Create a new document of type other and release it", () => {
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

  context("Create a new AR and link it to newly created document - Approve the AR", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Enter AR title as ${approvalRequestDocName2}`, () => {
      cy.arEnterApprovalRequestTitle({ title: approvalRequestDocName2 });
    });

    it(`Enter description as ${approvalRequestDocDesc2}`, () => {
      cy.arEnterApprovalRequestDescription({ description: approvalRequestDocDesc2 });
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

  context("Navigate back to AR list and Approve AR and Close it", () => {
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
      cy.arFilterARListByNameAndStatus({ title: approvalRequestDocName2, status: "DRAFT" });
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
      cy.arCheckTitleInEditableAndMatches({ name: approvalRequestDocName2 });
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

  context("Verify OBSOLETE Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
    it("Verify OBSOLETE Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Document List${otherFormDocId2} Rev OBSOBSOLETE`,
        breadcrump: true,
      });
    });

    it(`Verify 'Revise Document' does not exists in statusbar`, () => {
      cy.contains("[data-cy=\"updateRecord\"]").should("not.be.exist");
    });

    it(`Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy=\"exportToEmail\"]").should("be.visible");
      cy.get("[data-cy=\"exportToEmail\"]").arrowClick();
    });

    it(`Verify 'Change Owner' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
    });

    it(`Verify 'Last saved' does not exist in statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });

    it(`Verify the statusbar background-color as RED(#EC2B00)`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
    });
  });
});

export { };

