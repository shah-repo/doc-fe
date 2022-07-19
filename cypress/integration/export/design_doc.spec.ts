/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { pdfFooterDate } from "../../utils/constants/dateHandler";
import { DesignDocument } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let pdfContent;
const pages = ["", ""];
let arId;
let docId;
let tmpRegex;

context("Export internal doc - Design Document", () => {
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
    it("[API]Create company", (done: any) => {
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
            documentTypes: [
              DesignDocument,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a DD", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on Create New button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "DD doc" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "DD document description" });
    });

    it("Select 'Design Document' document type", () => {
      cy.drSelectDocumentType({ documentType: "Design Document" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release the form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Get ids", () => {
      cy.drGetChangeRequestLinkElementFromUI().should("contain.text", "AR-").then(($lnEl: JQuery<HTMLElement>) => {
        arId = $lnEl.text();
      });

      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        docId = $docIdElement.text();
      });
    });
  });

  context("Check pdf email and get content", () => {
    it("Get pdf content", () => {
      cy.getExportPdfContent({ status: STATUS_TYPES_LABEL.RELEASED, filename: "-1-DD-doc" }).then((data) => {
        pdfContent = data;
      });
    });
  });

  context("Verify PDF file content", () => {
    it("Extract texts from PDF file content", () => {
      expect(pdfContent.numpages).eq(2);
      expect(pdfContent.text).match(/Page 1 of 2/);
      expect(pdfContent.text).match(/Page 2 of 2/);
      tmpRegex = new RegExp( "\\n\\n");
      const arr = pdfContent.text.split(tmpRegex);
      arr.forEach((element) => {
        if (element.includes("Page 1 of 2")) {
          pages[0] = element;
        }
        if (element.includes("Page 2 of 2")) {
          pages[1] = element;
        }
      });
    });

    it("Verify page 1 of DD document", () => {
      const el = pages[0];
      if (el.includes("Page 1 of 2")) {
        tmpRegex = new
        RegExp( `Design Document\n${docId}, Revision 1\nDD DOC`, "gi" );
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp( `AR ID\\n${arId}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Description\nDD document description/);

        expect(el).match(/Attachments/);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 1 of 2/);
      }
    });

    it("Verify page 2 of DD document", () => {
      const el = pages[1];
      if (el.includes("Page 2 of 2")) {
        tmpRegex = new
        RegExp( `Design Document\n${docId}, Revision 1\nDD DOC`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Approval History\nAR IDREVDESCRIPTION OF CHANGEEFFECTIVE DATE/);
        tmpRegex = new RegExp( `${arId}1N\\/A \\(Numeric Release\\)${pdfFooterDate}`, "gi" );
        expect(el).match(tmpRegex);

        expect(el).match(/Released/);

        tmpRegex = new RegExp(`Print: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        tmpRegex = new RegExp(`Effective Date: ${pdfFooterDate}`, "gi");
        expect(el).match(tmpRegex);

        expect(el).match(/Page 2 of 2/);
      }
    });
  });

});

export { };

