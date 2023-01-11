// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

context("NCO document type management", () => {
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
      cy.wait(1000);
    });

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company description" });
    });

    it("Select 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
    });

    it("Upload correct DAM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "doc_type_DAM.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "doc_type_page_details.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release document - create company", () => {
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

    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
    });

    it("Click on 'Add Document Type'", () => {
      cy.dtmClickAddDocumentType();
    });

    it("Check for all fields inside newly added row", () => {
      cy.get("[data-grid-row-index='0']>td>input").eq(0).should("exist");
      cy.get("[data-grid-row-index='0']>td>input").eq(1).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(0).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(1).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(2).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(3).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(4).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>span>input").should("exist");
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(3).contains("Select Item").should("exist");
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(5).contains("Select Item").should("exist");
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(7).contains("Select Item").should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(5).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>input").eq(5).should("be.disabled");
      cy.get("[data-grid-row-index='0']>td>span>svg").eq(0).should("exist");
      cy.get("[data-grid-row-index='0']>td>span>svg").eq(1).should("exist");
    });


    it("Select LHR for Group and check if Equipment Prod Enforce will be enabled", () => {
      cy.dtmSelectGroup({ group: "LHR" });
      cy.get("[data-grid-row-index='0']>td>span>input").eq(5).should("be.enabled");
    });

    it("Cancel newly created document creation", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(1).arrowClick({ force: true });
    });

    it("Check filters for document type management", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("left");
      cy.filterDocTypeManagement({
        status: "Active", documentType: "Receivable", acronym: "RC-",
        privateNumber: "Yes", redline: "No", qms: "Yes", needsSignature: "Yes", training: "No",
        startingNumber: "1", revisionStage: "Numeric", group: "RECEIVABLE",
        equipmentProdEnforce: "No", category: "Receive",
      });
    });

    it("Clear Filters", () => {
      cy.dtmClearFilters();
    });

    it("Click on 'Add Document Type'", () => {
      cy.dtmClickAddDocumentType();
    });
  });

  context("Add new Doc Type", () => {
    it("Add Document type name", () => {
      cy.dtmAddDocType({ docType: "Red" });
    });

    it("Add Acronym", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("left");
      cy.dtmAddAcronym({ acronym: "RED" });
    });

    it("Check Private Number checkbox", () => {
      cy.dtmSelectPrivateNumber();
    });

    it("Check Redline checkbox", () => {
      cy.dtmSelectRedline();
    });

    it("Check QMS checkbox", () => {
      cy.dtmSelectQMS();
    });

    it("Check Needs Signature checkbox", () => {
      cy.dtmSelectNeedsSignature();
    });

    it("Check Training checkbox", () => {
      cy.dtmSelectTraining();
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("center").wait(1000);
    });

    it("Add Starting Number", () => {
      cy.dtmAddStartingNumber({ startingNumber: "000" });
    });
    it("Select Revision Stage 'Numeric'", () => {
      cy.dtmSelectRevisionStage({ revisionStage: "Numeric" });
    });

    it("Select Users Without Tags 'DOCUMENT_TYPE_MANAGEMENT'", () => {
      cy.dtmSelectUsersWithoutTags({ usersWithoutTags: "DOCUMENT_TYPE_MANAGEMENT" });
    });

    it("Select Group 'OTHER'", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("right").wait(1000);
      cy.dtmSelectGroup({ group: "OTHER" });
    });

    it("Create Doc Type", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      cy.landingPageLoadingElementShouldAppear();
    });
  });

  context("Edit Doc Type", () => {
    it("Click on edit added Doc Type", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
    });

    it("Edit Document type name", () => {
      cy.dtmAddDocType({ docType: "Yellow" });
    });

    it("Edit Acronym", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("left");
      cy.dtmAddAcronym({ acronym: "YEL" });
    });

    it("Confirm Edit added Doc Type", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Check Export button", () => {
    it("Click 'Export DAM details'", () => {
      cy.get("button").contains("Export DAM Details").arrowClick();
    });

    it("Set file name of exported details", () => {
      cy.get("#ExportDAMDetails-fileName").arrowType("ExportDAM");
      cy.get("[data-cy='ExportDAMDetails-downloadButton']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Make newly added Doc type inactive", () => {
    it("Search for 'Yellow' Doc Type", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("Yellow").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(1).arrowType("YEL").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on edit added Doc Type", () => {
      cy.wait(1500);
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span>span>button").eq(0).arrowClick();
    });

    it("Inactivate doc type", () => {
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(0).arrowClick();
      cy.get("li").contains("Inactive").arrowClick();
    });

    it("Confirm Edit added Doc Type", () => {
      cy.wait(1500);
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span>span>button").eq(0).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Delete newly added Doc type", () => {
    it("Click on delete Doc Type", () => {
      cy.wait(1500);
      // eslint-disable-next-line max-len
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span>span>button").eq(1).arrowClick({ force: true });
    });

    it("Confirm deleted Doc Type is no longer in the list", () => {
      cy.get(`[class="k-grid-norecords"]`).should("have.text", "No results found");
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login as admin user and obsolete NCO document", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select released NCO Form", () => {
      cy.drFilterDocListByNameAndStatus({ title: "New company", status: "Released" });
    });

    it("Revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Select 'Obsolete' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Log out user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Check if company is deleted", () => {
      cy.cmpCompanyDoesntExist({ name: newCompanyName, multiple: multipleCompanies });
    });
  });
});

export { };

