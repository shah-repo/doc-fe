// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompanyA;
let createdCompanyB;
let loginResponse;
let multipleCompanies;
let employeeLoginFirst;

const docId = "DOC ID";
const docRevision = "REVISION";
const docTitle = "DOCUMENT TITLE";
const docType = "TYPE";
const docOwner = "OWNER";
const arId = "AR ID";
const docStatus = "STATUS";
const effectiveDate = "EFFECTIVE DATE";

const fontFamily = "Sora, sans-serif";
const colFontSize = "14px";
const colFontWeight = "600";
const colLineHeight = "20px";
const colTextUpper = "uppercase";

const itemFontWeight = "400";


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

    it("[API]Login first user", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login first user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });

    it("Selects company A", () => {
      cy.cmpSelectCompany({ name: createdCompanyA.name, multiple: multipleCompanies });
    });
  });

  context("Verify font for login confirmation page", () => {
    it("Logout current user", () => {
      cy.authLogout();
    });

    it("verify login confirmation page", () => {
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").arrowType(USERS[1].email);
      cy.unClick();
      cy.get("[data-cy=\"LoginFormPresenter-password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.unClick();
    });

    // eslint-disable-next-line max-len
    it("Verify login email address font-size 16px font-family 'Sora, sans-serif' line-height 15.2px font-weight 400", () => {
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").should("have.value", "enlil.testmail+cy1@gmail.com")
        .should("have.css", "font-size", "16px");
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").should("have.value", "enlil.testmail+cy1@gmail.com")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").should("have.value", "enlil.testmail+cy1@gmail.com")
        .should("have.css", "line-height", "15.2px");
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").should("have.value", "enlil.testmail+cy1@gmail.com")
        .should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Don't have an account' font-size 16px font-family 'Sora, sans-serif' line-height 21.28px font-weight 400", () => {
      cy.contains("Don't have an account?").should("have.css", "font-size", "16px");
      cy.contains("Don't have an account?").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Don't have an account?").should("have.css", "line-height", "21.28px");
      cy.contains("Don't have an account?").should("have.css", "font-weight", "400");
    });
  });

  context("Login user to dashboard", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({
        USER: USERS[1],
        employeeId: employeeLoginFirst.id,
      });
    });
  });

  context("Navigate to document list", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });
  });

  context("Verify font for nagigation bar 'Document Control'", () => {
    // eslint-disable-next-line max-len
    it("Verify 'Document Control' font-size 13px and font-family 'Sora, sans-serif' font-weight 400", () => {
      cy.contains("Document Control").should("have.css", "font-size", "13px");
      cy.contains("Document Control").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Document Control").should("have.css", "font-weight", "400");
    });
  });

  context("Verify font for nagigation bar user's info name and email", () => {
    // eslint-disable-next-line max-len
    it("Verify 'UserName' font-size 12px font-family 'Sora, sans-serif' line-height 15px font-weight 600", () => {
      cy.get("[data-cy=\"UserName\"]").contains(USERS[1].name).should("have.css", "font-size", "12px");
      cy.get("[data-cy=\"UserName\"]").should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"UserName\"]").should("have.css", "line-height", "15px");
      cy.get("[data-cy=\"UserName\"]").should("have.css", "font-weight", "600");
    });

    // eslint-disable-next-line max-len
    it("Verify 'UserEmail' font-size as 13px and font-family 'Sora, sans-serif' font-weight 600", () => {
      cy.get("[data-cy=\"UserEmail\"]").contains(USERS[1].email).should("have.css", "font-size", "13px");
      cy.get("[data-cy=\"UserEmail\"]").should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"UserName\"]").should("have.css", "line-height", "15px");
      cy.get("[data-cy=\"UserEmail\"]").should("have.css", "font-weight", "600");
    });
  });

  context("Verify font for 'Create a document' button", () => {
    // eslint-disable-next-line max-len
    it("Verify 'Create a document' button font-size 12px font-family 'Sora, sans-serif' line-height 21px font-weight 600", () => {
      cy.get("[data-cy=\"document.revision.create\"]").contains("Create a document")
        .should("have.css", "font-size", "12px");
      cy.get("[data-cy=\"document.revision.create\"]").contains("Create a document")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"document.revision.create\"]").contains("Create a document")
        .should("have.css", "line-height", "21px");
      cy.get("[data-cy=\"document.revision.create\"]").contains("Create a document")
        .should("have.css", "font-weight", "600");
    });
  });

  context("Verify font for Landing page table columns headers", () => {
    // eslint-disable-next-line max-len
    it(`Verify ${docId} font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight} text-transform ${colTextUpper}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docId)
        .should("have.css", "font-size", colFontSize);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docId)
        .should("have.css", "font-family", fontFamily);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docId)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docId)
        .should("have.css", "font-weight", colFontWeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docId)
        .should("have.css", "text-transform", colTextUpper);
    });

    // eslint-disable-next-line max-len
    it(`Verify ${docRevision} font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight} text-transform ${colTextUpper}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docRevision)
        .should("have.css", "font-size", colFontSize);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docRevision)
        .should("have.css", "font-family", fontFamily);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docRevision)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docRevision)
        .should("have.css", "font-weight", colFontWeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docRevision)
        .should("have.css", "text-transform", colTextUpper);
    });

    // eslint-disable-next-line max-len
    it(`Verify ${docTitle} font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight} text-transform ${colTextUpper}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docTitle)
        .should("have.css", "font-size", colFontSize);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docTitle)
        .should("have.css", "font-family", fontFamily);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docTitle)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docTitle)
        .should("have.css", "font-weight", colFontWeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docTitle)
        .should("have.css", "text-transform", colTextUpper);
    });

    // eslint-disable-next-line max-len
    it(`Verify ${docType} font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight} text-transform ${colTextUpper}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docType)
        .should("have.css", "font-size", colFontSize);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docType)
        .should("have.css", "font-family", fontFamily);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docType)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docType)
        .should("have.css", "font-weight", colFontWeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docType)
        .should("have.css", "text-transform", colTextUpper);
    });

    // eslint-disable-next-line max-len
    it(`Verify ${docOwner} font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight} text-transform ${colTextUpper}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docOwner)
        .should("have.css", "font-size", colFontSize);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docOwner)
        .should("have.css", "font-family", fontFamily);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docOwner)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docOwner)
        .should("have.css", "font-weight", colFontWeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docOwner)
        .should("have.css", "text-transform", colTextUpper);
    });

    // eslint-disable-next-line max-len
    it(`Verify ${arId} font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight} text-transform ${colTextUpper}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(arId)
        .should("have.css", "font-size", colFontSize);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(arId)
        .should("have.css", "font-family", fontFamily);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(arId)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(arId)
        .should("have.css", "font-weight", colFontWeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(arId)
        .should("have.css", "text-transform", colTextUpper);
    });

    // eslint-disable-next-line max-len
    it(`Verify ${docStatus} font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight} text-transform ${colTextUpper}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docStatus)
        .should("have.css", "font-size", colFontSize);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docStatus)
        .should("have.css", "font-family", fontFamily);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docStatus)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docStatus)
        .should("have.css", "font-weight", colFontWeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(docStatus)
        .should("have.css", "text-transform", colTextUpper);
    });

    // eslint-disable-next-line max-len
    it(`Verify ${effectiveDate} font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight} text-transform ${colTextUpper}`, () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(effectiveDate)
        .should("have.css", "font-size", colFontSize);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(effectiveDate)
        .should("have.css", "font-family", fontFamily);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(effectiveDate)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(effectiveDate)
        .should("have.css", "font-weight", colFontWeight);
      cy.get(`th[role="columnheader"] span.k-column-title`).contains(effectiveDate)
        .should("have.css", "text-transform", colTextUpper);
    });
  });

  context("Filter document by ID as FM-00001", () => {
    it(`Filter document by ID as FM-00001`, () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "FM-00001" });
    });
  });

  context("Verify font for Landing page table items", () => {
    // eslint-disable-next-line max-len
    it(`Verify document ID 'FM-00001' with font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).contains("FM-00001")
        .should("have.css", "font-size", colFontSize);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).contains("FM-00001")
        .should("have.css", "font-family", fontFamily);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).contains("FM-00001")
        .should("have.css", "line-height", colLineHeight);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="0"]`).contains("FM-00001")
        .should("have.css", "font-weight", itemFontWeight);
    });

    // eslint-disable-next-line max-len
    it(`Verify document title 'AR Form' with font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="2"]`).contains("AR Form")
        .should("have.css", "font-size", colFontSize);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="2"]`).contains("AR Form")
        .should("have.css", "font-family", fontFamily);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="2"]`).contains("AR Form")
        .should("have.css", "line-height", colLineHeight);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="2"]`).contains("AR Form")
        .should("have.css", "font-weight", itemFontWeight);
    });


    // eslint-disable-next-line max-len
    it(`Verify document Owner ${USERS[1].name} with font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).contains(USERS[1].name)
        .should("have.css", "font-size", colFontSize);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).contains(USERS[1].name)
        .should("have.css", "font-family", fontFamily);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).contains(USERS[1].name)
        .should("have.css", "line-height", colLineHeight);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="4"]`).contains(USERS[1].name)
        .should("have.css", "font-weight", itemFontWeight);
    });

    // eslint-disable-next-line max-len
    it(`Verify AR ID 'AR99999' with font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="5"]`).contains("AR99999")
        .should("have.css", "font-size", colFontSize);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="5"]`).contains("AR99999")
        .should("have.css", "font-family", fontFamily);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="5"]`).contains("AR99999")
        .should("have.css", "line-height", colLineHeight);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="5"]`).contains("AR99999")
        .should("have.css", "font-weight", itemFontWeight);
    });

    // eslint-disable-next-line max-len
    it(`Verify document status 'Released' with font-size ${colFontSize} font-family ${fontFamily}  line-height ${colLineHeight} font-weight ${colFontWeight}`, () => {
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="6"]`).contains("Released")
        .should("have.css", "font-size", colFontSize);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="6"]`).contains("Released")
        .should("have.css", "font-family", fontFamily);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="6"]`).contains("Released")
        .should("have.css", "line-height", colLineHeight);
      cy.get(`tr[data-grid-row-index="0"]`).find(`td[data-grid-col-index="6"]`).contains("Released")
        .should("have.css", "font-weight", itemFontWeight);
    });
  });

  context("Create a document", () => {
    it("Doc1 with Released status", () => {
      cy.cmpClickCreateNewDocument();
      cy.drEnterDocumentTitle({ name: "released doc1" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").click().focused().autocompleteSelect("Approval Request");
      cy.unClick();
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Verify fonts for Fields labels with bold in the document", () => {
    // eslint-disable-next-line max-len
    it("Verify 'Document Type' font-size 12px font-family 'Sora, sans-serif' line-height 15px font-weight 400 or bold", () => {
      cy.contains("Document Type").should("have.css", "font-size", "12px");
      cy.contains("Document Type").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Document Type").should("have.css", "line-height", "15px");
      cy.contains("Document Type").should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Document ID' font-size 12px font-family 'Sora, sans-serif' line-height 15px font-weight 400 or bold", () => {
      cy.contains("Document ID").should("have.css", "font-size", "12px");
      cy.contains("Document ID").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Document ID").should("have.css", "line-height", "15px");
      cy.contains("Document ID").should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Revision Stage' font-size 12px font-family 'Sora, sans-serif' line-height 15px font-weight 400 or bold", () => {
      cy.contains("Revision Stage").should("have.css", "font-size", "12px");
      cy.contains("Revision Stage").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Revision Stage").should("have.css", "line-height", "15px");
      cy.contains("Revision Stage").should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Attachments' font-size 12px font-family 'Sora, sans-serif' line-height 15px font-weight as 400 or bold", () => {
      cy.contains("Attachments").should("have.css", "font-size", "12px");
      cy.contains("Attachments").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Attachments").should("have.css", "line-height", "15px");
      cy.contains("Attachments").should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Output Document Type' font-size 12px font-family 'Sora, sans-serif' line-height 15.96px font-weight as 400 or bold", () => {
      cy.contains("Output Document Type").should("have.css", "font-size", "12px");
      cy.contains("Output Document Type").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Output Document Type").should("have.css", "line-height", "15.96px");
      cy.contains("Output Document Type").should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Render HTML' font-size 12px font-family 'Sora, sans-serif' line-height 15px font-weight as 400 or bold", () => {
      cy.contains("Render HTML").should("have.css", "font-size", "12px");
      cy.contains("Render HTML").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Render HTML").should("have.css", "line-height", "15px");
      cy.contains("Render HTML").should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Approvers' font-size 12px font-family 'Sora, sans-serif' line-height 15px font-weight 400 or bold", () => {
      cy.get("[data-cy=\"form.builder.approvers\"]").contains("Approvers")
        .should("have.css", "font-size", "12px");
      cy.get("[data-cy=\"form.builder.approvers\"]").contains("Approvers")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"form.builder.approvers\"]").contains("Approvers")
        .should("have.css", "line-height", "15px");
      cy.get("[data-cy=\"form.builder.approvers\"]").contains("Approvers")
        .should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Title' font-size 12px font-family 'Sora, sans-serif' line-height 15px font-weight 400 or bold", () => {
      cy.get("[data-cy=\"field-name\"]").should("have.css", "font-size", "12px");
      cy.get("[data-cy=\"field-name\"]").should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"field-name\"]").should("have.css", "font-weight", "400");
    });
  });

  context("Verify fonts for Fields without bold in the document", () => {
    // eslint-disable-next-line max-len
    // it("Verify data entered in the title field font-size as 16px font-family as 'Sora, sans-serif' and font-weight as 400 or bold", () => {
    //   cy.get("[data-cy=\"field-name\"]").arrowClick();
    //   cy.get("[class=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]").contains("Alpha")
    //     .should("have.css", "font-family", "Sora, sans-serif");
    //   cy.get("[class=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]").contains("Alpha")
    //     .should("have.css", "line-height", "16px");
    //   cy.get("[class=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]").contains("Alpha")
    //     .then((text: any) => {
    //       expect(text).to.satisfy(() => {
    //         const fw = text.css("font-weight");
    //         return fw === "400" || fw === "bold";
    //       });
    //     });
    //   cy.unClick();
    // });

    // eslint-disable-next-line max-len
    it("Verify 'Description text field' font-size 14px font-family 'Sora, sans-serif' font-weight 400 or bold", () => {
      cy.get("[data-cy=\"description\"]").contains("test description")
        .should("have.css", "font-size", "14px");
      cy.get("[data-cy=\"description\"]").contains("test description")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"description\"]").contains("test description")
        .should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Document Type field' font-size 14px font-family 'Sora, sans-serif' font-weight 400 or bold", () => {
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Form")
        .should("have.css", "font-size", "14px");
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Form")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Form")
        .should("have.css", "font-weight", "400");
    });


    // eslint-disable-next-line max-len
    it("Verify 'Document ID field' font-size 14px font-family 'Sora, sans-serif' font-weight 400 or bold", () => {
      cy.get("input[name=\"document.docId\"]").should("have.attr", "value", "FM-00002")
        .should("have.css", "font-size", "14px");
      cy.get("input[name=\"document.docId\"]").should("have.attr", "value", "FM-00002")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("input[name=\"document.docId\"]").should("have.attr", "value", "FM-00002")
        .should("have.css", "font-weight", "400");
    });


    // eslint-disable-next-line max-len
    it("Verify 'Numeric Alpha' font-size 14px font-family 'Sora, sans-serif' font-weight 400 or bold", () => {
      cy.get("[class=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]").contains("Alpha")
        .should("have.css", "font-size", "14px");
      cy.get("[class=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]").contains("Alpha")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class=\"MuiTypography-root MuiFormControlLabel-label MuiTypography-body1\"]").contains("Alpha")
        .should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'output Document Types field' font-size 14px font-family 'Sora, sans-serif' font-weight 400 or bold", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Approval Request")
        .should("have.css", "font-size", "14px");
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Approval Request")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Approval Request")
        .should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Training Required' font-size 14px font-family 'Sora, sans-serif' font-weight 400 or bold", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("have.css", "font-size", "14px");
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("have.css", "font-weight", "400");
    });
  });

  context("Verify Hover over some of the items in the document", () => {
    // eslint-disable-next-line max-len
    it("Verify 'Save button' font-size 12px font-family 'Sora, sans-serif' font-weight 600 line-height 15px", () => {
      cy.contains("Save").should("have.css", "font-size", "12px");
      cy.contains("Save").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Save").should("have.css", "font-weight", "600");
      cy.contains("Save").should("have.css", "line-height", "15px");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Approve and Release button' font-size 12px font-family 'Sora, sans-serif' font-weight 600 line-height 15px", () => {
      cy.contains("Approve and Release").should("have.css", "font-size", "12px");
      cy.contains("Approve and Release").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Approve and Release").should("have.css", "font-weight", "600");
      cy.contains("Approve and Release").should("have.css", "line-height", "15px");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Change Owner button' font-size 12px font-family 'Sora, sans-serif' font-weight 600 line-height 15px", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.contains("Change Owner").should("have.css", "font-size", "12px");
      cy.contains("Change Owner").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Change Owner").should("have.css", "font-weight", "600");
      cy.contains("Change Owner").should("have.css", "line-height", "15px");
    });

    // eslint-disable-next-line max-len
    it("Verify 'Send To Email' font-size 12px font-family 'Sora, sans-serif' font-weight 600 line-height 15px", () => {
      cy.get("#HeaderMenuButton").arrowClick();
      cy.contains("Send To Email").should("have.css", "font-size", "12px");
      cy.contains("Send To Email").should("have.css", "font-family", "Sora, sans-serif");
      cy.contains("Send To Email").should("have.css", "font-weight", "600");
      cy.contains("Send To Email").should("have.css", "line-height", "15px");
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

    it(`Verify 'Checkbox group' under FB libraries font-size font-family and font-weight`, () => {
      cy.get("[class^=\"MuiTypography-root makeStyles-titleText\"]").contains("Checkbox group")
        .should("have.css", "font-size", "12px");
      cy.get("[class^=\"MuiTypography-root makeStyles-titleText\"]").contains("Checkbox group")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class^=\"MuiTypography-root makeStyles-titleText\"]").contains("Checkbox group")
        .should("have.css", "font-weight", "600");
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Click on Add button`, () => {
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify added 'Checkbox group' option2 font-size font-family and font-weight`, () => {
      cy.get("[class^=\"MuiTypography-root MuiFormControlLabel-label Mui-disabled MuiTypography-body1\"]")
        .contains("option2").should("have.css", "font-size", "12px");
      cy.get("[class^=\"MuiTypography-root MuiFormControlLabel-label Mui-disabled MuiTypography-body1\"]")
        .contains("option2").should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class^=\"MuiTypography-root MuiFormControlLabel-label Mui-disabled MuiTypography-body1\"]")
        .contains("option2").should("have.css", "font-weight", "600");
    });

    it("Add Blank Template Form", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.fbAddNewFieldButton();
      });
    });

    it(`Verify added 'Blank Template' font-size font-family and font-weight`, () => {
      cy.get("[data-cy^=\"fb-blank-template\"]").contains("fb-blank-template")
        .should("have.css", "font-size", "12px");
      cy.get("[data-cy^=\"fb-blank-template\"]").contains("fb-blank-template")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy^=\"fb-blank-template\"]").contains("fb-blank-template")
        .should("have.css", "font-weight", "600");
    });

    it(`Add 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
    });

    it(`Verify 'TEXT FIELD' under FB libraries font-size font-family and font-weight`, () => {
      cy.get("[class^=\"MuiTypography-root makeStyles-titleText\"]").contains("Text field")
        .should("have.css", "font-size", "12px");
      cy.get("[class^=\"MuiTypography-root makeStyles-titleText\"]").contains("Text field")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class^=\"MuiTypography-root makeStyles-titleText\"]").contains("Text field")
        .should("have.css", "font-weight", "600");
    });

    it(`Click on Add button`, () => {
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify added 'TEXT FIELD' font-size font-family and font-weight`, () => {
      cy.get("[data-cy^=\"TEXT FIELD\"]").contains("TEXT FIELD").should("have.css", "font-size", "12px");
      cy.get("[data-cy^=\"TEXT FIELD\"]").contains("TEXT FIELD").should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy^=\"TEXT FIELD\"]").contains("TEXT FIELD").should("have.css", "font-weight", "600");
    });
  });

  context("Verify The side bar options Revision's fonts", () => {
    it(`Verify Revisions font-size font-family font-weight line-height`, () => {
      cy.get("[data-cy=\"note-icon\"]").arrowClick();
      cy.get("[data-cy=\"revision\"]").contains("Revision").should("have.css", "font-size", "14px");
      cy.get("[data-cy=\"revision\"]").contains("Revision").should("have.css", "font-family", "Sora");
      cy.get("[data-cy=\"revision\"]").contains("Revision").should("have.css", "line-height", "20px");
      cy.get("[data-cy=\"revision\"]").contains("Revision").should("have.css", "font-weight", "600");
    });

    it(`Verify Owner font-size font-family font-weight line-height`, () => {
      cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains("Owner")
        .should("have.css", "font-size", "14px");
      cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains("Owner")
        .should("have.css", "font-family", "Sora");
      cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains("Owner")
        .contains("Owner").should("have.css", "line-height", "20px");
      cy.get("[data-cy=\"DocumentRevisionList-item\"]").contains("Owner")
        .should("have.css", "font-weight", "600");
    });
  });

  context("Verify The side bar options History's fonts", () => {
    it("Verify The side bar options History fonts", () => {
      cy.get("[data-cy=\"timeline-icon\"]").arrowClick();
    });
  });

  context("Verify The side bar options Access Permissions fonts", () => {
    it("Verify The side bar options Access Permissions fonts", () => {
      cy.get("[data-cy=\"permission-icon\"]").arrowClick();
    });
  });

  context("Verify The side bar options Bookmarks's fonts", () => {
    it("Verify The side bar options Bookmarks fonts", () => {
      cy.get("[data-cy=\"bookmark-icon\"]").arrowClick();
    });
  });

  context("Verify The side bar options Revision History fonts", () => {
    it("Verify The side bar options Revision History fonts", () => {
      cy.get("[data-cy=\"note-icon\"]").arrowClick();
    });
  });

  context("Verify The side bar options References fonts", () => {
    it("Verify The side bar options References fonts", () => {
      cy.get("[data-cy=\"references-icon\"]").arrowClick();
    });
    //   it("Verify The side bar options MIgration fonts", () => {
    //   });
  });

  context("Approve and Release popup dialog font", () => {
    it("Click on Approve and Release button", () => {
      cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      cy.get("[data-cy=\"ApproveAndRelease-submit\"]").arrowClick();
    });

    it("Verify approve and Release popup dialog font for 'Approve and Release'", () => {
      cy.get("[class=\"MuiDialogTitle-root\"]").contains("Approve and Release")
        .should("have.css", "font-size", "16px");
      cy.get("[class=\"MuiDialogTitle-root\"]").contains("Approve and Release")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class=\"MuiDialogTitle-root\"]").contains("Approve and Release")
        .should("have.css", "font-weight", "600");
      cy.get("[class=\"MuiDialogTitle-root\"]").contains("Approve and Release")
        .should("have.css", "line-height", "21px");
    });

    it("Verify approve and Release popup dialog font for 'Approvers'", () => {
      cy.get("[data-cy=\"field-approvals\"]").contains("Approvers")
        .should("have.css", "font-size", "16px");
      cy.get("[data-cy=\"field-approvals\"]").contains("Approvers")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"field-approvals\"]").contains("Approvers")
        .should("have.css", "font-weight", "400");
      cy.get("[data-cy=\"field-approvals\"]").contains("Approvers")
        .should("have.css", "line-height", "21px");
    });

    it("Verify approve and Release popup dialog font for 'Effective date'", () => {
      cy.get("[data-cy=\"field-effectiveDate\"]").contains("Effective date")
        .should("have.css", "font-size", "16px");
      cy.get("[data-cy=\"field-effectiveDate\"]").contains("Effective date")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"field-effectiveDate\"]").contains("Effective date")
        .should("have.css", "font-weight", "400");
      cy.get("[data-cy=\"field-effectiveDate\"]").contains("Effective date")
        .should("have.css", "line-height", "21px");
    });

    it("Verify approve and Release popup dialog font for 'Password'", () => {
      cy.get("[data-cy=\"field-password\"]").contains("Password")
        .should("have.css", "font-size", "16px");
      cy.get("[data-cy=\"field-password\"]").contains("Password")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"field-password\"]").contains("Password")
        .should("have.css", "font-weight", "400");
      cy.get("[data-cy=\"field-password\"]").contains("Password")
        .should("have.css", "line-height", "21px");
    });

    it("Verify approve and Release popup dialog font for 'Required'", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").contains("Required")
        .should("have.css", "font-size", "12px");
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").contains("Required")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").contains("Required")
        .should("have.css", "font-weight", "400");
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").contains("Required")
        .should("have.css", "line-height", "12px");
    });

    it("Verify approve and Release popup dialog font for 'Cancel' button", () => {
      cy.get("[data-cy=\"transition.action.cancel\"]").contains("Cancel")
        .should("have.css", "font-size", "12px");
      cy.get("[data-cy=\"transition.action.cancel\"]").contains("Cancel")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[data-cy=\"transition.action.cancel\"]").contains("Cancel")
        .should("have.css", "font-weight", "600");
      cy.get("[data-cy=\"transition.action.cancel\"]").contains("Cancel")
        .should("have.css", "line-height", "21px");
    });

    it("Verify approve and Release popup dialog font for 'Confirm' button", () => {
      cy.get("[class=\"MuiButton-label\"]").contains("Confirm")
        .should("have.css", "font-size", "12px");
      cy.get("[class=\"MuiButton-label\"]").contains("Confirm")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class=\"MuiButton-label\"]").contains("Confirm")
        .should("have.css", "font-weight", "600");
      cy.get("[class=\"MuiButton-label\"]").contains("Confirm")
        .should("have.css", "line-height", "21px");
    });
  });

  context("Approve and Release the document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Open My Profile", () => {
    it("'Open My Profile", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickMyProfile();
    });

    // eslint-disable-next-line max-len
    it(`Verify 'User Profile' font-size 22.4px font-family 'Sora, sans-serif' line-height 26.208px font-weight 400`, () => {
      cy.get("[class^=\"MuiTypography-root makeStyles-userProfile\"]").contains("User Profile")
        .should("have.css", "font-size", "22.4px");
      cy.get("[class^=\"MuiTypography-root makeStyles-userProfile\"]").contains("User Profile")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class^=\"MuiTypography-root makeStyles-userProfile\"]").contains("User Profile")
        .should("have.css", "line-height", "26.208px");
      cy.get("[class^=\"MuiTypography-root makeStyles-userProfile\"]").contains("User Profile")
        .should("have.css", "font-weight", "400");
    });

    // eslint-disable-next-line max-len
    it(`Verify 'User Name' font-size 48px font-family 'Sora, sans-serif' line-height 49.92px font-weight 400`, () => {
      cy.get("[class^=\"MuiTypography-root makeStyles-userName\"]").contains(USERS[1].name)
        .should("have.css", "font-size", "48px");
      cy.get("[class^=\"MuiTypography-root makeStyles-userName\"]").contains(USERS[1].name)
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class^=\"MuiTypography-root makeStyles-userName\"]").contains(USERS[1].name)
        .should("have.css", "line-height", "49.92px");
      cy.get("[class^=\"MuiTypography-root makeStyles-userName\"]").contains(USERS[1].name)
        .should("have.css", "font-weight", "400");
    });

    // // eslint-disable-next-line max-len
    // it(`Verify 'Groups' font-size 16px font-family 'Sora, sans-serif' line-height 49.92px font-weight 400`, () => {
    //   cy.get("#SummaryBaseProps-label").contains("Groups")
    //     .should("have.css", "font-size", "16px");
    //   cy.get("#SummaryBaseProps-label").contains("Groups")
    //     .should("have.css", "font-family", "Sora, sans-serif");
    //   cy.get("#SummaryBaseProps-label").contains("Groups")
    //     .should("have.css", "line-height", "49.92px");
    //   cy.get("#SummaryBaseProps-label").contains("Groups")
    //     .should("have.css", "font-weight", "400");
    // });

    // // eslint-disable-next-line max-len
    // it(`Verify 'Groups text message' font-size 16px font-family 'Sora, sans-serif' line-height 26.208px font-weight 400`, () => {
    //   cy.get("#SummaryBaseProps-values").contains("Owner as approver")
    //     .should("have.css", "font-size", "16px");
    //   cy.get("#SummaryBaseProps-values").contains("Owner as approver")
    //     .should("have.css", "font-family", "Sora, sans-serif");
    //   cy.get("#SummaryBaseProps-values").contains("Owner as approver")
    //     .should("have.css", "line-height", "20px");
    //   cy.get("#SummaryBaseProps-values").contains("Owner as approver")
    //     .should("have.css", "font-weight", "400");
    // });

    // eslint-disable-next-line max-len
    it(`Verify 'Addresses' font-size 16px font-family 'Sora, sans-serif' line-height 25.6px font-weight 600`, () => {
      cy.get("[class^=\"MuiTypography-root makeStyles-title\"]").contains("Addresses")
        .should("have.css", "font-size", "16px");
      cy.get("[class^=\"MuiTypography-root makeStyles-title\"]").contains("Addresses")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class^=\"MuiTypography-root makeStyles-title\"]").contains("Addresses")
        .should("have.css", "line-height", "25.6px");
      cy.get("[class^=\"MuiTypography-root makeStyles-title\"]").contains("Addresses")
        .should("have.css", "font-weight", "600");
    });

    // eslint-disable-next-line max-len
    it(`Verify 'Add Addresses' font-size 12px font-family 'Sora, sans-serif' line-height 21px font-weight 600`, () => {
      cy.get("#EditRemoveAddFields-add").contains("Add Addresses")
        .should("have.css", "font-size", "12px");
      cy.get("#EditRemoveAddFields-add").contains("Add Addresses")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("#EditRemoveAddFields-add").contains("Add Addresses")
        .should("have.css", "line-height", "21px");
      cy.get("#EditRemoveAddFields-add").contains("Add Addresses")
        .should("have.css",   "font-weight", "600");
    });

    // eslint-disable-next-line max-len
    it(`Verify 'Acct Codes' font-size 16px font-family 'Sora, sans-serif' line-height 25.6px font-weight 600`, () => {
      cy.get("[class^=\"MuiTypography-root makeStyles-title-\"]").contains("Acct Codes")
        .should("have.css", "font-size", "16px");
      cy.get("[class^=\"MuiTypography-root makeStyles-title-\"]").contains("Acct Codes")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class^=\"MuiTypography-root makeStyles-title-\"]").contains("Acct Codes")
        .should("have.css", "line-height", "25.6px");
      cy.get("[class^=\"MuiTypography-root makeStyles-title-\"]").contains("Acct Codes")
        .should("have.css",   "font-weight", "600");
    });

    // eslint-disable-next-line max-len
    it(`Verify 'Add Acct Codes' font-size 12px font-family 'Sora, sans-serif' line-height 21px font-weight 600`, () => {
      cy.get("#EditRemoveAddFields-add").contains("Add Acct Codes")
        .should("have.css", "font-size", "12px");
      cy.get("#EditRemoveAddFields-add").contains("Add Acct Codes")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("#EditRemoveAddFields-add").contains("Add Acct Codes")
        .should("have.css", "line-height", "21px");
      cy.get("#EditRemoveAddFields-add").contains("Add Acct Codes")
        .should("have.css",   "font-weight", "600");
    });

    it(`Click on 'Add Acct Codes' button and enter 'TC333'`, () => {
      cy.get("#EditRemoveAddFields-add").contains("Add Acct Codes").arrowClick().arrowType("TC333");
      cy.get("#EditRemoveAddFields-done").contains("Done").arrowClick();
    });

    // eslint-disable-next-line max-len
    it(`Verify 'TC333' font-size 12px font-family 'Sora, sans-serif' line-height 25.6px font-weight 400`, () => {
      cy.get("[class^=\"MuiTypography-root makeStyles-title- MuiTypography-subtitle1\"]").contains("test123")
        .should("have.css", "font-size", "12px");
      cy.get("[class^=\"MuiTypography-root makeStyles-title- MuiTypography-subtitle1\"]").contains("test123")
        .should("have.css", "font-family", "Sora, sans-serif");
      cy.get("[class^=\"MuiTypography-root makeStyles-title- MuiTypography-subtitle1\"]").contains("test123")
        .should("have.css", "line-height", "25.6px");
      cy.get("[class^=\"MuiTypography-root makeStyles-title- MuiTypography-subtitle1\"]").contains("test123")
        .should("have.css",   "font-weight", "400");
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

  context("Login first user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });

    it("Selects company B", () => {
      cy.cmpSelectCompany({ name: createdCompanyB.name, multiple: multipleCompanies });
    });
  });

  context("Switch company", () => {
    it("Switch company", () => {
      cy.usrClickUserMenuButton();
      cy.usrClickSwitchCompanyButton();
      cy.cmpSelectCompany({ name: createdCompanyB.name, multiple: multipleCompanies });
    });
  });
});

export { };
