/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
// / <reference types="Cypress" />
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { receivingReleasedDateMonth } from "../../utils/constants/dateHandler";
import { FONT_SIZE_10, FONT_SIZE_11, FONT_SIZE_12, FONT_SIZE_13, FONT_SIZE_14, FONT_SIZE_14_16, FONT_SIZE_16, FONT_SIZE_18, FONT_SIZE_19, FONT_SIZE_22_4, FONT_SIZE_26, FONT_WT_400, FONT_WT_500, FONT_WT_600, FONT_WT_700, LINE_HT_13, LINE_HT_14, LINE_HT_15, LINE_HT_15_12, LINE_HT_15_2, LINE_HT_15_96, LINE_HT_16, LINE_HT_18, LINE_HT_19_2, LINE_HT_19_5, LINE_HT_20, LINE_HT_20_02, LINE_HT_21, LINE_HT_21_28, LINE_HT_24, LINE_HT_24_78, LINE_HT_25_6, LINE_HT_25_74, LINE_HT_26_208, LINE_HT_27, LINE_HT_27_17, LINE_HT_37_18, sora, soraSansserif, TEXT_TRANS_UPPER } from "../../utils/constants/fonts_constants";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let multipleCompanies;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let employeeLoginFirst;
let createdCompanyA;
let createdCompanyB;
let loginResponse;
const docId = "DOC ID";
const docRevision = "REVISION";
const docTitle = "DOCUMENT TITLE";
const docType = "TYPE";
const docOwner = "OWNER";
const arId = "AR ID";
const docStatus = "STATUS";
const effectiveDate = "EFFECTIVE DATE";
const formId = "FM-00001";
const formId2 = "FM-00002";
const arIdNum = "AR99999";

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

  context("Verify font for login confirmation page", () => {
    it("Logout current user", () => {
      cy.authLogout();
    });

    it("Enter user's emailId and password", () => {
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").arrowType(USERS[1].email);
      cy.unClick();
      cy.get("[data-cy=\"LoginFormPresenter-password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.unClick();
    });

    it(`Verify 'Sign in to Enlil' font-size ${FONT_SIZE_22_4} font-family ${soraSansserif} line-height ${LINE_HT_26_208} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        elem: "#LoginFormPresenter-title",
        content: "Sign in to Enlil",
        props: { "font-size": FONT_SIZE_22_4, "font-family": soraSansserif, "line-height": LINE_HT_26_208, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'EMAIL ADDRESS' font-size ${FONT_SIZE_14_16} font-family ${soraSansserif} line-height ${LINE_HT_24_78} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        elem: ".MuiTypography-subtitle1",
        index: 0,
        content: "EMAIL ADDRESS",
        props: { "font-size": FONT_SIZE_14_16, "font-family": soraSansserif, "line-height": LINE_HT_24_78, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'PASSWORD' font-size ${FONT_SIZE_14_16} font-family ${soraSansserif} line-height ${LINE_HT_24_78} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        elem: ".MuiTypography-subtitle1",
        index: 1,
        content: "PASSWORD",
        props: { "font-size": FONT_SIZE_14_16, "font-family": soraSansserif, "line-height": LINE_HT_24_78, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify entered email address font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_15_2} font-weight ${FONT_WT_400}`, () => {
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").should("have.value", USERS[1].email)
        .should("have.css", "font-size", FONT_SIZE_16);
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").should("have.value", USERS[1].email)
        .should("have.css", "font-family", soraSansserif);
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").should("have.value", USERS[1].email)
        .should("have.css", "line-height", LINE_HT_15_2);
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").should("have.value", USERS[1].email)
        .should("have.css", "font-weight", FONT_WT_400);
    });

    it(`Verify 'Sign in' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        elem: `[data-cy="LoginFormPresenter-submit"]`,
        content: "Sign in",
        props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
      });
    });

    it(`Verify 'Don't have an account' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_21_28} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        content: "Don't have an account?",
        props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_21_28, "font-weight": FONT_WT_400 },
      });
    });
  });

  context("Login with admin user", () => {
    it("Submit empty login form", () => {
      cy.authSubmitLogin();
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: true });
    });
  });

  context("Navigate to document list", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify font for side menu bar(nagigation bar)", () => {
    it(`Verify 'Dashboard' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.dashboard"]`).contains("Dashboard").should("have.css", "font-size", FONT_SIZE_13);
      cy.get(`[data-cy="navigation.dashboard"]`).contains("Dashboard").should("have.css", "line-height", LINE_HT_19_5);
      cy.checkStylePropExists({
        content: "Dashboard",
        props: { "font-family": soraSansserif, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Document Control' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        content: "Document Control",
        props: { "font-size": FONT_SIZE_13, "font-family": soraSansserif, "line-height": LINE_HT_19_5, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Equipment' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.equipment"]`).contains("Equipment").should("have.css", "font-size", FONT_SIZE_13);
      cy.get(`[data-cy="navigation.equipment"]`).contains("Equipment").should("have.css", "line-height", LINE_HT_19_5);
    });

    it(`Verify 'Purchase Orders' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.purchaseOrders"]`).contains("Purchase Orders").should("have.css", "font-size", FONT_SIZE_13);
      cy.get(`[data-cy="navigation.purchaseOrders"]`).contains("Purchase Orders").should("have.css", "line-height", LINE_HT_19_5);
      cy.checkStylePropExists({
        content: "Purchase Orders",
        props: { "font-family": soraSansserif, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Supplier Management' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.supplierManagement"]`).contains("Supplier Management").should("have.css", "font-size", FONT_SIZE_13);
      cy.checkStylePropExists({
        content: "Supplier Management",
        props: { "font-family": soraSansserif, "line-height": LINE_HT_19_5, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Receiving' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.receiving"]`).contains("Receiving").should("have.css", "font-size", FONT_SIZE_13);
      cy.get(`[data-cy="navigation.receiving"]`).contains("Receiving").should("have.css", "line-height", LINE_HT_19_5);
      cy.checkStylePropExists({
        content: "Receiving",
        props: { "font-family": soraSansserif, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Inspection' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.inspection"]`).contains("Inspection").should("have.css", "font-size", FONT_SIZE_13);
      cy.get(`[data-cy="navigation.inspection"]`).contains("Inspection").should("have.css", "line-height", LINE_HT_19_5);
      cy.checkStylePropExists({
        content: "Inspection",
        props: { "font-family": soraSansserif, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Manufacturing' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.manufacturing"]`).contains("Manufacturing").should("have.css", "font-size", FONT_SIZE_13);
      cy.get(`[data-cy="navigation.manufacturing"]`).contains("Manufacturing").should("have.css", "line-height", LINE_HT_19_5);
      cy.checkStylePropExists({
        content: "Manufacturing",
        props: { "font-family": soraSansserif, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Group Management' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.groupManagement"]`).contains("Group Management").should("have.css", "font-size", FONT_SIZE_13);
      cy.get(`[data-cy="navigation.groupManagement"]`).contains("Group Management").should("have.css", "line-height", LINE_HT_19_5);
      cy.checkStylePropExists({
        content: "Group Management",
        props: { "font-family": soraSansserif, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'User Management' font-size ${FONT_SIZE_13} and font-family ${soraSansserif} line-height ${LINE_HT_19_5} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="navigation.userManagement"]`).contains("User Management").should("have.css", "font-size", FONT_SIZE_13);
      cy.get(`[data-cy="navigation.userManagement"]`).contains("User Management").should("have.css", "line-height", LINE_HT_19_5);
      cy.checkStylePropExists({
        content: "User Management",
        props: { "font-family": soraSansserif, "font-weight": FONT_WT_400 },
      });
    });
  });

  context("Verify font for nagigation bar user's info", () => {
    it(`Verify 'UserName' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="UserName"]`).contains(USERS[1].name).should("have.css", "font-size", FONT_SIZE_12);
      cy.get(`[data-cy="UserName"]`).contains(USERS[1].name).should("have.css", "line-height", LINE_HT_15);
      cy.get(`[data-cy="UserName"]`)
        .checkStylePropExists({
          content: USERS[1].name,
          props: { "font-family": soraSansserif, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'UserEmail' font-size as ${FONT_SIZE_11} and font-family ${soraSansserif} line-height ${LINE_HT_14} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="UserEmail"]`).contains(USERS[1].email).should("have.css", "font-size", FONT_SIZE_11);
      cy.get(`[data-cy="UserEmail"]`).contains(USERS[1].email).should("have.css", "line-height", LINE_HT_14);
      cy.get(`[data-cy="UserEmail"]`)
        .checkStylePropExists({
          content: USERS[1].email,
          props: { "font-family": soraSansserif, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Verify fonts for Landing page buttons", () => {
    it(`Verify 'Document List' button font-size ${FONT_SIZE_18} font-family ${soraSansserif} line-height ${LINE_HT_27} font-weight  ${FONT_WT_600}`, () => {
      cy.get(`[data-cy='grid-title']`).contains("Document List").should("have.css", "font-size", FONT_SIZE_18);
      cy.get(`[data-cy='grid-title']`).contains("Document List").should("have.css", "line-height", LINE_HT_27);
      cy.get(`[data-cy='grid-title']`).contains("Document List").should("have.css", "font-family", soraSansserif);
      cy.get(`[data-cy='grid-title']`).contains("Document List").should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Export list' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("#ListPresenter-export-list").contains("Export list").should("have.css", "font-size", FONT_SIZE_12);
      cy.get("#ListPresenter-export-list").contains("Export list").should("have.css", "line-height", LINE_HT_21);
      cy.get("#ListPresenter-export-list").contains("Export list").should("have.css", "font-family", soraSansserif);
      cy.get("#ListPresenter-export-list").contains("Export list").should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Create A Document' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"document.revision.create\"]")
        .checkStylePropExists({
          content: "Create a document",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Clear Filters' button font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight  ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "Clear Filters",
        props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
      });
    });
  });

  context("Verify fonts for Landing page columns and table options", () => {
    it(`Verify ${docId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docId,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${docRevision} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docRevision,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${docTitle} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docTitle,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${docType} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docType,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${docOwner} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docOwner,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${arId} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: arId,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${docStatus} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: docStatus,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });

    it(`Verify ${effectiveDate} font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_600} text-transform ${TEXT_TRANS_UPPER}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`)
        .checkStylePropExists({
          content: effectiveDate,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_600, "text-transform": TEXT_TRANS_UPPER },
        });
    });
  });

  context(`Filter document by ID as ${formId}`, () => {
    it(`Filter document by ID as ${formId}`, () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: formId });
    });
  });

  context("Verify font for Landing page table items", () => {
    it(`Verify DOC ID ${formId} with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_400}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`)
        .checkStylePropExists({
          content: formId,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify DOCUMENT TITLE 'AR Form' with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_400}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="2"]`)
        .checkStylePropExists({
          content: "AR Form",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify TYPE FM with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_400}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="3"]`)
        .checkStylePropExists({
          content: "FM",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify OWNER ${USERS[1].name} with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_18} font-weight ${FONT_WT_400}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).contains(USERS[1].name).should("have.css", "font-size", FONT_SIZE_14);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).contains(USERS[1].name).should("have.css", "font-family", soraSansserif);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).contains(USERS[1].name).should("have.css", "line-height", LINE_HT_18);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).contains(USERS[1].name).should("have.css", "font-weight", FONT_WT_400);
    });

    it(`Verify AR ID ${arIdNum} with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_400}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="5"]`)
        .checkStylePropExists({
          content: arIdNum,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify STATUS 'Released' with font-size ${FONT_SIZE_10} font-family ${soraSansserif}  line-height ${LINE_HT_13} font-weight ${FONT_WT_600}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="6"]`)
        .checkStylePropExists({
          content: "Released",
          props: { "font-size": FONT_SIZE_10, "font-family": soraSansserif, "line-height": LINE_HT_13, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify EFFECTIVE DATE ${receivingReleasedDateMonth} with font-size ${FONT_SIZE_14} font-family ${soraSansserif}  line-height ${LINE_HT_20} font-weight ${FONT_WT_400}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="7"]`)
        .checkStylePropExists({
          content: receivingReleasedDateMonth,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20, "font-weight": FONT_WT_400 },
        });
    });
  });

  context("Create a document", () => {
    it("Doc1 with Released status", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drEnterDocumentTitle({ name: "released doc1" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Bulk Create" });
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context(`Verify fonts for Fields labels with bold in the document`, () => {
    it(`Verify 'Document Type' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_19_2}  font-weight ${FONT_WT_600}`, () => {
      cy.contains("Document Type").find("h6").should("have.css", "font-size", FONT_SIZE_12);
      cy.contains("Document Type").find("h6").should("have.css", "font-family", soraSansserif);
      cy.contains("Document Type").find("h6").should("have.css", "line-height", LINE_HT_19_2);
      cy.contains("Document Type").find("h6").should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Document ID' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_19_2}  font-weight ${FONT_WT_600}`, () => {
      cy.contains("Document ID").find("h6").should("have.css", "font-size", FONT_SIZE_12);
      cy.contains("Document ID").find("h6").should("have.css", "font-family", soraSansserif);
      cy.contains("Document ID").find("h6").should("have.css", "line-height", LINE_HT_19_2);
      cy.contains("Document ID").find("h6").should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Revision Stage' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_19_2}  font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="field-revisionStage"]`).parent().contains("Revision Stage").should("have.css", "font-size", FONT_SIZE_12);
      cy.get(`[data-cy="field-revisionStage"]`).parent().contains("Revision Stage").should("have.css", "font-family", soraSansserif);
      cy.get(`[data-cy="field-revisionStage"]`).parent().contains("Revision Stage").should("have.css", "line-height", LINE_HT_19_2);
      cy.get(`[data-cy="field-revisionStage"]`).parent().contains("Revision Stage").should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Attachments' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_19_2}  font-weight ${FONT_WT_600}`, () => {
      cy.get(`#attachmentHeader`).contains("Attachments").should("have.css", "font-size", FONT_SIZE_12);
      cy.get(`#attachmentHeader`).contains("Attachments").should("have.css", "font-family", soraSansserif);
      cy.get(`#attachmentHeader`).contains("Attachments").should("have.css", "line-height", LINE_HT_19_2);
      cy.get(`#attachmentHeader`).contains("Attachments").should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Output Document Type' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15_96}  font-weight ${FONT_WT_600}`, () => {
      cy.get(`[class*="MuiTypography-root MuiTypography-h5"]`).contains("Output Document Type").should("have.css", "font-size", FONT_SIZE_12);
      cy.get(`[class*="MuiTypography-root MuiTypography-h5"]`).contains("Output Document Type").should("have.css", "font-family", soraSansserif);
      cy.get(`[class*="MuiTypography-root MuiTypography-h5"]`).contains("Output Document Type").should("have.css", "line-height", LINE_HT_15_96);
      cy.get(`[class*="MuiTypography-root MuiTypography-h5"]`).contains("Output Document Type").should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Render HTML' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_19_2}  font-weight ${FONT_WT_600}`, () => {
      cy.contains("Render HTML").find("h6").should("have.css", "font-size", FONT_SIZE_12);
      cy.contains("Render HTML").find("h6").should("have.css", "font-family", soraSansserif);
      cy.contains("Render HTML").find("h6").should("have.css", "line-height", LINE_HT_19_2);
      cy.contains("Render HTML").find("h6").should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Approvals' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_24}  font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="form.builder.approvals"]`)
        .checkStylePropExists({
          content: "Approvals",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_24, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Title' as 'released doc1' font-size ${FONT_SIZE_19} font-family ${soraSansserif} line-height ${LINE_HT_27_17} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="field-name"]`)
        .checkStylePropExists({
          content: "released doc1",
          props: { "font-size": FONT_SIZE_19, "font-family": soraSansserif, "line-height": LINE_HT_27_17, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Verify fonts for Fields without bold in the document", () => {
    it(`Verify 'Description text field' as 'test description' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
      cy.get("[data-cy=\"description\"]")
        .checkStylePropExists({
          content: "test description",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify document Type as 'Form' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_15_2} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[id="mui-component-select-document.documentType.id"]`)
        .checkStylePropExists({
          content: "Form",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_15_2, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Document ID field' as ${formId2} font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_15_2} font-weight ${FONT_WT_600}`, () => {
      cy.get("input[name=\"document.docId\"]").should("have.attr", "value", formId2).should("have.css", "font-size", FONT_SIZE_14);
      cy.get("input[name=\"document.docId\"]").should("have.attr", "value", formId2).should("have.css", "font-family", soraSansserif);
      cy.get("input[name=\"document.docId\"]").should("have.attr", "value", formId2).should("have.css", "line-height", LINE_HT_15_2);
      cy.get("input[name=\"document.docId\"]").should("have.attr", "value", formId2).should("have.css", "font-weight", FONT_WT_600);
    });

    it(`Verify 'Alpha' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get("[class=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]")
        .checkStylePropExists({
          content: "Alpha",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'output Document Types field' as 'Bulk Create' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Bulk Create")
        .checkStylePropExists({
          content: "Bulk Create",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'Training Required' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .checkStylePropExists({
          content: "Training Required",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });
  });

  context("Verify Hover over some of the items in the document", () => {
    it(`Verify 'Save button' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"field-retrain\"]")
        .checkStylePropExists({
          content: "Save",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Approve and Release button' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "Approve and Release",
        props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
      });
    });

    it(`Verify 'Change Owner button' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_400}`, () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.checkStylePropExists({
        content: "Change Owner",
        props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_400 },
      });
    });

    it(`Verify 'Send To Email' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        content: "Send To Email",
        props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_400 },
      });
    });
  });

  context(`Click on 'Send To Email'`, () => {
    it(`Click on 'Send To Email'`, () => {
      cy.get("[data-cy=\"exportToEmail\"]").contains("Send To Email").arrowClick();
      cy.get("div.Toastify__toast-container").should("exist");
    });
  });

  context("Add fields and verify fonts for the added fields", () => {
    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("opt1on1", "option2", "option3");
      cy.unClick();
    });

    it(`Verify 'Checkbox group' under FB libraries font-size ${FONT_SIZE_12} font-family ${soraSansserif} and line-height ${LINE_HT_15} font-weight ${FONT_WT_500}`, () => {
      cy.contains("Checkbox group")
        .checkStylePropExists({
          content: "Checkbox group",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_500 },
        });
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify added 'Checkbox group' option2 font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get("[class^=\"MuiTypography-root MuiFormControlLabel-label Mui-disabled MuiTypography-body1\"]")
        .checkStylePropExists({
          content: "option2",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });

    it("Add Blank Template Form", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it(`Verify added 'fb-blank-template' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_24} font-weight ${FONT_WT_600}`, () => {
      cy.get("[data-cy^=\"fb-blank-template\"]")
        .checkStylePropExists({
          content: "fb-blank-template",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_24, "font-weight": FONT_WT_600 },
        });
    });

    it(`Add 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
    });

    it(`Verify 'TEXT FIELD' under FB libraries font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_500}`, () => {
      cy.contains("Text field")
        .checkStylePropExists({
          content: "Text field",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_500 },
        });
    });

    it(`Click on Add button`, () => {
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify added 'TEXT FIELD' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get("[data-cy^=\"TEXT FIELD\"]")
        .checkStylePropExists({
          content: "TEXT FIELD",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Verify The side bar options Revision's fonts", () => {
    it(`Verify Revisions font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_19_2} font-weight ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"note-icon\"]").arrowClick();
      cy.get("[data-cy=\"revision\"]")
        .checkStylePropExists({
          content: "Revision",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_19_2, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Doc ID: ${formId2}' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
      cy.get("[data-cy=\"common.docId\"]")
        .checkStylePropExists({
          content: `Doc ID: ${formId2}`,
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify Owner font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
      cy.get("[data-cy=\"DocumentRevisionList-item\"]");
      cy.get("[data-cy=\"revision\"]")
        .checkStylePropExists({
          content: "Owner",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
        });
    });
  });

  context("Verify The side bar options History's fonts", () => {
    it(`Verify ${USERS[1].name} font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="timeline-icon"]`).arrowClick();
      cy.get(`[data-cy="change-key-0"]`)
        .checkStylePropExists({
          content: USERS[1].name,
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'test description' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="change-value-0-0"]`)
        .checkStylePropExists({
          content: "test description",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify ${formId2} font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_700}`, () => {
      cy.get(`[data-cy="change-value-0-1"]`)
        .checkStylePropExists({
          content: formId2,
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_700 },
        });
    });

    it(`Verify 'released doc1' font-size ${FONT_SIZE_19} font-family ${soraSansserif} line-height ${LINE_HT_27_17} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="change-value-0-2"]`)
        .checkStylePropExists({
          content: "released doc1",
          props: { "font-size": FONT_SIZE_19, "font-family": soraSansserif, "line-height": LINE_HT_27_17, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Everyone' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="change-value-0-4"]`)
        .checkStylePropExists({
          content: "Everyone",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });
  });

  context("Verify The side bar options Access Permissions fonts", () => {
    it(`Verify 'Access Permissions' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get("[data-cy=\"permission-icon\"]").arrowClick();
      cy.get(`[data-cy="Access Permissions"]`)
        .checkStylePropExists({
          content: "Access Permissions",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Selected Users' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "Selected Users",
        props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
      });
    });

    it(`Verify 'Selected Groups' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="Selected-Groups"]`)
        .checkStylePropExists({
          content: "Selected Groups",
          props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Everyone' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_18} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        content: "Everyone",
        props: { "font-size": FONT_SIZE_14, "font-family": sora, "line-height": LINE_HT_18, "font-weight": FONT_WT_400 },
      });
    });
  });

  context("Verify The side bar options Bookmarks's fonts", () => {
    it(`Verify 'Bookmarks' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="bookmark-icon"]`).arrowClick();
      cy.get(`[data-cy="Bookmarks"]`)
        .checkStylePropExists({
          content: "Bookmarks",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Approvals' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_500}`, () => {
      cy.get(`[data-cy="Bookmarks-detail"]`)
        .checkStylePropExists({
          content: "Approvals",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_500 },
        });
    });

    it(`Verify 'fb-blank-template' font-size ${FONT_SIZE_14} font-family ${sora} line-height ${LINE_HT_18} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="Bookmarks-detail"]`).find(".MuiTypography-body1").should("have.css", "font-size", FONT_SIZE_14);
      cy.get(`[data-cy="Bookmarks-detail"]`).find(".MuiTypography-body1").should("have.css", "font-family", sora);
      cy.get(`[data-cy="Bookmarks-detail"]`).find(".MuiTypography-body1").should("have.css", "line-height", LINE_HT_18);
      cy.get(`[data-cy="Bookmarks-detail"]`).find(".MuiTypography-body1").should("have.css", "font-weight", FONT_WT_400);
    });
  });

  context("Verify The side bar options 'Revision History' fonts", () => {
    it(`Verify 'Revision History' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="cr-icon"]`).arrowClick();
      cy.get(`[data-cy="Revision History"]`)
        .checkStylePropExists({
          content: "Revision History",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Verify The side bar options References fonts", () => {
    it("Verify The side bar options References fonts", () => {
      cy.get("[data-cy=\"references-icon\"]").arrowClick();
    });

    it(`Verify the side bar options 'References' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="References"]`)
        .checkStylePropExists({
          content: "References",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'General Info' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="generalInfo"]`)
        .checkStylePropExists({
          content: "General Info",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar owner font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="user-name"]`)
        .checkStylePropExists({
          content: USERS[1].name,
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'References' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="field-referenceTo"]`)
        .checkStylePropExists({
          content: "References",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_18, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'Training' font-size ${FONT_SIZE_13} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="training"]`)
        .checkStylePropExists({
          content: "Training",
          props: { "font-size": FONT_SIZE_13, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify the side bar 'Referenced By' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15_12} font-weight ${FONT_WT_600}`, () => {
      cy.checkStylePropExists({
        content: "Referenced By",
        props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15_12, "font-weight": FONT_WT_600 },
      });
    });

    it(`Verify the side bar 'Release Date' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="releaseDate"]`)
        .checkStylePropExists({
          content: "Release Date",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Click on 'Approve and Release' button", () => {
    it("Click on Approve and Release button", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
    });

    it("Click on Confirm without password entered", () => {
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
    });
  });

  context("Verify 'Approve and Release' dialog window font", () => {
    it(`Verify 'Approve and Release' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get("[class=\"MuiDialogTitle-root\"]")
        .checkStylePropExists({
          content: "Approve and Release",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Approvers' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_15} font-weight ${FONT_WT_600}`, () => {
      cy.get(`[data-cy="field-approvals"]`)
        .checkStylePropExists({
          content: "Approvers",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_15, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Effective date' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_16} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="field-effectiveDate"]`)
        .checkStylePropExists({
          content: "Effective date",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_16, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'Password' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_16} font-weight ${FONT_WT_400}`, () => {
      cy.get(`[data-cy="field-password"]`)
        .checkStylePropExists({
          content: "Password",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_16, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'Required' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_20_02} font-weight ${FONT_WT_400}`, () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]")
        .checkStylePropExists({
          content: "Required",
          props: { "font-size": FONT_SIZE_14, "font-family": soraSansserif, "line-height": LINE_HT_20_02, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'Cancel' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]")
        .checkStylePropExists({
          content: "Cancel",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Confirm' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get("[class=\"MuiButton-label\"]")
        .checkStylePropExists({
          content: "Confirm",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });
  });

  context("Enter correct password and click on 'Confirm' button", () => {
    it("Click on confirm after entering correct password", () => {
      cy.get("input[name=password]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(500);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.poApproveWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Open My Profile", () => {
    it("'Open My Profile", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickMyProfile();
    });

    it(`Verify 'User Profile' font-size ${FONT_SIZE_22_4} font-family ${soraSansserif} line-height ${LINE_HT_26_208} font-weight ${FONT_WT_400}`, () => {
      cy.contains("User Profile")
        .checkStylePropExists({
          content: "User Profile",
          props: { "font-size": FONT_SIZE_22_4, "font-family": soraSansserif, "line-height": LINE_HT_26_208, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'User Name' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get("#DialogTitle-name")
        .checkStylePropExists({
          content: USERS[1].name,
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Groups' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_24} font-weight ${FONT_WT_400}`, () => {
      cy.get("#SummaryBaseProps-label")
        .checkStylePropExists({
          content: "Groups",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_24, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'Groups text message' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_21_28} font-weight ${FONT_WT_400}`, () => {
      cy.get("#SummaryBaseProps-values")
        .checkStylePropExists({
          content: "Owner as approver",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_21_28, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify 'Addresses' font-size ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_25_6} font-weight ${FONT_WT_600}`, () => {
      cy.contains("Addresses")
        .checkStylePropExists({
          content: "Addresses",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_25_6, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Add Addresses' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get("#EditRemoveAddFields-add")
        .checkStylePropExists({
          content: "Add Addresses",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Acct Codes' ${FONT_SIZE_16} font-family ${soraSansserif} line-height ${LINE_HT_25_6} font-weight ${FONT_WT_600}`, () => {
      cy.contains("Acct Codes")
        .checkStylePropExists({
          content: "Acct Codes",
          props: { "font-size": FONT_SIZE_16, "font-family": soraSansserif, "line-height": LINE_HT_25_6, "font-weight": FONT_WT_600 },
        });
    });

    it(`Verify 'Add Acct Codes' font-size ${FONT_SIZE_12} font-family ${soraSansserif} line-height ${LINE_HT_21} font-weight ${FONT_WT_600}`, () => {
      cy.get("#EditRemoveAddFields-add")
        .checkStylePropExists({
          content: "Add Acct Codes",
          props: { "font-size": FONT_SIZE_12, "font-family": soraSansserif, "line-height": LINE_HT_21, "font-weight": FONT_WT_600 },
        });
    });

    it(`Click on 'Add Acct Codes' button and enter 'TC333'`, () => {
      cy.get(`[id="EditRemoveAddFields-add"]`).contains("Add Acct Codes").arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get(`input[placeholder="New Acct Code"]`).arrowType("TC333");
      cy.unClick();
      cy.get("#EditRemoveAddFields-done").contains("Done").arrowClick();
    });

    it(`Verify 'TC333' font-size ${FONT_SIZE_14_16} font-family ${soraSansserif} line-height ${LINE_HT_24_78} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        content: "TC333",
        props: { "font-size": FONT_SIZE_14_16, "font-family": soraSansserif, "line-height": LINE_HT_24_78, "font-weight": FONT_WT_400 },
      });
    });

    it("'Close My Profile", () => {
      cy.get("#DialogContent-close").arrowClick();
    });
  });

  context("[API]Prepare company B", () => {
    it("[API]Creates company B", (done: any) => {
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
          createdCompanyB = response;
          employeeLoginFirst = createdCompanyB.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login first user", (done: any) => {
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

    it(`Selects company A`, () => {
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: true });
    });
  });

  context(`Switch company B`, () => {
    it("Click on User Menu", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickSwitchCompanyButton();
    });

    it(`Verify  'Switch Company' font-size ${FONT_SIZE_26} font-family ${soraSansserif} line-height ${LINE_HT_37_18} font-weight ${FONT_WT_400}`, () => {
      cy.get("#switchCompanyHeader")
        .checkStylePropExists({
          content: "Switch Company",
          props: { "font-size": FONT_SIZE_26, "font-family": soraSansserif, "line-height": LINE_HT_37_18, "font-weight": FONT_WT_400 },
        });
    });

    it(`Verify company B font-size ${FONT_SIZE_18} font-family ${soraSansserif} line-height ${LINE_HT_25_74} font-weight ${FONT_WT_400}`, () => {
      cy.checkStylePropExists({
        content: createdCompanyB.name,
        props: { "font-size": FONT_SIZE_18, "font-family": soraSansserif, "line-height": LINE_HT_25_74, "font-weight": FONT_WT_400 },
      });
    });

    it(`Select Company B`, () => {
      cy.cmpSelectCompany({ name: createdCompanyB.name, multiple: true });
    });
  });
});

export { };
