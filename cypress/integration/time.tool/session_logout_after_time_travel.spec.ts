// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { CONFIG } from "../../support/config";
import { LegalRecord } from "../../utils/constants/documentTypes/record";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let asyncTasksGroup;

context("Session logout after time travel flow", { tags: ["@timetool"] }, () => {
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
              LegalRecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login admin user", (done: any) => {
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
        employeeId: adminEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [
            {
              id: adminEmployee.id,
            },
          ],
        },
      });
    });


    context("Login user", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });
    });

    context("Time travel 30 minutes back to the future", () => {
      it("Navigate to async tasks", () => {
        cy.navigToAsyncTasks();
      });

      it("Select task TIME_TRAVEL_USER_SESSION", () => {
        cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_USER_SESSION });
      });

      it("Select 30 minutes to back in future", () => {
        cy.asyncSelectBackToTheFutureTime({ minute: 30 });
      });

      it("Submit async task", () => {
        cy.asyncSessionTaskClickSubmit();
      });

      it("Verify user is logged in", () => {
        cy.reload();
        cy.landingPageLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.navigListExistsCheck(
          NavigationItems.DASHBOARD,
          NavigationItems.DOCUMENT_CONTROL);
      });

    });

    context("Time travel 45 minutes back to the future", () => {
      it("Navigate to async tasks", () => {
        cy.navigToAsyncTasks();
      });

      it("Select task TIME_TRAVEL_USER_SESSION", () => {
        cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_USER_SESSION });
      });

      it("Select 45 minutes to back in future", () => {
        cy.asyncSelectBackToTheFutureTime({ minute: 45 });
      });

      it("Submit async task", () => {
        cy.asyncSessionTaskClickSubmit();

      });

      context("Verify that the user is logged out", () => {
        it("Verify user can't access below list", () => {
          cy.reload();
          cy.landingPageLoadingElementShouldNotExist();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.navigListNotExistsCheck(
            NavigationItems.DASHBOARD,
            NavigationItems.DOCUMENT_CONTROL);
        });
      });

    });
  });

});
export { };
