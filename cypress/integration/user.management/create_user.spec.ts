import { SystemRequirement } from "../../utils/context/systemRequirement";

const runId = new Date().valueOf();

let createdCompany;
let loginResponse;
let multipleCompanies;

context("User Creation Flow", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: "enlil.testmail+cy1@gmail.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
            name: `Test Company ${runId}`,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [
              {
                name: "Second Tester",
                email: "enlil.testmail+cy2@gmail.com",
              },
              {
                name: "Third Tester",
                email: "enlil.testmail+cy3@gmail.com",
              },
              {
                name: "Fourth Tester",
                email: "enlil.testmail+cy4@gmail.com",
              }],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: "enlil.testmail+cy2@gmail.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1;
        done();
      });
    });
  });

  context("Login company admin", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: "enlil.testmail+cy1@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start add a user flow", () => {
    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Clicks on 'Add Employee'", () => {
      cy.usrClickAddEmployee();
    });
  });

  context("Fill in user attributes", () => {
    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: "enlil.testmail+cy10@gmail.com" });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: "Tenth Tester" });
    });
  });

  context("Create user", () => {
    it("Clicks the save button", () => {
      cy.usrClickSaveButton();
    });
  });

  context("Check if the user is created", () => {
    it("Clicks on the close button", () => {
      cy.usrClickCloseDialogButton();
    });
    it("Checks if user is in the table", () => {
      SystemRequirement("REQ-2490");
      cy.usrCheckIfUserIsCreated({ email: "enlil.testmail+cy10@gmail.com" });
    });
  });
});

export { };
