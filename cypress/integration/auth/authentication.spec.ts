import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

context("Authentication", () => {
  context("Check login validations", () => {
    SystemRequirement("REQ-2660");
    it("Visit login page", () => {
      cy.authVisitLogin();
    });

    it("Submit empty login form", () => {
      cy.authSubmitLogin();
    });

    it("Required Validation for email triggered", () => {
      cy.authRequiredValidation({ selector: "field-email", show: true });
    });

    it("Required Validation for password triggered", () => {
      cy.authRequiredValidation({ selector: "field-password", show: true });
    });

    it("Type invalid email", () => {
      cy.authEnterEmail({ value: "asd" });
    });

    it("Invalid email validation should be triggered", () => {
      cy.authInvalidEmailValidation();
    });

    it("Type incorrect email", () => {
      cy.authEnterEmail({ value: "qwe@asd.com" });
    });

    it("Type incorrect password", () => {
      cy.authEnterPassword({ value: "qweasdzxc" });
    });

    it("No Validation for email must be shown", () => {
      cy.authRequiredValidation({ selector: "field-email", show: false });
    });

    it("No Validation for password must be shown", () => {
      cy.authRequiredValidation({ selector: "field-password", show: false });
    });

    it("Submit incorrect login credentials", () => {
      cy.authSubmitLogin();
    });

    it("Error triggered for incorrect login credentials", () => {
      cy.authSubmitLoginError({ show: true, message: "Incorrect username or password." });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Successful login with no error", () => {
      cy.authSubmitLoginError({ show: false });
    });
  });
  /* context("[API]Prepare company", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            maxRevisionStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP",
                group: "OTHER",
                isQms: true,
              },
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
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  }); */
});

export { };

