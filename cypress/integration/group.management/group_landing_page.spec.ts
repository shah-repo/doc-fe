// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminLoginResponse;
let secondEmployee;
let thirdEmployee;
let fourthEmployee;
let adminEmployee;
let developersGroup;

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
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          fourthEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    context("[API]Add employee to developers group", () => {
      it("[API]Login admin tester", (done: any) => {
        cy.authApiLogin({
          email: USERS[1].email,
        }).then((response) => {
          adminLoginResponse = response;
          done();
        });
      });

      it("[API]Get group", (done: any) => {
        cy.grpGetGroupByName({
          groupName: "Developers",
          sessionId: adminLoginResponse.sessionId,
          employeeId: adminEmployee.id,
        }).then((response) => {
          developersGroup = response;
          done();
        });
      });

      it("[API]Patch group", () => {
        cy.grpPatchGroup({
          groupId: developersGroup.body[0].id,
          sessionId: adminLoginResponse.sessionId,
          employeeId: adminEmployee.id,
          payload: {
            employees: [{ id: secondEmployee.id }, { id: thirdEmployee.id }, { id: fourthEmployee.id }],
          },
        });
      });
    });
  });

  context("Login company admin", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Start group management flow", () => {
    it("Navigates to Group management", () => {
      SystemRequirement("REQ-2570");
      cy.grpNavigateToGroupManagement();
    });
  });

  context("Validate that the columns exist on the group page", () => {
    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", "GROUP TYPE");
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", "NAME");
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", "MEMBERS");
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", "PERMISSIONS");
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", "TAGS");
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", "PARENT GROUPS");
    });

    it(`Verify buttons "Clear Filter" and "Add Group" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="Group-openDialog"]`).should("exist");
    });

    it(`Verify only groups are present in table`, () => {
      const groups = [
        "Developers",
        "User Management",
        "Groups Management",
        "Groups Management Unofficial",
        "Owner as approver",
        "Everyone",
        "Can be approver",
        "Company Admin",
        "Async Tasks"];

      cy.get(`td[data-grid-col-index="1"]`).each(($el) => {
        const groupName = $el.text();
        expect(groupName).to.be.oneOf(groups);
      });
    });

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

    it("Verify memebers in group", () => {
      const members = [
        USERS[1].name,
        USERS[2].name,
        USERS[3].name,
        USERS[4].name,
      ];

      cy.get(`td[data-grid-col-index="2"]`).eq(0).then(($el) => {
        const membersString = $el.text();

        members.forEach((member) => {
          expect(membersString).to.include(member);
        });
      });
    });

    it("Filters groups by member", () => {
      SystemRequirement("REQ-2600");
      cy.grpFilterByMembers({ member: USERS[1].name });
    });

    it(`Verify Group Type dropdown has "Official" and "Unofficial"`, () => {
      cy.get(`[aria-colindex="1"] [class="k-input"]`).arrowClick();
      cy.get("ul>li[role=option]").should("have.text", "OfficialUnofficial");
    });

    it("Filters groups by type", () => {
      SystemRequirement("REQ-2600");
      cy.grpFilterByType({ type: "Official" });
    });
  });

  context("Validate filters", () => {
    const GROUP_NAME = "Everyone";
    const GROUP_MEMBER = USERS[1].name;
    const GROUP_TYPE = "Official";
    const PERMISSION = "EMPLOYEE_GET";
    const TAG = "QMS_DEFAULT";

    it("Sets the filters", () => {
      cy.grpSetNameFilter({ name: GROUP_NAME });
      cy.grpSetMembersFilter({ member: GROUP_MEMBER });
      cy.grpSetTypeFilter({ type: GROUP_TYPE });
      cy.grpSetPermissionsFilter({ permission: PERMISSION });
      cy.grpSetTagsFilter({ tag: TAG });
      cy.get(`th[aria-colindex="6"] span.k-select`).arrowClick({ force: true });
      cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
    });

    it("Navigates to dashboard", () => {
      cy.grpNavigateToDashboard();
    });

    it("Navigates to Group management", () => {
      cy.grpNavigateToGroupManagement();
    });

    it("Checks if the filters are mantained", () => {
      // SystemRequirement("REQ-2620");
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.grpCheckIfNameFilterIsSet({ name: GROUP_NAME });
      cy.grpCheckIfMembersFilterIsSet({ member: GROUP_MEMBER });
      cy.log(GROUP_TYPE);
      cy.grpCheckIfTypeFilterIsSet({ groupType: GROUP_TYPE });
      cy.grpCheckIfPermissionFilterIsSet({ permission: PERMISSION });
      cy.grpCheckIfTagFilterIsSet({ tag: TAG });
    });

    it("Verify clear filter", () => {
      cy.dlClearFilters();
      cy.get(`th[aria-colindex="1"] span.k-input`).should("have.text", "All");
      cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "");
    });

    it(`Verify grouping`, () => {
      cy.get("tr.k-grouping-row").should("not.exist");
      cy.get(`th[aria-colindex="1"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).arrowClick();
      cy.get("tr.k-grouping-row").should("have.length", "1");
      cy.get(`div.k-group-indicator>a>span`).eq(1).arrowClick();
      cy.get("tr.k-grouping-row").should("not.exist");
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

  context("Verify drag and drop", () => {
    it(`Verify drag and drop Group Type header on second slot`, () => {
      cy.dlClearFilters();
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "Official");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "Official");
    });
  });

  context("Verify dropdown filter list", () => {
    it(`Verify dropdown filter list on Name header`, () => {
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
      "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
    });
  });
});

export { };

