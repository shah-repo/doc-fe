// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;

const ncoFormName = "NCO Form";
const randomNumberForCompany1 = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName1 = "New company " + randomNumberForCompany1;
const newCompanyAbbr1 = "NC-" + randomNumberForCompany1;

const randomNumberForCompany2 = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName2 = "New company " + randomNumberForCompany2;
const newCompanyAbbr2 = "NC-" + randomNumberForCompany2;

// This test is only for demo & run only on demo env
const isContext = Cypress.env("FE_URL").includes("demo.enlil.io")
  ? context : context.skip;

isContext("Test for banner test in demo", () => {
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
            documentTypes: [
              NCORecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
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

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create form for NCO document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${ncoFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: ncoFormName });
    });

    it("Enters description 'New NCO Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New NCO Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'New Company Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create NCO document1 from Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company1" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company1 description" });
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName1}'`, () => {
      cy.get("[name^=company-name-]").focus().arrowType(newCompanyName1);
    });

    it(`Enters company abbriviation '${newCompanyAbbr1}'`, () => {
      cy.get("[name^=company-abbreviation-]").focus().arrowType(newCompanyAbbr1);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").focus().arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").eq(0).arrowClick({ force: true });
    });

    it("Upload DOM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "dam.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").eq(0).arrowClick({ force: true });
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").eq(0).arrowClick({ force: true });
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Upload logo picture 'image.jpg'", () => {
      cy.get("[data-cy=\"albumMediaButton\"]").eq(0).arrowClick({ force: true });
      cy.pmUploadAttachment({ fileName: "image.jpg" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context("Create NCO document2 from Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: ncoFormName, status: "Released" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company2" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company2 description" });
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName2}'`, () => {
      cy.get("[name^=company-name-]").focus().arrowType(newCompanyName2);
    });

    it(`Enters company abbriviation '${newCompanyAbbr1}'`, () => {
      cy.get("[name^=company-abbreviation-]").focus().arrowType(newCompanyAbbr2);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").focus().arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").eq(0).arrowClick({ force: true });
    });

    it("Upload DOM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "dam.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").eq(0).arrowClick({ force: true });
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").eq(0).arrowClick({ force: true });
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login user with Company1", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName1, multiple: multipleCompanies });
    });

    it("Verify default company logo", () => {
      const tmpRegex = new RegExp( `http[s]:\\/\\/.*\\/image`, "gi" );
      cy.get("img[alt=\"Company logo\"]").invoke("attr", "src").should("match", tmpRegex);
    });

    it("Verify banner 'DEMO'", () => {
      cy.get("img[alt=\"Company logo\"]").parent().find("div > span").should("have.text", "DEMO");
    });

    it("Verify 'DEMO is centered and in  white color", () => {
      cy.get("img[alt=\"Company logo\"]").parent().find("div > span")
        .should("have.css", "text-align", "center");
      cy.get("img[alt=\"Company logo\"]").parent().should("have.css", "color", "rgb(255, 255, 255)");
    });

    it("Verify background color of the banner", () => {
      cy.get("img[alt=\"Company logo\"]").parent().find("div")
        .should("have.css", "background", "rgb(3, 192, 193) none repeat scroll 0% 0% / auto padding-box border-box");
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify banner 'DEMO'", () => {
      cy.get("img[alt=\"Company logo\"]").parent().find("div > span").should("have.text", "DEMO");
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login user with Company2", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName2, multiple: multipleCompanies });
    });

    it("Verify banner 'DEMO'", () => {
      cy.get("img[alt=\"Company logo\"]").parent().find("div > span").should("have.text", "DEMO");
    });

    it("Verify 'DEMO is centered and in  white color", () => {
      cy.get("img[alt=\"Company logo\"]").parent().find("div > span")
        .should("have.css", "text-align", "center");
      cy.get("img[alt=\"Company logo\"]").parent().should("have.css", "color", "rgb(255, 255, 255)");
    });

    it("Verify background color of the banner", () => {
      cy.get("img[alt=\"Company logo\"]").parent().find("div")
        .should("have.css", "background", "rgb(3, 192, 193) none repeat scroll 0% 0% / auto padding-box border-box");
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Verify banner 'DEMO'", () => {
      cy.get("img[alt=\"Company logo\"]").parent().find("div > span").should("have.text", "DEMO");
    });
  });
});
