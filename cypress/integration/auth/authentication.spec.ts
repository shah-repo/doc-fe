import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

context("Authentication", () => {
  context("Check login validations", () => {
    it("Visit login page", () => {
      cy.authVisitLogin();
    });

    it("Submit empty login form", () => {
      cy.authSubmitLogin();
    });

    it("Required Validation for email triggered", () => {
      SystemRequirement("REQ-2660");
      cy.authRequiredValidation({ selector: "field-email", show: true });
    });

    it("Required Validation for password triggered", () => {
      SystemRequirement("REQ-2660");
      cy.authRequiredValidation({ selector: "field-password", show: true });
    });

    it("Type invalid email", () => {
      SystemRequirement("REQ-2660");
      cy.authEnterEmail({ value: "asd" });
    });

    it("Invalid email validation should be triggered", () => {
      SystemRequirement("REQ-2660");
      cy.authInvalidEmailValidation();
    });

    it("Type incorrect email", () => {
      SystemRequirement("REQ-2660");
      cy.authEnterEmail({ value: "qwe@asd.com" });
    });

    it("Type incorrect password", () => {
      SystemRequirement("REQ-2660");
      cy.authEnterPassword({ value: "qweasdzxc" });
    });

    it("No Validation for email must be shown", () => {
      SystemRequirement("REQ-2660");
      cy.authRequiredValidation({ selector: "field-email", show: false });
    });

    it("No Validation for password must be shown", () => {
      SystemRequirement("REQ-2660");
      cy.authRequiredValidation({ selector: "field-password", show: false });
    });

    it("Submit incorrect login credentials", () => {
      SystemRequirement("REQ-2660");
      cy.authSubmitLogin();
    });

    it("Error triggered for incorrect login credentials", () => {
      SystemRequirement("REQ-2660");
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
    });
  });

  context("Incorrect email and correct password", () => {
    it("Type incorrect email", () => {
      SystemRequirement("REQ-2660");
      cy.authEnterEmail({ value: "qwe@asd.com" });
    });

    it("Type correct password", () => {
      SystemRequirement("REQ-2660");
      cy.authEnterPassword({ value: "Tester1" });
    });

    it("Submit form", () => {
      SystemRequirement("REQ-2660");
      cy.authSubmitLogin();
    });

    it("Error triggered for incorrect login credentials", () => {
      SystemRequirement("REQ-2660");
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
    });
  });

  context("Correct email and incorrect password", () => {
    it("Type correct email", () => {
      SystemRequirement("REQ-2660");
      cy.authEnterEmail({ value: USERS[2].email });
    });

    it("Type incorrect password", () => {
      SystemRequirement("REQ-2660");
      cy.authEnterPassword({ value: "aasdasd" });
    });

    it("Submit form", () => {
      SystemRequirement("REQ-2660");
      cy.authSubmitLogin();
    });

    it("Error triggered for incorrect login credentials", () => {
      SystemRequirement("REQ-2660");
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
    });
  });

  context("Login user with correct credentials", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Successful login with no error", () => {
      SystemRequirement("REQ-2660");
      cy.authSubmitLoginError({ show: false });
    });
  });
});

export { };

