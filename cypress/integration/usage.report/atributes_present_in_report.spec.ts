/* eslint-disable @typescript-eslint/camelcase */

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

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

context("Check Usage report atributes are present in report", { tags: ["@timetool"] }, () => {
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

  context("Verify Users Report attributes", () => {
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

  context("Verify All Companies Report attributes", () => {
    it("Verify different document types", () => {
      const docRecordItemKey = "Doc/Record/Items";
      const differentTypes = [
        "Parts",
        "Equipment",
        "Supplier",
        "Purchase Order",
        "Receiving",
        "EB",
        "LHR",
        "LOT",
        "Records",
        "Documents",
        "Approval Requests",
        "Training Records",
      ];

      for (let i = 0; i < differentTypes.length; i++) {
        assert.oneOf(allCompaniesReportJSON[i][docRecordItemKey], differentTypes);
      }
    });
  });

  context("Verify Report Per Company attributes", () => {
    it("Verify different document types", () => {
      const docRecordItemKey = "";
      const releasedCompletedKey = createdCompany.name;
      const draftPendingKey = "__EMPTY";
      const differentTypes = [
        "Parts",
        "Equipment",
        "Supplier",
        "Purchase Order",
        "Receiving",
        "EB",
        "LHR",
        "LOT",
        "Records",
        "Documents",
        "Approval Requests",
        "Training Records",
      ];

      assert.strictEqual(reportPerCompanyJSON[0][releasedCompletedKey], "Released/Completed");
      assert.strictEqual(reportPerCompanyJSON[0][draftPendingKey],  "Draft/Pending");

      for (let i = 1; i <= differentTypes.length; i++) {
        assert.oneOf(reportPerCompanyJSON[i][docRecordItemKey], differentTypes);
      }
    });
  });

  context("Verify Session Time report attributes", () => {
    it("Verify total time spent in system", () => {
      const timeSpentInSystemKey = "Time spent in the system";
      const textOfTimeSpentInTheSystem = "Average Session Time (minutes)";
      const valueOfTimeSpentInSystemKey = "__EMPTY";

      const total = sessionTimeJSON[sessionTimeJSON.length - 1];
      assert.exists(total[timeSpentInSystemKey]);
      assert.strictEqual(total[timeSpentInSystemKey], textOfTimeSpentInTheSystem);
      assert.exists(total[valueOfTimeSpentInSystemKey]);
    });
  });
});
