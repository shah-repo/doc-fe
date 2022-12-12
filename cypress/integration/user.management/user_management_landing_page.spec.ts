// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;

context("User management landing page", () => {
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

  context("Verify user management training page", () => {
    context("Log in as company admin", () => {
      it("Logs user in", () => {
        cy.authLogin({ email: USERS[1].email });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      });
    });

    context("Navigate to user management and verify new grid", () => {
      it("Navigate to user management landing page", () => {
        cy.usrNavigateToUserManagement();
      });

      it("Verify landing page table is using Kendo grid", () => {
        cy.get(`div[role="grid"]`).should("have.class", "k-grid");
      });

      it("Verify all columns are present", () => {
        cy.get(`th[role="columnheader"]`).eq(0).should("have.text", "SIGNED UP");
        cy.get(`th[role="columnheader"]`).eq(1).should("have.text", "NAME");
        cy.get(`th[role="columnheader"]`).eq(2).should("have.text", "EMAIL");
        cy.get(`th[role="columnheader"]`).eq(3).should("have.text", "GROUPS");
        cy.get(`th[role="columnheader"]`).eq(4).should("have.text", "ACTIVE");
      });

      it(`Verify buttons "Clear Filter" and "Add Employee" are present`, () => {
        cy.get(`button[data-cy="clearFilter"]`).should("exist");
        cy.get(`button[id="AddEmployeePresenter-openDialog"]`).should("exist");
      });

      it(`Verify drag and drop Signed Up header on second slot`, () => {
        cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "Signed up");
        cy.dragAndDrop({
          fromSelector: `th[aria-colindex="1"][role]>span>span`,
          toSelector: `th[aria-colindex="2"][role]>span>span`,
        });
        cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "Signed up");
      });

      it(`Column grouping should be displayed`, () => {
        cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
        cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column");
        cy.unClick();
      });

      it(`Verify grouping`, () => {
        cy.get("tr.k-grouping-row").should("not.exist");
        cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
        cy.get("div.k-columnmenu-item").eq(0).arrowClick();
        cy.get("tr.k-grouping-row").should("have.length", "2");
        cy.get(`div.k-group-indicator>a>span`).eq(1).arrowClick();
        cy.get("tr.k-grouping-row").should("not.exist");
      });

      it(`Verify edit mode is opened on specific user`, () => {
        cy.get(`div[role="dialog"]`).should("not.exist");
        cy.usrClickEditUser({ name: USERS[4].name });
        cy.get(`div[role="dialog"]`).should("exist");
        cy.get("#DialogTitle-name").should("have.text", USERS[4].name);
        cy.get("#DialogContent-close").arrowClick();
        cy.get(`div[role="dialog"]`).should("exist");
      });

      it(`Verify user count`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get("tr.k-master-row").should("have.length", 5);
      });
    });

    context("Verify filters on each field", () => {
      it("Verify filter for Name", () => {
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="1"] input`).arrowType(USERS[4].name);
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", USERS[4].name);
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for Signed Up", () => {
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="2"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Signed up").arrowClick();
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "Signed up");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for Email", () => {
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="3"] input`).arrowType(USERS[4].email);
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", USERS[4].email);
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for Groups", () => {
        cy.get(`th[aria-colindex="4"] span.k-input`).should("have.text", "Select Groups");
        cy.get(`th[aria-colindex="4"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Everyone").arrowClick();
        cy.get(`th[aria-colindex="4"] span.k-input`).should("have.text", "Everyone");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for Active", () => {
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="5"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Active").arrowClick();
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Active");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Navigate to dashboard and comeback to verify filters are saved after navigating from page", () => {
        cy.navigToDashboard();
        cy.usrNavigateToUserManagement();
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", USERS[4].name);
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "Signed up");
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", USERS[4].email);
        cy.get(`th[aria-colindex="4"] span.k-input`).should("have.text", "Everyone");
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Active");

      });

      it("Verify clear filters", () => {
        cy.trClearFilters();
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="4"] span.k-input`).should("have.text", "Select Groups");
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
      });
    });

    context("Verify dropdown filters", () => {
      it("Verify Email dropdown filters", () => {
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
      });

      it(`Verify Email "Does not contain" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType("2");
        cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });

      it(`Verify Email "Is equal to" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType(USERS[1].email);
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });

      it(`Verify Email "Is not equal to" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType(USERS[1].email);
        cy.dlVerifyDocumentCount({ numberOfDoc: 4 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });

      it(`Verify Email "Starts with" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType("enlil.testmail+cy");
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });

      it(`Verify Email "Ends with" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType("cy1@gmail.com");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });

      it(`Verify Email "Is null" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is null").arrowClick();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });

      it(`Verify Email "Is not null" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });

      it(`Verify Email "Is empty" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });

      it(`Verify Email "Is not empty" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
        cy.dlVerifyDocumentCount({ numberOfDoc: 5 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
      });
    });

    context("Verify select field filter", () => {
      it(`Verify filter is disabled on default select field`, () => {
        cy.get(`th[aria-colindex="4"] button[title="Clear"]`).should("have.attr", "disabled");
        cy.get(`th[aria-colindex="4"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Everyone").arrowClick();
        cy.get(`th[aria-colindex="4"] span.k-input`).should("have.text", "Everyone");
        cy.get(`th[aria-colindex="4"] button[title="Clear"]`).should("not.have.attr", "disabled");
        cy.get(`th[aria-colindex="4"] button[title="Clear"]`).arrowClick();
      });
    });
  });
});
