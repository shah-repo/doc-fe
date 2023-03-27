// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import { CONFIG } from "../../support/config";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;

const dateTime = new Date().getTime();
const nameOfAdminUserToSignUp = faker.name.findName();
const emailOfAdminUserToSignUp = `enlil.testmail+${dateTime}admin@gmail.com`;
const nameOfUserToSignUp = faker.name.findName();
const emailOfUserToSignUp = `enlil.testmail+${dateTime}user@gmail.com`;
const newPassword = "Tester123#!";

context("Multiple consecutive logins", () => {
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
          done();
        });
      });
    });
  });

  context("Add Admin user by company admin", () => {
    context("Log in as company admin", () => {
      it("Logs user in", () => {
        cy.authLogin({ email: USERS[1].email });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Add admin user to company", () => {
      it("Navigate to User management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Click 'ADD EMPLOYEE'", () => {
        cy.usrClickAddEmployee();
      });

      it("Enters e-mail", () => {
        cy.usrEnterEmail({ email: emailOfAdminUserToSignUp });
      });

      it("Enters name", () => {
        cy.usrEnterName({ name: nameOfAdminUserToSignUp });
      });

      it("Clicks the save button", () => {
        cy.usrClickPlusSaveButton();
        cy.checkToastMessage({ exists: false });
      });

      it("Verify activation email", () => {
        cy.imapGetActivationLink({ userEmail: emailOfAdminUserToSignUp });
      });

      it("Enter password", () => {
        cy.authEnterSignUpPassword();
      });

      it("Enter password for confirmation", () => {
        cy.authEnterSignUpConfirmPassword();
      });

      it("Click 'SIGN IN'", () => {
        cy.authClickSignIn();
      });

      it("Logout", () => {
        cy.authLogout();
      });
    });
  });

  context("Add normal user by company admin", () => {
    context("Log in as company admin", () => {
      it("Logs user in", () => {
        cy.authLogin({ email: USERS[1].email });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Add normal user to company", () => {
      it("Navigate to User management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Click 'ADD EMPLOYEE'", () => {
        cy.usrClickAddEmployee();
      });

      it("Enters e-mail", () => {
        cy.usrEnterEmail({ email: emailOfUserToSignUp });
      });

      it("Enters name", () => {
        cy.usrEnterName({ name: nameOfUserToSignUp });
      });

      it("Clicks the save button", () => {
        cy.usrClickPlusSaveButton();
        cy.checkToastMessage({ exists: false });
      });

      it("Verify activation email", () => {
        cy.imapGetActivationLink({ userEmail: emailOfUserToSignUp });
      });

      it("Enter password", () => {
        cy.authEnterSignUpPassword();
      });

      it("Enter password for confirmation", () => {
        cy.authEnterSignUpConfirmPassword();
      });

      it("Click 'SIGN IN'", () => {
        cy.authClickSignIn();
      });

      it("Logout", () => {
        cy.authLogout();
      });
    });
  });

  context("Lock unlock normal user", () => {
    context("Login with normal user by inserting wrong password 5 times", () => {
      it("Enter wrong password 5 times", () => {
        SystemRequirement("REQ-3970");
        cy.authLoginWithInvalidPassword({ email: emailOfUserToSignUp, password: "tester123" });
        cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
        cy.authLoginWithInvalidPassword({ email: emailOfUserToSignUp, password: "tester123" });
        cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
        cy.authLoginWithInvalidPassword({ email: emailOfUserToSignUp, password: "tester123" });
        cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
        cy.authLoginWithInvalidPassword({ email: emailOfUserToSignUp, password: "tester123" });
        cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
        cy.authLoginWithInvalidPassword({ email: emailOfUserToSignUp, password: "tester123" });
        cy.wait(5000);
      });
    });

    context("User should see locked notification", () => {
      it("Should see locked notification", () => {
        SystemRequirement("REQ-3970");
        cy.get("[data-cy=UserLocked-lockedInfo]", { timeout: 10000 })
          .should("have.text", "Your account has been locked.");
        cy.get("[data-cy=UserLocked-infoLink]").should("have.text",
          "Please contact your Company Admin for Enlil to reset your password.");
      });
    });

    context("Log in as company admin", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Goto user management and reset password for user", () => {
      it("Navigate to User management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("click reset password for user", () => {
        cy.usrFilterByEmail({ email: emailOfUserToSignUp });
        cy.contains("Reset Password").arrowClick();
      });

      it("Get email to unlock account", () => {
        cy.imapGetNewPasswordLink({ userEmail: emailOfUserToSignUp });
      });
    });

    context("Error message should be displayed on input invalid passwords", () => {
      it("Error message on input old password", () => {
        SystemRequirement("REQ-4200");
        cy.authEnterSignUpPassword();
        cy.authEnterSignUpConfirmPassword();
        cy.get("[id=\"ConfirmPasswordPresenter-loginSubmit\"]").arrowClick();
        cy.authSubmitLoginError({ show: true, message: "Password was previously in use." });
      });

      it("Error message on input password without lower case", () => {
        cy.get("[name=\"password\"]").clear();
        cy.authEnterSignUpPassword({ password: "TESTER1!" });
        cy.get("[name=\"confirmPass\"]").clear();
        cy.authEnterSignUpConfirmPassword({ password: "TESTER1!" });
        cy.get("[name=\"password\"]").parent().next()
          .should("have.text", "Password must contain a lower case letter");
      });

      it("Error message on input password without uppercase case", () => {
        cy.get("[name=\"password\"]").clear();
        cy.authEnterSignUpPassword({ password: "tester1!" });
        cy.get("[name=\"confirmPass\"]").clear();
        cy.authEnterSignUpConfirmPassword({ password: "tester1!" });
        cy.get("[name=\"password\"]").parent().next()
          .should("have.text", "Password must contain an upper case letter");
      });

      it("Error message on input password without special character", () => {
        cy.get("[name=\"password\"]").clear();
        cy.authEnterSignUpPassword({ password: "Tester12" });
        cy.get("[name=\"confirmPass\"]").clear();
        cy.authEnterSignUpConfirmPassword({ password: "Tester12" });
        cy.get("[name=\"password\"]").parent().next()
          .should("have.text", "Password must contain a special characters");
      });

      it("Error message on input password without number", () => {
        cy.get("[name=\"password\"]").clear();
        cy.authEnterSignUpPassword({ password: "Tester!!" });
        cy.get("[name=\"confirmPass\"]").clear();
        cy.authEnterSignUpConfirmPassword({ password: "Tester!!" });
        cy.get("[name=\"password\"]").parent().next()
          .should("have.text", "Password must contain a number");
      });
    });

    context("Enter valid password", () => {
      it("Enter password", () => {
        cy.get("[name=\"password\"]").clear();
        cy.authEnterSignUpPassword({ password: newPassword });
      });

      it("Enter password for confirmation", () => {
        cy.get("[name=\"confirmPass\"]").clear();
        cy.authEnterSignUpConfirmPassword({ password: newPassword });
      });

      it("Click 'SIGN IN'", () => {
        cy.get("[id=\"ConfirmPasswordPresenter-loginSubmit\"]").arrowClick();
      });

      it("Password Reset Successfully should be displayed", () => {
        cy.contains("Password Reset Successfully!", { timeout: 15000 }).should("be.visible");
      });

      it("Logs user in", () => {
        cy.authLogin({ email: emailOfUserToSignUp, password: newPassword });
      });

      it("Verify user is loged in", () => {
        cy.navigListExistsCheck( NavigationItems.DASHBOARD, NavigationItems.DOCUMENT_CONTROL);
      });

      it("Logout", () => {
        cy.authLogout();
      });
    });
  });

  context("Lock unlock admin user", () => {
    context("login with admin user by inserting wrong password 5 times", () => {
      it("Enter wrong password 5 times", () => {
        cy.authLoginWithInvalidPassword({ email: emailOfAdminUserToSignUp, password: "tester123" });
        cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
        cy.authLoginWithInvalidPassword({ email: emailOfAdminUserToSignUp, password: "tester123" });
        cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
        cy.authLoginWithInvalidPassword({ email: emailOfAdminUserToSignUp, password: "tester123" });
        cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
        cy.authLoginWithInvalidPassword({ email: emailOfAdminUserToSignUp, password: "tester123" });
        cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
        cy.authLoginWithInvalidPassword({ email: emailOfAdminUserToSignUp, password: "tester123" });
        cy.wait(5000);
      });
    });

    context("AdminUser should see locked notification", () => {
      it("should see locked notification", () => {
        cy.get("[data-cy=UserLocked-lockedInfo]").should("have.text", "Your account has been locked.");
      });
    });

    context("Log in as company admin", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Goto user management and reset password for admin user", () => {
      it("Navigate to User management", () => {
        cy.usrNavigateToUserManagement();
      });

      it("click reset password for user", () => {
        cy.usrFilterByEmail({ email: emailOfAdminUserToSignUp });
        cy.contains("Reset Password").arrowClick();
      });

      it("Get email to unlock account", () => {
        cy.imapGetNewPasswordLink({ userEmail: emailOfAdminUserToSignUp });
      });

      it("Enter password", () => {
        cy.authEnterSignUpPassword({ password: newPassword });
      });

      it("Enter password for confirmation", () => {
        cy.authEnterSignUpConfirmPassword({ password: newPassword });
      });

      it("Click 'SIGN IN'", () => {
        cy.get("[id=\"ConfirmPasswordPresenter-loginSubmit\"]").arrowClick();
      });

      it("Password Reset Successfully should be displayed", () => {
        cy.contains("Password Reset Successfully!", { timeout: 15000 }).should("be.visible");
      });

      it("Logs user in", () => {
        cy.authLogin({ email: emailOfAdminUserToSignUp, password: newPassword });
      });

      it("Verify user is loged in", () => {
        cy.navigListExistsCheck(NavigationItems.DASHBOARD, NavigationItems.DOCUMENT_CONTROL);
      });

      it("Logout", () => {
        cy.authLogout();
      });
    });
  });

  context("Login with normal user after 3 incorrect password", () => {
    it("Enter wrong password 3 times", () => {
      cy.authLoginWithInvalidPassword({ email: emailOfUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
    });

    it("Login user with correct password", () => {
      cy.authLogin({ email: emailOfUserToSignUp, password: newPassword });
    });

    it("Verify user is loged in", () => {
      cy.navigListExistsCheck( NavigationItems.DASHBOARD, NavigationItems.DOCUMENT_CONTROL);
    });

    it("Logout", () => {
      cy.authLogout();
    });
  });

  context("Login with admin user after 3 incorrect password", () => {
    it("Enter wrong password 3 times", () => {
      cy.authLoginWithInvalidPassword({ email: emailOfAdminUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfAdminUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
      cy.authLoginWithInvalidPassword({ email: emailOfAdminUserToSignUp, password: "tester123" });
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
    });

    it("Login admin user with correct password", () => {
      cy.authLogin({ email: emailOfAdminUserToSignUp, password: newPassword });
    });

    it("Verify admin user is loged in", () => {
      cy.navigListExistsCheck( NavigationItems.DASHBOARD, NavigationItems.DOCUMENT_CONTROL);
    });

    it("Logout", () => {
      cy.authLogout();
    });
  });
});
