/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, momentInPST } from "../../utils/constants/dateHandler";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let asyncTasksGroup;
let dateAfterEmailShouldArrive;
let emailsFromInbox;
let secondEmployee;
let usersReportJSON;
let allCompaniesReportJSON;
let reportPerCompanyJSON;
let sessionTimeJSON;

const usageReportTomorrow = momentInPST().add("days", "2").format("YYYY-MM-DDThh:mm");

const usageReportXlsxFileName = "Usage_report_" + fileTimeFormat + ".xlsx";
const usageReportXlsxFileNameAndPath = "cypress/downloads/" + usageReportXlsxFileName;

context("Usage report document counter for new revisions", () => {
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
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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
            {
              id: secondEmployee.id,
            },
          ],
        },
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Submit request for usage report", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task USAGE_REPORT", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.USAGE_REPORT });
    });

    it("Select date time", () => {
      cy.get("#datetime-local").eq(0).arrowType(usageReportTomorrow);
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context("Get report and parse it", () => {
    it("Get attachment from email", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.wait(20000);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Enlil Usage Report:`,
        include_attachments: true,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
        const attachmentData = emailsFromInbox[0].attachments[0].data;
        cy.writeFile(usageReportXlsxFileNameAndPath, attachmentData, "base64");
      });
    });

    it("Parse to JSON for users report", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "Users Report" }).then((rows: any) => {
        usersReportJSON = rows;
      });
    });

    it("Parse to JSON for All Companies Report", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "All Companies Report" })
        .then((rows: any) => {
          allCompaniesReportJSON = rows;
        });
    });

    it("Parse to JSON for number of documents", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "Report Per Company" }).then((rows: any) => {
        reportPerCompanyJSON = rows;
      });
    });

    it("Parse to JSON for session time", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "Session Time" }).then((rows: any) => {
        sessionTimeJSON = rows;
      });
    });
  });

  context("Verify number of users", () => {
    it("Verify total users report exist", () => {
      const companyKey = "Enlil Customer (enlil.io)";
      const registeredUsersKey = "Registered Users";
      const uniqueUsersKey = "Unique Users";

      const total = usersReportJSON[usersReportJSON.length - 2];
      assert.exists(total[uniqueUsersKey]);
      assert.exists(total[registeredUsersKey]);
      assert.exists(total[companyKey]);
    });
  });
});
