/* eslint-disable max-len */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { Seed } from "../../utils/constants/documentTypes/seed";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

context("Create Company Without Logo Golden Tenant", () => {
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
    SystemRequirement("REQ-3490");
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
              Seed,
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
      // SystemRequirement("REQ-0140");
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
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });
  context("Create NCO document from Form", () => {
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
      cy.drEnterDocumentTitle({ name: "New Company" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company description" });
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      SystemRequirement("REQ-3500");
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
    });

    it("Upload Page Details JSON", () => {
      SystemRequirement("REQ-3530");
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "PageDetails.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
    });

    it("Upload Navigation JSON", () => {
      SystemRequirement("REQ-3540");
      cy.atchUploadNavigationJSONForNCO({ fileName: "navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      SystemRequirement("REQ-3550");
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Verify the empty fields for white label", () => {
      cy.get("[data-cy^=\"default-background-\"]>div>input").should("have.text", "");
      cy.get("[data-cy^=\"primary-\"]>div>input").should("have.text", "");
      cy.get("[data-cy^=\"secondary-\"]>div>input").should("have.text", "");
    });

    it("Upload correct DAM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "dam.json", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      SystemRequirement("REQ-3600");
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });

    it("Verify default Background company color", () => {
      cy.get("#navigation").should("have.css", "background-color", "rgb(18, 27, 33)");
    });

    it("Logo field is empty and Verify default company logo", () => {
      cy.get(`img[alt="Company logo"]`).should("have.attr", "src", "/logo_enlil.svg");
    });

    it("Verify left default Background company color", () => {
      cy.get("#navigation").should("have.css", "background-color", "rgb(18, 27, 33)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Dashboard", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(0)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Document Control", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(1).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(1)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Equipment", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(2).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(2)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Supplier Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(3).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(3)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Purchase orders", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(4).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(4)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Receiving", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(5).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(5)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");

    });

    it("Verify that tabs are lighter color when they are hovered over on Manfacturing", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(6).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(6)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on Group Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(7).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(7)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");
    });

    it("Verify that tabs are lighter color when they are hovered over on User Management", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(8).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(8)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");

    });

    it("Verify that tabs are lighter color when they are hovered over on Training", () => {
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(9).should("have.css", "background-color", "rgb(18, 27, 33)");
      cy.get(".MuiButtonBase-root.MuiListItem-root").eq(9)
        .realHover().wait(500).should("have.css", "background-color", "rgb(50, 66, 78)");

    });

    it("Verify the Dev logo", () => {
      cy.get(`img[alt="Company logo"]`).should("have.attr", "src", "/logo_enlil.svg");
    });

    it("Verify the profile dropdown", () => {
      cy.get("[data-cy=\"header-userInitials\"]").eq(0).contains("GR").trigger("mousedown");
    });
  });
});

export { };
