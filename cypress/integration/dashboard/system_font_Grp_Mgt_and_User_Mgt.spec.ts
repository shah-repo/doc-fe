/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
// / <reference types="Cypress" />
import { CONFIG } from "../../support/config";
import { FONT_SIZE_10, FONT_SIZE_12, FONT_SIZE_13, FONT_SIZE_14, FONT_WT_400, FONT_WT_600, LINE_HT_17_1419, LINE_HT_17_16, LINE_HT_17_5, LINE_HT_19_5, LINE_HT_20, LINE_HT_20_02, LINE_HT_21, sora, soraSansserif, TEXT_TRANS_UPPER } from "../../utils/constants/fonts_constants";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let multipleCompanies;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let employeeLoginFirst;
let createdCompanyA;
let loginResponse;
const parentGroups = "PARENT GROUPS";
const tags = "TAGS";
const grpType = "GROUP TYPE";
const name = "NAME";
const email = "EMAIL";
const groups = "GROUPS";
const active = "ACTIVE";
const members = "MEMBERS";
const permissions = "PERMISSIONS";
const signedUp = "SIGNED UP";

context("User Creation Flow", () => {
  context("[API]Prepare company A", () => {
    it("[API]Creates company A", (done: any) => {
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
          createdCompanyA = response;
          employeeLoginFirst = createdCompanyA.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login with admin user", () => {
    it("Logs user in", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: true });
    });
  });


  context("Group Management", () => {
    context("Navigate to Group Management", () => {
      it("Navigate to Group Management", () => {
        cy.grpNavigateToGroupManagement();
      });
    });

    context("Verify font for nagigation bar 'Group Management'", () => {
      it(`Verify 'Group Management' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="navigation.groupManagement"]>span>span`).should("have.css", "font-size", "13px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "700")
          .and("have.css", "line-height", "19.5px");
      });
    });

    context("Verify font for 'Add Group' button", () => {
      it(`Verify 'Add Group' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"Group-openDialog\"]")
          .checkStylePropExists({
            content: "Add Group",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'History' button", () => {
      it(`Verify 'History' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"gm-open-history-panel\"]")
          .checkStylePropExists({
            content: "History",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Export list' button", () => {
      it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"gm-open-export-dialog\"]")
          .checkStylePropExists({
            content: "Export list",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Clear Filters' button", () => {
      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"clearFilter\"]")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for Landing page table columns headers", () => {
      it(`Verify ${grpType} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: grpType,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${name} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: name,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${members} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: members,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${permissions} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: permissions,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${tags} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: tags,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${parentGroups} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: parentGroups,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });
    });

    context("Verify font for 'Drag & drop column header to group'", () => {
      it(`Verify 'Drag & drop column header to group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_1419} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Drag & drop column header to group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_1419, "font-weight": FONT_WT_400 },
        });
      });
    });

    context(`Open History tab and Verify Font`, () => {
      it(`Click on History`, () => {
        cy.get(`[data-cy="gm-open-history-panel"]`).arrowClick();
      });

      it(`Verify 'Server Automation' font-size ${FONT_SIZE_14} and font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
        cy.checkStylePropExists({
          content: "Server Automation",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
      });

      it(`Verify 'Added group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_16} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Added group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_16, "font-weight": FONT_WT_400 },
        });
      });

      it(`Verify 'Added permissions' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_16} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Added permissions",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_16, "font-weight": FONT_WT_400 },
        });
      });

      it(`Verify 'Added tags' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_16} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Added tags",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_16, "font-weight": FONT_WT_400 },
        });
      });

      it(`Verify 'Load More' font-size ${FONT_SIZE_10} and font-family ${soraSansserif} line-height ${LINE_HT_17_5} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[id="historyLoadMore"]>span`).should("have.css", "font-size", "10px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "600")
          .and("have.css", "line-height", "17.5px");
      });

      it(`Close History tab`, () => {
        cy.get(`[data-cy="gm-close-history-panel"]`).arrowClick();
      });
    });
  });

  context("User Management", () => {
    context("Navigate to User Management", () => {
      it("Navigate to User Management", () => {
        cy.usrNavigateToUserManagement();
      });
    });

    context("Verify font for navigation bar 'User Management'", () => {
      it(`Verify 'User Management' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
        cy.get(`[data-cy="navigation.userManagement"]>span>span`).should("have.css", "font-size", "13px");
      });
    });

    context("Verify font for 'Add Employee' button", () => {
      it(`Verify 'Add Employee' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[id=\"AddEmployeePresenter-openDialog\"]")
          .checkStylePropExists({
            content: "Add Employee",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'History' button", () => {
      it(`Verify 'History' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"um-open-history-panel\"]")
          .checkStylePropExists({
            content: "History",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Export list' button", () => {
      it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"um-open-export-dialog\"]")
          .checkStylePropExists({
            content: "Export list",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for 'Clear Filters' button", () => {
      it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
        cy.get("[data-cy=\"clearFilter\"]")
          .checkStylePropExists({
            content: "Clear Filters",
            props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
          });
      });
    });

    context("Verify font for Landing page table columns headers", () => {
      it(`Verify ${signedUp} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: signedUp,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${name} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: name,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${email} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: email,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${groups} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: groups,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });

      it(`Verify ${active} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
        cy.get(`th[role="columnheader"] span.k-column-title`)
          .checkStylePropExists({
            content: active,
            props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
          });
      });
    });

    context("Verify font for 'Drag & drop column header to group'", () => {
      it(`Verify 'Drag & drop column header to group' font-size ${FONT_SIZE_12} and font-family ${soraSansserif} line-height ${LINE_HT_17_1419} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Drag & drop column header to group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_17_1419, "font-weight": FONT_WT_400 },
        });
      });
    });

    context(`Open History tab and Verify Font`, () => {
      it(`Click on History`, () => {
        cy.get(`[data-cy="um-open-history-panel"]`).arrowClick();
      });

      it(`Verify 'Load More' font-size ${FONT_SIZE_10} and font-family ${soraSansserif} line-height ${LINE_HT_17_5} font-weight ${FONT_WT_600}`, () => {
        cy.get(`[id="historyLoadMore"]>span`).should("have.css", "font-size", "10px")
          .and("have.css", "font-family", "Sora, sans-serif")
          .and("have.css", "font-weight", "600")
          .and("have.css", "line-height", "17.5px");
      });

      it(`Close History tab`, () => {
        cy.get(`[data-cy="um-close-history-panel"]`).arrowClick();
      });
    });

    context("Add User and verify error message font", () => {
      it(`Click on Add Employee`, () => {
        cy.get(`[id="AddEmployeePresenter-openDialog"]`).arrowClick();
      });

      it("Enters name", () => {
        cy.usrEnterName({ name: "Test" });
      });

      it("Click the add button", () => {
        cy.get("td>span>button>span>svg>path").eq(0).arrowClick({ force: true });
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify 'Name and Email are required' font-size ${FONT_SIZE_14} and font-family ${sora} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
        cy.checkStylePropExists({
          content: "Name and Email are required",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
      });
    });
  });
});

export { };
