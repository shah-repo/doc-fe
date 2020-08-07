import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Group Creation Flow", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: "enlil.testmail+cy1@gmail.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
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

  context("Start add an official group flow", () => {
    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Clicks on 'Add Group'", () => {
      cy.grpClickAddGroup();
    });
  });

  context("Fill in official group attributes", () => {
    it("Selects the 'official' options", () => {
      cy.grpSelectOfficial();
    });

    it("Enters group name", () => {
      cy.grpEnterGroupName({ name: "Official Group" });
    });

    it("Assigns user to the group", () => {
      SystemRequirement("REQ-2510");
      cy.grpAssignUser({ name: "Second Tester" });
    });
  });

  context("Create official group", () => {
    it("Saves the group", () => {
      cy.grpSaveGroup();
    });
  });

  context("Check if the group was created", () => {
    it("Filters groups by name and selects the new group", () => {
      SystemRequirement("REQ-2500");
      cy.grpSelectGroup({ name: "Official Group" });
    });
  });

  context("Check if 'Everyone' group exists", () => {
    SystemRequirement("REQ-2530");
    it("Filters groups by name and selects the 'Everyone' group", () => {
      cy.grpSelectGroup({ name: "Everyone" });
    });
  });

  context("Start add an unofficial group flow", () => {
    it("Clicks on 'Add Group'", () => {
      cy.grpClickAddGroup();
    });
  });

  context("Fill in unofficial group attributes", () => {
    it("Selects the 'unofficial' options", () => {
      cy.grpSelectUnofficial();
    });

    it("Enters group name", () => {
      cy.grpEnterGroupName({ name: "Unofficial Group" });
    });

    it("Assigns user to the group", () => {
      SystemRequirement("REQ-2560");
      cy.grpAssignUser({ name: "Second Tester" });
    });
  });

  context("Create official group", () => {
    it("Saves the group", () => {
      cy.grpSaveGroup();
    });
  });

  context("Check if the group was created", () => {
    it("Filters groups by name and selects the new group", () => {
      SystemRequirement("REQ-2550");
      cy.grpSelectGroup({ name: "Unofficial Group" });
    });
  });
});
