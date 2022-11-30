// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import faker from "faker";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import Colors from "../../../src/ui/layout/theme/utils/colors";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let secondEmployee;
let componentSpecificationDocumentType;
let group;
let approvalRequestDocumentType;
let initialArDocument;
let createdDocumentRevResponse;
let createdDocumentRevResponse2;
const documentRevisionName = "New document for testing change order list";
const documentRevisionName2 = "New document for testing change order list two";
const approvalRequestName = "Change order for testing 1";
const approvalRequestName2 = "Change order for testing 2";
let docLastUpdatedTime;
let thirdEmployee;

context("Status Bar of newly created ARs", () => {
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
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          componentSpecificationDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
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

    it("[API]Create document revisions for change order list test", (done: any) => {
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
            name: documentRevisionName,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdDocumentRevResponse = response;
        });
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Doc Rev Description2</p>",
            document: {
              docId: "CP-00005",
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
            name: documentRevisionName2,
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdDocumentRevResponse2 = response;
          done();
        });
      });
    });

    it("[API]Create change orders for created document revisions", () => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response;
        cy.arCreateApprovalRequest({
          payload: {
            title: approvalRequestName,
            description: "Description for first change order",
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            formInput: {
              documentRevisions: [{
                proposedDocumentRevision: { id: createdDocumentRevResponse.id },
                descriptionOfChange: "ar test",
                justificationOfChange: "ar test",
                id: faker.random.uuid(),
              }],
            },
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        });
        cy.arCreateApprovalRequest({
          payload: {
            title: approvalRequestName2,
            description: "Description for second change order",
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            formInput: {
              documentRevisions: [{
                proposedDocumentRevision: { id: createdDocumentRevResponse2.id },
                descriptionOfChange: "ar test",
                justificationOfChange: "ar test",
                id: faker.random.uuid(),
              }],
            },
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Check approval list defaults to draft", () => {
    it("Navigate to change order list", () => {
      cy.navigToApprovalRequestList();
    });
  });

  context("Prepare change order", () => {
    it("Filter ar by name and status, and select it", () => {
      SystemRequirement("REQ-0830");
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: approvalRequestName, status: STATUS_TYPES_LABEL.DRAFT  });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approvers to change order on approver list", () => {
      cy.get("[data-cy='fb-approvers-approvers']").autocompleteSelect(USERS[1].name);
    });
  });

  context("Verify DRAFT statusbar items", () => {
    it("Verify DRAFT Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Change OrdersAR-00001 Rev DRAFT`,
        breadcrump: true,
      });
    });
  });

  context("Verify last save status with auto save", () => {
    it("Turn on 'auto save'", () => {
      cy.cmpTurnOnAutosave();
    });

    it("Verify 'Last saved' text should exist", () => {
      cy.get("header").contains("Last saved").should("exist");
      cy.get("header").contains("Last saved").should("be.visible");
    });

    it("Enter new title", () => {
      cy.arEnterApprovalRequestTitle({ title: "New Ar title2" });
    });

    it("Verify 'Last saved a few seconds ago' text should exist", () => {
      cy.get("header").contains("Last saved a few seconds ago").should("exist");
      cy.get("header").contains("Last saved a few seconds ago").should("be.visible");
    });

    it("Turn off 'auto save'", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Verify last save status with manual save  with wait time 2 min", () => {
    it("Verify 'Last saved' text should exist", () => {
      cy.get("header").contains("Last saved").should("exist");
      cy.get("header").contains("Last saved").should("be.visible");
    });

    it("Enter new title", () => {
      cy.arEnterApprovalRequestTitle({ title: "New Ar title" });
    });

    it("Save the document", () => {
      docLastUpdatedTime = new Date().getTime();
      cy.get("#submit").arrowClick();
      cy.wait(60000 * 2);
    });

    it("Verify 'Last saved 2 minutes ago' text should display", () => {
      cy.get("header").contains("Last saved 2 minutes ago").should("exist");
      cy.get("header").contains("Last saved 2 minutes ago").should("be.visible");
    });
  });

  context("Logout and login back and verify last saved time", () => {
    it("Log out", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: thirdEmployee.id });
    });

    it("Navigate to change order list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter ar by name and status, and select it", () => {
      SystemRequirement("REQ-0830");
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: "New Ar title", status: STATUS_TYPES_LABEL.DRAFT  });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify 'Last saved a few seconds ago' text should exist", () => {
      let timeDiff = (new Date().getTime() - docLastUpdatedTime) / 1000;
      timeDiff = Math.floor(timeDiff / 60);
      cy.get("header").contains(`${timeDiff} minutes`).should("exist");
      cy.get("header").contains(`${timeDiff} minutes`).should("be.visible");
    });

    it("Log out", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: secondEmployee.id });
    });

    it("Navigate to change order list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter ar by name and status, and select it", () => {
      SystemRequirement("REQ-0830");
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: "New Ar title", status: STATUS_TYPES_LABEL.DRAFT  });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify statusbar background-color as BLUE(${Colors.dodger_blue})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(77, 136, 255)" });
    });
  });

  context("Verify Save button in status bar", () => {
    it("Verify Save button in status bar", () => {
      cy.get("button[data-cy='common.save']").should("be.visible");
      cy.arSaveApiCall();
    });
  });

  context("Verify 3 dots  statusbar items", () => {
    it(`Click on 3 dots and verify 'Void' option exists`, () => {
      SystemRequirement("REQ-2800");
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy='void-button']").should("be.visible");
      cy.get("[data-cy='void-button']").arrowClick();
      cy.get("button[data-cy='AlertDialog-cancelButton']").arrowClick();
    });

    it(`Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy='exportToEmail']").should("be.visible");
      cy.get("[data-cy='exportToEmail']").arrowClick();
    });

    it("Check if 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='changeOwner-submit']`).arrowClick();
    });

    it("Verify header is fixed when page scroll", () => {
      cy.get(`[data-cy="form.builder.approvers"]`).scrollIntoView();
      cy.get(`[class*="headerSection"]`).should("be.visible");
    });

    it("Verify 'Send to review' in status bar", () => {
      cy.get("[data-cy='transitionButton']").should("be.visible");
      cy.arClickSendToReview();
    });

    it(`Check doc status as ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Verify IN_REVIEW Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Change OrdersAR-00001 Rev IN REVIEW`,
        breadcrump: true,
      });
    });

    it("Verify Save button in status bar", () => {
      cy.get(".MuiButton-label").contains("Save");
      cy.get(".MuiButton-label").contains("Save").arrowClick();
    });

    it("Verify 'Reject submission' button in status bar", () => {
      cy.get("[data-cy='transition-reject']").contains("Reject submission").arrowClick();
      cy.get(".MuiButton-label").contains("Cancel").arrowClick();
    });

    it("Verify 'Withdraw submission' button in status bar", () => {
      cy.get("[data-cy='change.request.withdraw.alert']").contains("Withdraw submission").arrowClick();
      cy.get(".MuiButton-label").contains("Cancel").arrowClick();
    });

    it("Verify 'Approve submission' button in status bar", () => {
      cy.get("[data-cy='transition-approve']").contains("Approve submission").arrowClick();
      cy.get(".MuiButton-label").contains("Cancel").arrowClick();
    });

    it(`Click on 3 dots and Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy='exportToEmail']").should("be.visible");
      cy.get("[data-cy='exportToEmail']").arrowClick();
    });

    it(`Click on 3 dots and verify 'Change Owner' option exists`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy='changeOwner']").contains("Change Owner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
    });

    it(`Verify 'Last saved' does not exist in statusbar`, () => {
      cy.verifyLastSavedNotExists();
    });

    it(`Verify the statusbar background-color as ORANGE(${Colors.school_bus_yellow})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(239, 162, 11)" });
    });
  });

  context("Approve the AR", () => {
    it("Approve the AR", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.GetRequiredApproversDocRev], () => {
          cy.get("[data-cy='transition-approve']").contains("Approve submission").arrowClick();
          cy.get("[data-cy='transition.action.password']").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
          cy.get("[data-cy='passwordConfirm']").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Verify APPROVED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
    it("Verify APPROVED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Change OrdersAR-00001 Rev APPROVED`,
        breadcrump: true,
      });
    });

    it("Verify 'Close' button is in statusbar", () => {
      cy.get("button[data-cy='transition-closed']").contains("Close").should("exist");
    });

    it(`Click on 3 dots and Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy='exportToEmail']").should("be.visible");
      cy.get("[data-cy='exportToEmail']").arrowClick();
    });

    it("Click on 3 dots and verify 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
    });

    it(`Verify 'Last saved: ' does not exist in Status bar`, () => {
      cy.get("[data-cy='header-last-saved']").should("not.be.exist");
    });

    it(`Verify the statusbar background-color as GREEN(${Colors.latest_green_varient})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(13, 183, 141)" });
    });

    it("Verify header is fixed when page scroll", () => {
      cy.get(`[data-cy="form.builder.approvers"]`).scrollIntoView();
      cy.get(`[class*="headerSection"]`).should("be.visible");
    });
  });

  context("Close the AR", () => {
    it("Close the AR and verify AR status is Closed", () => {
      cy.get("[data-cy='transition-closed']").first().arrowClick();
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PostCloseAR], () => {
          cy.get("[data-cy='AlertDialog-continueButton']").arrowClick();
        });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("Verify CLOSED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
    it("Verify CLOSED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Change OrdersAR-00001 Rev CLOSED`,
        breadcrump: true,
      });
    });

    it(`Verify 'Last saved: ' does not exist in Status bar`, () => {
      cy.get("[data-cy='header-last-saved']").should("not.be.exist");
    });

    it(`Click on 3 dots and Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy='exportToEmail']").should("be.visible");
      cy.get("[data-cy='exportToEmail']").arrowClick();
    });

    it("Click on 3 dots and verify 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
    });

    it(`Verify the statusbar background-color as LIGHT GRAY(${Colors.medium_light_shade_gray})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(162, 162, 162)" });
    });

    it("Verify header is fixed when page scroll", () => {
      cy.get(`[data-cy="form.builder.approvers"]`).scrollIntoView();
      cy.get(`[class*="headerSection"]`).should("be.visible");
    });
  });

  context("Open second AR and Void it", () => {
    it("Navigate to change order list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Filter ar by name and status as DRAFT, and select it", () => {
      SystemRequirement("REQ-0830");
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: approvalRequestName2, status: STATUS_TYPES_LABEL.DRAFT  });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

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

  context("Verify VOIDED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
    it("Verify VOIDED Statusbar exists Icon, Landing page, Doc ID, Rev stage, Status and breadcrump", () => {
      cy.verifyListItemExistsOnHeader({
        listItem:
            `Change OrdersAR-00002 Rev VOIDED`,
        breadcrump: true,
      });
    });

    it(`Verify 'Last saved: ' does not exist in Status bar`, () => {
      cy.get("[data-cy='header-last-saved']").should("not.be.exist");
    });

    it(`Click on 3 dots and Verify 'Send to Email' exists in statusbar`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("[data-cy='exportToEmail']").should("be.visible");
      cy.get("[data-cy='exportToEmail']").arrowClick();
    });

    it("Click on 3 dots and verify 'Change Owner' button exists", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.get("#OwnerChangerPresenter-changeOwner").should("be.visible");
      cy.get("#OwnerChangerPresenter-changeOwner").arrowClick();
      cy.get(`[data-cy='change-owner-close-icon']`).arrowClick();
    });

    it(`Verify VOIDED statusbar background-color as RED(${Colors.latest_red_varient})`, () => {
      cy.verifyStatusbarBgcolor({ bcolor: "rgb(236, 43, 0)" });
    });

    it("Verify header is fixed when page scroll", () => {
      cy.get(`[data-cy="form.builder.approvers"]`).scrollIntoView();
      cy.get(`[class*="headerSection"]`).should("be.visible");
    });
  });
});
