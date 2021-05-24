// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import path from "path";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
let docTypeId;
let adminEmployee;

context(`Test: ${path.basename(__filename)}`, () => {
  context("[API] Create company to test navigation", () => {
    it("[API] Creates company", (done: any) => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API] Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Check navigation for default user", () => {
    it("Logs default user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Click to expand Document Control", () => {
      cy.navigClickOnItem({ navigItem: NavigationItems.DOCUMENT_CONTROL });
    });

    it("Check navigation to see if default is shown", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL);
    });

    it("Expand Document control and check navigation to see if default is shown", () => {
      cy.navigClickOnItem({
        navigItem: NavigationItems.DOCUMENT_CONTROL,
      });
      cy.navigListExistsCheck(
        NavigationItems.APPROVAL_REQUEST,
        NavigationItems.DOCUMENT_LIST);
    });

    it("Check navigation to see if user management and group management are not shown in default navigation", () => {
      cy.navigListNotExistsCheck(
        NavigationItems.USER_MANAGEMENT,
        NavigationItems.GROUP_MANAGEMENT
      );
    });
  });

  context("Check navigation for admin user", () => {
    it("Logs in with company admin", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Check navigation to see if admin navigation is shown", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.USER_MANAGEMENT,
        NavigationItems.GROUP_MANAGEMENT,
        NavigationItems.PURCHASE_ORDERS,
        NavigationItems.INSPECTION,
        NavigationItems.RECEIVING,
      );

      it("Click to expand Document Control", () => {
        cy.navigClickOnItem({ navigItem: NavigationItems.DOCUMENT_CONTROL });
        cy.navigClickOnItem({ navigItem: NavigationItems.MANUFACTURING });
      });

      cy.navigClickOnItem({ navigItem: NavigationItems.DOCUMENT_CONTROL });

      cy.navigListExistsCheck(
        NavigationItems.DOCUMENT_LIST,
        NavigationItems.APPROVAL_REQUEST,
      );

      cy.navigClickOnItem({ navigItem: NavigationItems.MANUFACTURING });

      cy.navigListExistsCheck(
        NavigationItems.WORK_ORDERS,
        NavigationItems.LOTS,
      );

      cy.navigClickOnItem({ navigItem: NavigationItems.SUPPLIER_MANAGEMENT });

      cy.navigListExistsCheck(
        NavigationItems.SUPPLIER_LIST,
      );
    });
  });

  context("Creates new navigation item and checks visibility", () => {
    it("[API] Updates company", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;

        cy.cmpUpdateCompany({
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId as unknown as string,
          payload: {
            navigation:
            [
              {
                label: "Dashboard",
                path: "/",
                type: "LINK",
              },
              {
                label: "Document List",
                path: "/document_revision",
                type: "LINK",
              },
              {
                label: "Approval Requests",
                path: "/change_request",
                type: "LINK",
              },
              {
                label: "User Management",
                path: "/user_management",
                restrictedToUsersWithTags: [
                  GroupTag.USER_MANAGEMENT,
                ],
                type: "LINK",
              },
              {
                label: "Group Management",
                path: "/group_management",
                restrictedToUsersWithTags: [
                  GroupTag.GROUP_MANAGEMENT,
                ],
                type: "LINK",
              },
              {
                label: "Testing Navigation Item",
                path: "/document_by_type/" + docTypeId,
                type: "LINK",
              },
            ],
          },
        }).then(() => {
          done();
        });
      });
    });

    it("[API] API login with company admin", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("Logs in with company admin", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Check navigation to see if new item is shown", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_LIST,
        NavigationItems.APPROVAL_REQUEST,
        NavigationItems.USER_MANAGEMENT,
        NavigationItems.GROUP_MANAGEMENT,
        NavigationItems.TESTING_NAVIG_ITEM
      );
    });

    it("Logs out with admin", () => {
      cy.authLogout();
    });

    it("Logs in with user without group management and user management tags", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Check navigation to see if all expected items are shown", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_LIST,
        NavigationItems.APPROVAL_REQUEST,
        NavigationItems.TESTING_NAVIG_ITEM);
    });

    it("Check navigation to see if user management and group management are not shown", () => {
      cy.navigListNotExistsCheck( NavigationItems.USER_MANAGEMENT, NavigationItems.GROUP_MANAGEMENT);
    });
  });
});

export { };

