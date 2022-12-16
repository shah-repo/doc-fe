// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
const ncoFormName = "NCO Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

context("NCO document type management with record doc type", () => {
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
      SystemRequirement("REQ-5140", "REQ-5150");
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Approve and release document - create company", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Log out user", () => {
      cy.authLogout();
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });

    it("Navigate to document type management", () => {
      cy.navigToDocumentTypeManagement();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Add Document Type'", () => {
      cy.wait(2000);
      cy.dtmClickAddDocumentTypeNw();
    });
  });

  context("Add new Doc Type", () => {
    it("Add Document type name", () => {
      cy.dtmAddDocType({ docType: "Green" });
    });

    it("Add Acronym", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("left");
      cy.dtmAddAcronym({ acronym: "GRN-" });
    });

    it("Check Private Number checkbox", () => {
      cy.dtmSelectPrivateNumber();
    });

    it("Check QMS checkbox", () => {
      cy.dtmSelectQMS();
    });

    it("Check Needs Signature checkbox", () => {
      cy.dtmSelectNeedsSignature();
    });

    it("Add Starting Number", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("center").wait(1000);
      cy.dtmAddStartingNumber({ startingNumber: "{backspace}2000" });
    });

    it("Select Revision Stage 'Numeric'", () => {
      cy.dtmSelectRevisionStage({ revisionStage: "Numeric" });
    });

    it("Select Group 'OTHER'", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("right").wait(1000);
      cy.dtmSelectGroup({ group: "OTHER" });
    });

    it("Create Doc Type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentTypes, () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Edit doc type", () => {
    it("Filter DocType name", () => {
      cy.dtmClearFilters();
      cy.get("[class=\"k-textbox\"]").eq(0).arrowType("Green").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on edit added Doc Type", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      cy.wait(1000);
    });

    it("Edit Revision Stage", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("center").wait(1000);
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(3).contains("Numeric").arrowClick();
      cy.get("li").contains("Alpha").arrowClick();
    });

    it("Edit Group", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("right").wait(1000);
      cy.dtmSelectGroup({ group: "RECORD" });
    });

    it("Edit Category", () => {
      cy.dtmAddCategory({ category: "Record" });
    });

    it("Confirm Edit added Doc Type", () => {
      SystemRequirement("REQ-5120");
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocType, () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });
  });

  context("Check Document List creation for new doc type", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'Green Form'", () => {
      cy.drEnterDocumentTitle({ name: "Green Form" });
    });

    it("Enter description 'Green Form description'", () => {
      cy.drEnterDocumentDescription({ description: "Green Form description" });
    });

    it("Check that 'Green' document type is not in the dropdown and select 'Form'", () => {
      cy.get("[data-cy=\"select.document.documentType.id\"]").arrowClick();
      cy.get(`[data-cy="selectItem.document.documentType.id.Green}"]`).should("not.exist");
      cy.get(`[data-cy="selectItem.document.documentType.id.Form"]`).arrowClick();
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Green" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Check Records creation for new doc type", () => {
    it("Navigate to document list", () => {
      cy.navigToRecords();
    });

    it("Click Create a Record button", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Check if 'Green' is in the list", () => {
      cy.get("[id=\"MultipleFormTemplate-selectDocForm\"]").arrowClick();
      cy.get("div[id^=react-select]").contains("Green").should("exist");
      cy.get("div[id^=react-select]").contains("Green").arrowClick();
    });

    it("Enter title 'Green Record Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "Green Record Document Revision" });
    });

    it("Enter description 'Green Record Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "Green ecord Document Revision description" });
    });

    it("Add approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].email });
    });

    it("Save record", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    context("Create bulk records", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve record", () => {
        cy.ebApprove();
      });
    });
  });

  context("Try to edit doc type name and acronym", () => {
    it("Navigate to document type management", () => {
      cy.navigToDocTypeManagement();
    });

    it("Clear filters", () => {
      cy.dtmClearFilters();
    });

    it("Filter Acronym", () => {
      cy.get("[class=\"k-textbox\"]").eq(1).arrowType("GRN").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on edit added Doc Type", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      cy.wait(1000);
    });

    it("Edit Document type name", () => {
      cy.dtmAddDocType({ docType: "Light Green" });
    });

    it("Confirm Edit added Doc Type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocType, () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "Document type name and acronym can't be edited because documents based on it exist.",
      });
      cy.closeAllAlertMessages();
    });

    it("Filter DocType name", () => {
      cy.dtmClearFilters();
      cy.get("[class=\"k-textbox\"]").eq(0).arrowType("Green").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on edit added Doc Type", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      cy.wait(1000);
    });

    it("Edit Document type name", () => {
      cy.get("[class='k-grid-content k-virtual-content']").scrollTo("left");
      cy.dtmAddAcronym({ acronym: "LGR-" });
    });

    it("Confirm Edit added Doc Type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocType, () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "Document type name and acronym can't be edited because documents based on it exist.",
      });
      cy.closeAllAlertMessages();
    });
  });

  context("Inactivate doc type", () => {
    it("Filter DocType name", () => {
      cy.dtmClearFilters();
      cy.get("[class=\"k-textbox\"]").eq(0).arrowType("Green").wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on edit added Doc Type", () => {
      cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      cy.wait(1000);
    });

    it("Inactivate doc type", () => {
      cy.get("[data-grid-row-index='0']>td>span>span>span").eq(0).arrowClick();
      cy.get("li").contains("Inactive").arrowClick();
    });

    it("Confirm Edit added Doc Type", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocType, () => {
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(0).arrowClick();
      });
      cy.landingPageLoadingElementShouldNotExist();
    });

    context("Check that doc type can't be deleted", () => {
      it("Click on delete Doc Type", () => {
        cy.wait(2000);
        cy.get("[data-grid-row-index='0']>td[data-grid-col-index='16']>span").eq(1).arrowClick();
      });

      // Currenty there is no error message from system when you try to delete - it should be
      // it("Verify error message", () => {
      //   cy.checkToastMessageIsEqual({
      //     message: "Document type name and acronym can't be edited because documents based on it exist.",
      //   });
      //   cy.closeAllAlertMessages();
      // });

      it("Log out user", () => {
        cy.authLogout();
      });
    });
  });

  context("Obsolete NCO document", () => {
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

    it("Save document", () => {
      cy.drClickReviseDocument();
    });

    it("Select 'Obsolete' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
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

