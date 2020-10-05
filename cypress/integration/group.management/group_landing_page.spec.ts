import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Group Landing Page Flow", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
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
        email: USERS[2].email,
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
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start group management flow", () => {
    it("Navigates to Group management", () => {
      SystemRequirement("REQ-2570");
      cy.grpNavigateToGroupManagement();
    });
  });

  context("Validate that the columns exist on the group page", () => {
    it("Verifies that group name column exists", () => {
      SystemRequirement("REQ-2580");
      cy.grpVerifyGroupNameIsPresentOnFirstGroup();
    });

    it("Verifies that group members column exists", () => {
      SystemRequirement("REQ-2580");
      cy.grpVerifyGroupMembersIsPresentOnFirstGroup();
    });


    it("Verifies that group type column exists", () => {
      SystemRequirement("REQ-2580");
      cy.grpVerifyGroupTypeIsPresentOnFirstGroup();
    });
  });


  context("Check if all groups are displayed and have maximum 15 members displayed", () => {
    it("Verifies that group name filter is empty", () => {
      SystemRequirement("REQ-2610");
      cy.grpCheckIfNameFilterIsEmpty();
    });

    it("Verifies that group members filter is empty", () => {
      SystemRequirement("REQ-2610");
      cy.grpCheckIfMembersFilterIsEmpty();
    });

    it("Verifies that group type filter is empty", () => {
      SystemRequirement("REQ-2610");
      cy.grpCheckIfTypeFilterIsEmpty();
    });

    it("Verifies that 'Group members' column displays no more than 15 members", () => {
      // SystemRequirement("REQ-2590");
      cy.grpCheckForNumberOfGroupMembersDisplayed();
    });
  });

  context("Filter groups by each column", () => {
    it("Filters groups by name", () => {
      SystemRequirement("REQ-2600");
      cy.grpFilterByName({ name: "Everyone" });
    });

    it("Filters groups by member", () => {
      SystemRequirement("REQ-2600");
      cy.grpFilterByMembers({ member: USERS[1].name });
    });

    it("Filters groups by type", () => {
      SystemRequirement("REQ-2600");
      cy.grpFilterByType({ type: "Official" });
    });
  });

  context("Validate that filters are maintained during session", () => {
    const GROUP_NAME = "Everyone";
    const GROUP_MEMBER = USERS[1].name;
    const GROUP_TYPE = "Official";

    it("Sets the filters", () => {
      cy.grpSetNameFilter({ name: GROUP_NAME });
      cy.grpSetMembersFilter({ member: GROUP_MEMBER });
      cy.grpSetTypeFilter({ type: GROUP_TYPE });
    });

    it("Navigates to dashboard", () => {
      cy.grpNavigateToDashboard();
    });

    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Checks if the filters are mantained", () => {
      // SystemRequirement("REQ-2620");
      cy.grpCheckIfNameFilterIsSet({ name: GROUP_NAME });
      cy.grpCheckIfMembersFilterIsSet({ member: GROUP_MEMBER });
      cy.grpCheckIfTypeFilterIsSet({ isOfficial: GROUP_TYPE === "Official" });
    });
  });

  context("Check if unofficial and official groups exist", () => {
    it("Verifies that Official group exists", () => {
      // SystemRequirement("REQ-2630");
      cy.grpCheckIfGroupTypeExists({ type: "Official" });
    });

    it("Verifies that Unofficial group exists", () => {
      // SystemRequirement("REQ-2630");
      cy.grpCheckIfGroupTypeExists({ type: "Unofficial" });
    });
  });
});

export { };

