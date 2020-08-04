/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import path from "path";
import { GroupTag, NavigationItems } from "../../../src/state/ducks/auth/types";

const runId = new Date().valueOf();
let createdCompany;
let loginResponse;
let multipleCompanies;
let docTypeId;
let adminEmployee;

context(`Test: ${path.basename(__filename)}`, () => {
  context("Check navigation bar for default company", () => {
    it("[API] API login as admin with default company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("Logs admin in default company with default navigation", () => {
      cy.authLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      });
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

  context("Create company and checks admin navigation bar", () => {
    it("[API] Creates company", (done: any) => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
              {
                documentTypeName: "Testing docType",
                documentTypeAcronym: "TDT",
                isQms: true,
                group: "OTHER",
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.name === "Company Admin");
          createdCompany.documentTypes.forEach((item: { documentTypeName: string; id: any }) => {
            if (item.documentTypeName === "Testing docType")
            {
              docTypeId = item.id;
            }
          });
          done();
        });
      });
    });

    it("[API] API login with company admin", (done: any) => {
      cy.authApiLogin({
        email: "enlil.testmail+cy1@gmail.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("Logs in with company admin", () => {
      cy.authLogin({
        email: "enlil.testmail+cy1@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Click to expand Document Control", () => {
      cy.navigClickOnItem({ navigItem: NavigationItems.DOCUMENT_CONTROL });
      cy.navigClickOnItem({ navigItem: NavigationItems.MANUFACTURING });
    });

    it("Check navigation to see if admin navigation is shown", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_LIST,
        NavigationItems.APPROVAL_REQUEST,
        NavigationItems.USER_MANAGEMENT,
        NavigationItems.GROUP_MANAGEMENT,
        NavigationItems.PURCHASE_ORDERS,
        NavigationItems.SUPPLIERS,
        NavigationItems.RECEIVING,
        NavigationItems.WORK_ORDERS,
        NavigationItems.LOTS,
      );
    });
  });

  context("Creates new navigation item and checks visibility", () => {
    it("[API] Updates company", (done: any) => {
      cy.authApiLogin({
        email: "enlil.testmail+cy1@gmail.com",
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
        email: "enlil.testmail+cy1@gmail.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("Logs in with company admin", () => {
      cy.authLogin({
        email: "enlil.testmail+cy1@gmail.com",
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
        email: "enlil.testmail+cy2@gmail.com",
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

