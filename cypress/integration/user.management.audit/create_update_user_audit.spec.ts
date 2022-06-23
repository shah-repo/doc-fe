// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import neatCSV from "neat-csv";
import { CONFIG } from "../../support/config";
import { fileTimeFormat, momentInPST } from "../../utils/constants/dateHandler";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let companyAdmin;
let loginResponse;
let currentDate;

const nameOfFirstUserToSignUp = faker.name.findName();
const emailOfFirstUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();
const nameOfSecondUserToSignUp = faker.name.findName();
const emailOfSecondUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();
const nameOfThirdUserToSignUp = faker.name.findName();
const emailOfThirdUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLocaleLowerCase();
const fileName = "userExport" + fileTimeFormat;
const usersExportList1 = Cypress.config("fileServerFolder") + "/cypress/downloads/" +
fileName + ".csv";
const fileNameWithFilter = "userExportWithFilter" + fileTimeFormat;
const usersExportList2 = Cypress.config("fileServerFolder") + "/cypress/downloads/" +
fileNameWithFilter + ".csv";
const fileNameWithGrouping = "userExportWithGrouping" + fileTimeFormat;
const usersExportList3 = Cypress.config("fileServerFolder") + "/cypress/downloads/" +
fileNameWithGrouping + ".csv";

context("User Creation Flow", () => {
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
            users: [USERS[4], { name: nameOfThirdUserToSignUp, email: emailOfThirdUserToSignUp }],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          companyAdmin = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });
  });

  context("Login company admin", () => {
    it("Login in admin user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: companyAdmin.id });
    });
  });

  context("Navigates to User management", () => {
    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });
  });

  context("Check history button is visible", () => {
    it("Check history button is visible", () => {
      cy.usrVerifyHistoryButton();
    });
  });

  context(`Create user ${nameOfFirstUserToSignUp}`, () => {
    it("Clicks on 'Add Employee'", () => {
      cy.usrClickAddEmployee();
    });

    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: emailOfFirstUserToSignUp });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: nameOfFirstUserToSignUp });
    });

    it("Clicks the save button", () => {
      cy.usrClickSaveButton();
      currentDate = momentInPST().format("MMM D, YYYY hh:mm");
    });
  });

  context(`Check if the history is created for ${nameOfFirstUserToSignUp}`, () => {
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Verify creator of user", () => {
      cy.usrHistoryVerifyCreator({ name: USERS[1].name });
    });

    it("Verify user added datetime", () => {
      cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
    });

    it("Verify added user's name", () => {
      cy.usrHistoryVerifyAddedNewUser({ name: nameOfFirstUserToSignUp });
    });

    it("Verify added user's email", () => {
      cy.usrHistoryVerifyAddedUserEmail({ email: emailOfFirstUserToSignUp });
    });

    it("Verify user added to group", () => {
      cy.usrHistoryAddedToGroups("Can be approver", "Owner as approver", "Everyone");
    });

    it("Verify added user's status", () => {
      cy.usrHistoryVerifyUpdatedStatus({ name: nameOfFirstUserToSignUp, status: "Active" });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context(`Create user ${nameOfSecondUserToSignUp} and click cancel`, () => {
    it("Clicks on 'Add Employee'", () => {
      cy.usrClickAddEmployee();
    });

    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: emailOfSecondUserToSignUp });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: nameOfSecondUserToSignUp });
    });

    it("Clicks the cancel button", () => {
      cy.usrClickCancelButton();
    });
  });

  context(`Check if the change name history is not created for ${nameOfFirstUserToSignUp}`, () => {
    it("Open history panel", () => {
      cy.usrHistoryClickOpenButton();
    });

    it("Verify no new record is added", () => {
      cy.usrHistoryVerifyRecordsCount({ records: 2 });
    });

    it("Close history panel", () => {
      cy.usrHistoryClickCloseButton();
    });
  });

  context(`Click on resend signup email for ${nameOfFirstUserToSignUp}`, () => {
    it(`Filter ${nameOfFirstUserToSignUp}`, () => {
      cy.usrFilterByEmail({ email: emailOfFirstUserToSignUp });
    });

    it("Click on resend signup email", () => {
      cy.contains("Resend signup email").arrowClick();
      currentDate = momentInPST().format("MMM D, YYYY hh:mm");
    });

    it("Verify popup message \"Signup email sent\"", () => {
      cy.checkToastMessageContains({
        message: "Signup email sent",
      });
    });
  });

  context(`Check if the signup history is created for ${nameOfFirstUserToSignUp}`, () => {
    it("Check history is created", () => {
      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify creator of user", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify user added datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify resend signup email is recorded", () => {
        cy.usrHistoryVerifyResentSignupEmail();
      });

      it("Verify resend signup email for user is recorded", () => {
        cy.usrHistoryVerifyForUser({ name: nameOfFirstUserToSignUp });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context("Logout user", () => {
    it("Logout user", () => {
      cy.authLogout();
    });
  });

  context("Login with user by inserting wrong password 5 times", () => {
    it("Enter wrong password 5 times", () => {
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfFirstUserToSignUp, password: "tester123" });
    });
  });

  context("Log in as company admin", () => {
    it("Login in admin user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: companyAdmin.id });
    });
  });

  context(`Goto user management and reset password for ${nameOfFirstUserToSignUp}`, () => {
    it("Navigate to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("click reset password for user", () => {
      cy.usrFilterByEmail({ email: emailOfFirstUserToSignUp });
      cy.contains("Reset Password").arrowClick();
      currentDate = momentInPST().format("MMM D, YYYY hh:mm");
    });

    it("Verify popup message \"Reset password email sent\"", () => {
      cy.checkToastMessageContains({
        message: "Reset password email sent",
      });
    });
  });

  context(`Check if the reset password email history is created for ${nameOfFirstUserToSignUp}`, () => {
    it("Check history is created", () => {
      it("Open history panel", () => {
        cy.usrHistoryClickOpenButton();
      });

      it("Verify creator of user", () => {
        cy.usrHistoryVerifyCreator({ name: USERS[1].name });
      });

      it("Verify user added datetime", () => {
        cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
      });

      it("Verify reset password is recorded", () => {
        cy.usrHistoryVerifyResetPassword();
      });

      it("Verify reset password for user is recorded", () => {
        cy.usrHistoryVerifyForUser({ name: nameOfFirstUserToSignUp });
      });

      it("Close history panel", () => {
        cy.usrHistoryClickCloseButton();
      });
    });
  });

  context(`deactivate, reactivate user ${nameOfThirdUserToSignUp} and verify history`, () => {
    context(`Deactivate ${nameOfThirdUserToSignUp}`, () => {
      it(`Click edit button for ${nameOfThirdUserToSignUp}`, () => {
        cy.grpClearFilter();
        cy.usrClickEditUser({ name: nameOfThirdUserToSignUp });
      });

      it("Click deactivate button", () => {
        cy.usrClickStatusButton();
        cy.usrClickCloseDialogButton();
        currentDate = momentInPST().format("MMM D, YYYY hh:mm");
      });
    });

    context(`Check if the deactivate history is created for ${nameOfThirdUserToSignUp}`, () => {
      it("Check history is created", () => {
        it("Open history panel", () => {
          cy.usrHistoryClickOpenButton();
        });

        it("Verify creator of user", () => {
          cy.usrHistoryVerifyCreator({ name: USERS[1].name });
        });

        it("Verify user added datetime", () => {
          cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
        });

        it("Verify deactivation of user is recorded", () => {
          cy.usrHistoryVerifyDeactivatedUser({ name: nameOfThirdUserToSignUp });
        });

        it("Close history panel", () => {
          cy.usrHistoryClickCloseButton();
        });
      });
    });

    context(`Reactivate ${nameOfThirdUserToSignUp}`, () => {
      it(`Click edit button for ${nameOfThirdUserToSignUp}`, () => {
        cy.usrClickEditUser({ name: nameOfThirdUserToSignUp });
      });

      it("Click reactivate button", () => {
        cy.usrClickStatusButton();
        cy.usrClickCloseDialogButton();
        currentDate = momentInPST().format("MMM D, YYYY hh:mm");
      });
    });

    context(`Check if the reactivate history is created for ${nameOfThirdUserToSignUp}`, () => {
      it("Check history is created", () => {
        it("Open history panel", () => {
          cy.usrHistoryClickOpenButton();
        });

        it("Verify creator of user", () => {
          cy.usrHistoryVerifyCreator({ name: USERS[1].name });
        });

        it("Verify user added datetime", () => {
          cy.usrHistoryVerifyCurrentDate({ dateTime: currentDate });
        });

        it("Verify reactivation of user is recorded", () => {
          cy.usrHistoryVerifyReactivatedUser({ name: nameOfThirdUserToSignUp });
        });

        it("Close history panel", () => {
          cy.usrHistoryClickCloseButton();
        });
      });
    });

    context("Without appling any filter click on 'Export list' button", () => {
      it("Navigates to User management", () => {
        cy.grpClearFilter();
        cy.get("#ListPresenter-export-list").arrowClick();
        cy.get("#ExportListDialog-fileName").arrowType(fileName);
        cy.get("#ExportListDialog-downloadButton").arrowClick();
      });
    });

    context("Verify exported csv file", () => {
      it("Verify line 1 group from dowloaded file", () => {
        cy.readFile(usersExportList1)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[0].Active).to.equal("Active");
            expect(csv[0].Email).to.equal(emailOfThirdUserToSignUp);
            expect(csv[0].Name).to.equal(nameOfThirdUserToSignUp);
            // eslint-disable-next-line max-len
            expect(csv[0].Groups).to.equal("Can be approver, Everyone, Owner as approver");
            expect(csv[0]["\"Signed Up\""]).to.equal("Resend signup email");
          });
      });

      it("Verify line 2 group from dowloaded file", () => {
        cy.readFile(usersExportList1)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[1].Active).to.equal("Active");
            expect(csv[1].Email).to.equal(emailOfFirstUserToSignUp);
            expect(csv[1].Name).to.equal(nameOfFirstUserToSignUp);
            expect(csv[1].Groups).to.equal("Can be approver, Everyone, Owner as approver");
            expect(csv[1]["\"Signed Up\""]).to.equal("Reset Password");
          });
      });

      it("Verify line 3 group from dowloaded file", () => {
        cy.readFile(usersExportList1)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[2].Active).to.equal("Active");
            expect(csv[2].Email).to.equal(USERS[4].email);
            expect(csv[2].Name).to.equal(USERS[4].name);
            expect(csv[2].Groups).to.equal("Can be approver, Everyone, Owner as approver");
            expect(csv[2]["\"Signed Up\""]).to.equal("Resend signup email");
          });
      });

      it("Verify line 4 group from dowloaded file", () => {
        cy.readFile(usersExportList1)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[3].Active).to.equal("Active");
            expect(csv[3].Email).to.equal(USERS[1].email);
            expect(csv[3].Name).to.equal(USERS[1].name);
            // eslint-disable-next-line max-len
            expect(csv[3].Groups).to.equal("Company Admin, Everyone, Groups Management, Groups Management Unofficial, Owner as approver, User Management");
            expect(csv[3]["\"Signed Up\""]).to.equal("Resend signup email");
          });
      });

      it("Verify line 5 group from dowloaded file", () => {
        cy.readFile(usersExportList1)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[4].Active).to.equal("Active");
            expect(csv[4].Email).to.equal("enlil.testmail+cyimporter@gmail.com");
            expect(csv[4].Name).to.equal(USERS[5].name);
            expect(csv[4].Groups).to.equal("Company Admin, Owner as approver");
            expect(csv[4]["\"Signed Up\""]).to.equal("Resend signup email");
          });
      });
    });

    context("Apply filter and click on 'Export list' button", () => {
      it("Navigates to User management", () => {
        cy.grpClearFilter();
        cy.usrFilterByEmail({ email: emailOfFirstUserToSignUp });
        cy.get("#ListPresenter-export-list").arrowClick();
        cy.get("#ExportListDialog-fileName").arrowType(fileNameWithFilter);
        cy.get("#ExportListDialog-downloadButton").arrowClick();
      });
    });

    context("Verify exported csv file", () => {
      it("Verify line 1 group from dowloaded file", () => {
        cy.readFile(usersExportList2)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[0].Active).to.equal("Active");
            expect(csv[0].Email).to.equal(emailOfFirstUserToSignUp);
            expect(csv[0].Name).to.equal(nameOfFirstUserToSignUp);
            expect(csv[0].Groups).to.equal("Can be approver, Everyone, Owner as approver");
            expect(csv[0]["\"Signed Up\""]).to.equal("Reset Password");
          });
      });
    });

    context("Select column grouping and click on 'Export list' button", () => {
      it("Navigates to User management", () => {
        cy.grpClearFilter();
        cy.get(`th[aria-colindex="1"][role]>div.k-grid-column-menu`).arrowClick();
        cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column").arrowClick();
        cy.get("#ListPresenter-export-list").arrowClick();
        cy.get("#ExportListDialog-fileName").arrowType(fileNameWithGrouping);
        cy.get("#ExportListDialog-downloadButton").arrowClick();
      });
    });

    context("Verify exported csv file", () => {
      it("Verify line 1 group from dowloaded file", () => {
        cy.readFile(usersExportList3)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[0].Active).to.equal("Active");
            expect(csv[0].Email).to.equal(emailOfThirdUserToSignUp);
            expect(csv[0].Name).to.equal(nameOfThirdUserToSignUp);
            expect(csv[0].Groups).to.equal("Can be approver, Everyone, Owner as approver");
            expect(csv[0]["\"Signed Up\""]).to.equal("Resend signup email");
          });
      });

      it("Verify line 2 group from dowloaded file", () => {
        cy.readFile(usersExportList3)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[1].Active).to.equal("Active");
            expect(csv[1].Email).to.equal(USERS[4].email);
            expect(csv[1].Name).to.equal(USERS[4].name);
            expect(csv[1].Groups).to.equal("Can be approver, Everyone, Owner as approver");
            expect(csv[1]["\"Signed Up\""]).to.equal("Resend signup email");
          });
      });

      it("Verify line 3 group from dowloaded file", () => {
        cy.readFile(usersExportList3)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[2].Active).to.equal("Active");
            expect(csv[2].Email).to.equal(USERS[1].email);
            expect(csv[2].Name).to.equal(USERS[1].name);
            // eslint-disable-next-line max-len
            expect(csv[2].Groups).to.equal("Company Admin, Everyone, Groups Management, Groups Management Unofficial, Owner as approver, User Management");
            expect(csv[2]["\"Signed Up\""]).to.equal("Resend signup email");
          });
      });

      it("Verify line 4 group from dowloaded file", () => {
        cy.readFile(usersExportList3)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[3].Active).to.equal("Active");
            expect(csv[3].Email).to.equal("enlil.testmail+cyimporter@gmail.com");
            expect(csv[3].Name).to.equal(USERS[5].name);
            expect(csv[3].Groups).to.equal("Company Admin, Owner as approver");
            expect(csv[3]["\"Signed Up\""]).to.equal("Resend signup email");
          });
      });

      it("Verify line 5 group from dowloaded file", () => {
        cy.readFile(usersExportList3)
          .then(async (text) =>
          {
            const csv = await neatCSV(text, {
              mapHeaders: ({ header, index }) => header.replace(/^\uFEFF/gm, ""),
            });

            expect(csv[4].Active).to.equal("Active");
            expect(csv[4].Email).to.equal(emailOfFirstUserToSignUp);
            expect(csv[4].Name).to.equal(nameOfFirstUserToSignUp);
            expect(csv[4].Groups).to.equal("Can be approver, Everyone, Owner as approver");
            expect(csv[4]["\"Signed Up\""]).to.equal("Reset Password");
          });
      });

    });
  });
});

export { };

